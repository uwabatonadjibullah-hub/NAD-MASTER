package nad.master

import android.app.Dialog
import android.os.Bundle
import android.widget.EditText
import android.widget.LinearLayout
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import nad.master.databinding.FragmentQuranBinding

/**
 * Quran tracker fragment — reads and updates memorization progress in Firestore.
 */
class QuranFragment : Fragment() {

    private var _binding: FragmentQuranBinding? = null
    private val binding get() = _binding!!

    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentQuranBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadProgress()
        binding.btnUpdateQuranProgress.setOnClickListener { showUpdateDialog() }
    }

    private fun loadProgress() {
        val uid = auth.currentUser?.uid ?: return
        db.collection("users").document(uid).collection("quran").document("progress")
            .addSnapshotListener { snapshot, _ ->
                if (snapshot == null || !snapshot.exists()) return@addSnapshotListener
                val juzz = snapshot.getLong("juzzCompleted")?.toInt() ?: 0
                val surah = snapshot.getString("currentSurah") ?: "Not started"
                binding.tvCurrentSurah.text = surah
                binding.tvJuzzProgress.text = "$juzz / 30 Juzz"
                binding.quranProgressBar.progress = juzz
            }
    }

    private fun showUpdateDialog() {
        val context = requireContext()
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(64, 32, 64, 32)
        }
        val etSurah = EditText(context).apply { hint = "Current Surah" }
        val etJuzz  = EditText(context).apply { hint = "Juzz completed (0–30)"; inputType = android.text.InputType.TYPE_CLASS_NUMBER }
        layout.addView(etSurah); layout.addView(etJuzz)

        AlertDialog.Builder(context)
            .setTitle("Update Quran Progress")
            .setView(layout)
            .setPositiveButton("Save") { _, _ ->
                val juzz = etJuzz.text.toString().toIntOrNull() ?: return@setPositiveButton
                val surah = etSurah.text.toString().ifBlank { return@setPositiveButton }
                saveProgress(surah, juzz)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun saveProgress(surah: String, juzz: Int) {
        val uid = auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            try {
                db.collection("users").document(uid).collection("quran").document("progress")
                    .set(mapOf("currentSurah" to surah, "juzzCompleted" to juzz))
                    .await()
                Toast.makeText(requireContext(), "Progress saved!", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
