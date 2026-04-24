package nad.master

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import nad.master.databinding.FragmentDhikrBinding

/**
 * Dhikr counter fragment. Tracks SubhanAllah / Alhamdulillah / Allahu Akbar counts.
 * Persists daily totals to Firestore.
 */
class DhikrFragment : Fragment() {

    private var _binding: FragmentDhikrBinding? = null
    private val binding get() = _binding!!

    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    // In-memory counters — reset on each session; Firestore accumulates totals
    private val counts = mutableMapOf("subhanallah" to 0, "alhamdulillah" to 0, "allahuakbar" to 0)
    private var selectedDhikr = "subhanallah"

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDhikrBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Chip selection
        binding.dhikrChipGroup.setOnCheckedStateChangeListener { _, checkedIds ->
            selectedDhikr = when (checkedIds.firstOrNull()) {
                R.id.chipSubhanallah   -> "subhanallah"
                R.id.chipAlhamdulillah -> "alhamdulillah"
                R.id.chipAllahuAkbar   -> "allahuakbar"
                else                   -> "subhanallah"
            }
            updateCountDisplay()
        }
        binding.chipSubhanallah.isChecked = true

        binding.btnDhikrTap.setOnClickListener {
            counts[selectedDhikr] = (counts[selectedDhikr] ?: 0) + 1
            updateCountDisplay()
            // Auto-save to Firestore every 33 counts
            val count = counts[selectedDhikr] ?: 0
            if (count % 33 == 0) persistToFirestore()
        }

        binding.btnResetDhikr.setOnClickListener {
            counts[selectedDhikr] = 0
            updateCountDisplay()
        }
    }

    private fun updateCountDisplay() {
        binding.tvDhikrCount.text = (counts[selectedDhikr] ?: 0).toString()
    }

    private fun persistToFirestore() {
        val uid = auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            try {
                val today = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
                    .format(java.util.Date())
                db.collection("users").document(uid).collection("dhikr").document(today)
                    .set(counts.mapKeys { it.key }, SetOptions.merge())
                    .await()
            } catch (e: Exception) {
                // Silent fail — non-critical
            }
        }
    }

    override fun onDestroyView() {
        persistToFirestore() // Save on exit
        super.onDestroyView()
        _binding = null
    }
}
