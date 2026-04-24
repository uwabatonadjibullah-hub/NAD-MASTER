package nad.master

import android.app.Dialog
import android.os.Bundle
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.DialogFragment
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

/**
 * Dialog fragment for adding a new schedule block.
 */
class AddScheduleDialogFragment(
    private val onSave: (title: String, time: String, type: String, sub: String) -> Unit
) : DialogFragment() {

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val context = requireContext()
        val layout = android.widget.LinearLayout(context).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(64, 32, 64, 32)
        }

        val etTitle = TextInputEditText(context).apply { hint = "Title (e.g. Fajr Prayer)" }
        val etTime  = TextInputEditText(context).apply { hint = "Time (e.g. 04:30 - 05:00)" }
        val etSub   = TextInputEditText(context).apply { hint = "Description (optional)" }
        val etType  = TextInputEditText(context).apply { hint = "Type: religious / serious / slack" }

        listOf(etTitle, etTime, etSub, etType).forEach { layout.addView(it) }

        return AlertDialog.Builder(context)
            .setTitle("Add Schedule Block")
            .setView(layout)
            .setPositiveButton("Save") { _, _ ->
                onSave(
                    etTitle.text.toString(),
                    etTime.text.toString(),
                    etType.text.toString().ifBlank { "serious" },
                    etSub.text.toString()
                )
            }
            .setNegativeButton("Cancel", null)
            .create()
    }
}
