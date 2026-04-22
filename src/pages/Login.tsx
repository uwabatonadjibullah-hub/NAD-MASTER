import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/configuration-not-found') {
        alert("Google Sign-In is not enabled in your Firebase Console. Please enable it in the Authentication > Sign-in method tab.");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized in your Firebase Console. Please add this domain to Authentication > Settings > Authorized domains.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#151312] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-[0.2em] mb-4 text-[#d6c3b5]">NAD MASTER</h1>
        <p className="text-on-surface-variant max-w-xs mx-auto italic">
          "The most beloved of deeds to Allah are those that are most consistent, even if it is small."
        </p>
      </div>

      <button
        onClick={handleLogin}
        className="flex items-center gap-3 bg-[#d6c3b5] text-[#3a2e24] px-8 py-4 rounded-lg font-bold tracking-widest uppercase hover:bg-[#d6c3b5]/90 transition-all shadow-xl"
      >
        <LogIn size={20} />
        Sign In with Google
      </button>
      
      <p className="mt-12 text-[10px] uppercase tracking-widest text-on-surface-variant/50">
        Disciplined Growth & Spiritual Excellence
      </p>
    </div>
  );
}
