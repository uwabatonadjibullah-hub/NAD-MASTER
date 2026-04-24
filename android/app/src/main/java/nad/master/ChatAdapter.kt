package nad.master

import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

/**
 * Chat message adapter rendering user and assistant bubbles.
 */
class ChatAdapter(private val messages: List<ChatMessage>) :
    RecyclerView.Adapter<ChatAdapter.MessageViewHolder>() {

    class MessageViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvMessage: TextView = view.findViewById(android.R.id.text1)
        val container: LinearLayout = view as LinearLayout
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val context = parent.context
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = ViewGroup.MarginLayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).also { it.setMargins(0, 8, 0, 8) }
            setPadding(16, 0, 16, 0)
        }
        val tv = TextView(context).apply {
            id = android.R.id.text1
            setPadding(32, 20, 32, 20)
            textSize = 14f
            maxWidth = (context.resources.displayMetrics.widthPixels * 0.80).toInt()
        }
        layout.addView(tv)
        return MessageViewHolder(layout)
    }

    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        val msg = messages[position]
        val isUser = msg.role == "user"

        holder.tvMessage.apply {
            text = msg.text
            setTextColor(if (isUser) 0xFF_15_13_12.toInt() else 0xFF_E7_E1_E0.toInt())
            setBackgroundColor(if (isUser) 0xFF_D6_C3_B5.toInt() else 0xFF_27_23_20.toInt())
        }

        // Align right for user, left for assistant
        holder.container.gravity = if (isUser) Gravity.END else Gravity.START
    }

    override fun getItemCount() = messages.size
}
