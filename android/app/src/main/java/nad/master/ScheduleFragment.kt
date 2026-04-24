package nad.master

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import nad.master.databinding.FragmentScheduleBinding

/**
 * Displays and manages the user's daily schedule blocks from Firestore.
 */
class ScheduleFragment : Fragment() {

    private var _binding: FragmentScheduleBinding? = null
    private val binding get() = _binding!!

    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()
    private val scheduleItems = mutableListOf<Map<String, Any>>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentScheduleBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.scheduleRecycler.layoutManager = LinearLayoutManager(requireContext())
        loadSchedule()

        binding.fabAddSchedule.setOnClickListener {
            showAddScheduleDialog()
        }
    }

    private fun loadSchedule() {
        val uid = auth.currentUser?.uid ?: return
        db.collection("users").document(uid).collection("schedule")
            .orderBy("time", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) return@addSnapshotListener
                scheduleItems.clear()
                for (doc in snapshot.documents) {
                    doc.data?.let { scheduleItems.add(it) }
                }
                // Refresh adapter
                binding.scheduleRecycler.adapter?.notifyDataSetChanged()
                    ?: run {
                        binding.scheduleRecycler.adapter = ScheduleAdapter(scheduleItems)
                    }
            }
    }

    private fun showAddScheduleDialog() {
        val dialog = AddScheduleDialogFragment { title, time, type, sub ->
            saveScheduleBlock(title, time, type, sub)
        }
        dialog.show(parentFragmentManager, "AddSchedule")
    }

    private fun saveScheduleBlock(title: String, time: String, type: String, sub: String) {
        val uid = auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            try {
                db.collection("users").document(uid).collection("schedule")
                    .add(mapOf("title" to title, "time" to time, "type" to type, "sub" to sub))
                    .await()
                Toast.makeText(requireContext(), "Block added!", Toast.LENGTH_SHORT).show()
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
