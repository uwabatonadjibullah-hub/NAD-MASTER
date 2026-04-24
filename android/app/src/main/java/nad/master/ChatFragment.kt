package nad.master

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.serverTimestamp
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import nad.master.databinding.FragmentChatBinding

data class ChatMessage(val role: String, val text: String)

/**
 * AI Chat fragment powered by Google Gemini (via BuildConfig.GEMINI_API_KEY,
 * injected from the GEMINI_AI_KEY GitHub Actions secret at build time).
 *
 * Mirrors the web app's NAD MASTER mentor persona and saves conversation
 * history to the user's Firestore sub-collection.
 */
class ChatFragment : Fragment() {

    private var _binding: FragmentChatBinding? = null
    private val binding get() = _binding!!

    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    private val messages = mutableListOf<ChatMessage>()
    private lateinit var chatAdapter: ChatAdapter
    private lateinit var generativeModel: GenerativeModel

    private val SYSTEM_PROMPT = """
        You are NAD MASTER, an elite disciplined mentor for spiritual and scholarly evolution.
        CORE MANDATES:
        1. Hifz Strategist (PRIORITY): Analyze user Quran progress and propose personalized memorization plans.
        2. Master of Routine: Optimize daily schedule blocks. Turn dead time into Muraja (revision) or Dhikr.
        3. Tone: Authoritative, scholarly, and precise — like a traditional Hifz teacher and modern performance coach.
        4. Action-First: Propose concrete plans with specific targets.
        5. Multilingual: Adapt to English, Arabic, French, or Indonesian.
    """.trimIndent()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentChatBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize Gemini model with the injected API key
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isBlank()) {
            Toast.makeText(requireContext(), "Gemini API key not configured.", Toast.LENGTH_LONG).show()
            return
        }
        generativeModel = GenerativeModel(
            modelName = "gemini-1.5-pro",
            apiKey = apiKey,
            systemInstruction = content { text(SYSTEM_PROMPT) }
        )

        // Add welcome message
        messages.add(ChatMessage("assistant", "Peace be upon you. I am your NAD MASTER AI mentor. How may I assist you with your studies or Hifz today?"))
        chatAdapter = ChatAdapter(messages)
        binding.chatRecycler.apply {
            layoutManager = LinearLayoutManager(requireContext()).also { it.stackFromEnd = true }
            adapter = chatAdapter
        }

        binding.btnSendChat.setOnClickListener { sendMessage() }
        binding.etChatInput.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEND) { sendMessage(); true } else false
        }
    }

    private fun sendMessage() {
        val input = binding.etChatInput.text?.toString()?.trim() ?: return
        if (input.isBlank()) return

        binding.etChatInput.text?.clear()
        messages.add(ChatMessage("user", input))
        chatAdapter.notifyItemInserted(messages.size - 1)
        binding.chatRecycler.scrollToPosition(messages.size - 1)

        setTyping(true)

        lifecycleScope.launch {
            try {
                // Build history from existing messages for multi-turn context
                val chat = generativeModel.startChat(
                    history = messages.dropLast(1).map { msg ->
                        content(role = if (msg.role == "user") "user" else "model") { text(msg.text) }
                    }
                )
                val response = chat.sendMessage(input)
                val replyText = response.text ?: "I could not generate a response."

                messages.add(ChatMessage("assistant", replyText))
                chatAdapter.notifyItemInserted(messages.size - 1)
                binding.chatRecycler.scrollToPosition(messages.size - 1)

                // Persist to Firestore (optional)
                saveMessageToFirestore("user", input)
                saveMessageToFirestore("assistant", replyText)

            } catch (e: Exception) {
                Toast.makeText(requireContext(), "AI Error: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                setTyping(false)
            }
        }
    }

    private suspend fun saveMessageToFirestore(role: String, text: String) {
        val uid = auth.currentUser?.uid ?: return
        try {
            db.collection("users").document(uid).collection("chats")
                .add(mapOf("role" to role, "content" to text, "createdAt" to com.google.firebase.firestore.FieldValue.serverTimestamp()))
                .await()
        } catch (_: Exception) {}
    }

    private fun setTyping(typing: Boolean) {
        binding.typingIndicator.visibility = if (typing) View.VISIBLE else View.GONE
        binding.btnSendChat.isEnabled = !typing
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
