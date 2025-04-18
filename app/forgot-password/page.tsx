"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ClickSpark from "@/components/ClickSpark";
import ShinyText from "@/components/ShinyText";
import Ribbons from "@/components/Ribbons";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Password reset link sent! Check your email.");
    setTimeout(() => router.push("/login"), 1500);
  };

  if (!mounted) return null;

  return (
    <>
      <CustomCursor />
      <ClickSpark />
      <Ribbons />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="relative w-[98vw] max-w-xs sm:max-w-sm md:max-w-md rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_0_30px_rgba(99,102,241,0.4)] dark:shadow-[0_0_30px_rgba(99,102,241,0.3)] p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
            Forgot Password
          </h1>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <input
              ref={emailInputRef}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="username"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold overflow-hidden relative mt-2"
            >
              Send Reset Link
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Remembered your password? {" "}
            <a href="/login" className="text-indigo-600 hover:underline cursor-pointer">Login</a>
          </div>
        </div>
      </main>
    </>
  );
}
