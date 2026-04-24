package nad.master

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

/**
 * Simple RecyclerView adapter for schedule blocks.
 */
class ScheduleAdapter(private val items: List<Map<String, Any>>) :
    RecyclerView.Adapter<ScheduleAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(android.R.id.text1)
        val tvSub: TextView = view.findViewById(android.R.id.text2)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_2, parent, false)
        view.setBackgroundColor(0x1A_D6_C3_B5.toInt())
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.tvTitle.text = "${item["time"]} — ${item["title"]}"
        holder.tvTitle.setTextColor(0xFF_E7_E1_E0.toInt())
        holder.tvSub.text = item["sub"]?.toString() ?: item["type"]?.toString() ?: ""
        holder.tvSub.setTextColor(0xFF_9E_94_90.toInt())
    }

    override fun getItemCount() = items.size
}
