"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomCheckbox from "@/components/CustomCheckbox";
import { Check, Eye, EyeOff, Sun, Moon } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import ClickSpark from "@/components/ClickSpark";
import ShinyText from "@/components/ShinyText";
import Ribbons from "@/components/Ribbons";
import { useTheme } from "next-themes";
import TurnstileWidget from "@/components/TurnstileWidget";
import PasswordCaret from "@/components/PasswordCaret";

const MAX_PASSWORD_LENGTH = 12;

const validatePassword = (password: string) => {
  return (
    password.length === MAX_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export default function SignupPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible((prev) => !prev);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the terms.");
      return;
    }
    if (!captchaToken) {
      toast.error("Please complete the captcha.");
      return;
    }
    try {
      const res = await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
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
            Sign Up
          </h1>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="name"
              required
            />
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
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-transparent"
                maxLength={MAX_PASSWORD_LENGTH}
                autoComplete="current-password"
                required
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400 mr-6">
                {password.length}/{MAX_PASSWORD_LENGTH}
              </span>
              {!passwordVisible && (
                <PasswordCaret
                  caretIndex={passwordInputRef.current?.selectionStart ?? password.length}
                  fillPercent={password.length / MAX_PASSWORD_LENGTH}
                />
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={passwordVisible ? "Hide Password" : "Show Password"}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validatePassword(password) && (
                <Check className="absolute right-24 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
            <div className="relative">
              <input
                ref={confirmPasswordInputRef}
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-transparent"
                maxLength={MAX_PASSWORD_LENGTH}
                required
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400 mr-6">
                {confirmPassword.length}/{MAX_PASSWORD_LENGTH}
              </span>
              {!confirmPasswordVisible && (
                <PasswordCaret
                  caretIndex={confirmPasswordInputRef.current?.selectionStart ?? confirmPassword.length}
                  fillPercent={confirmPassword.length / MAX_PASSWORD_LENGTH}
                />
              )}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={confirmPasswordVisible ? "Hide Password" : "Show Password"}
              >
                {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {password && confirmPassword && password === confirmPassword && (
                <Check className="absolute right-24 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-400">
              <CustomCheckbox checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} label={<span className="text-black dark:text-white">I agree to the terms & conditions</span>} />
            </div>
            <div className="flex justify-center my-2">
              <TurnstileWidget
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                theme={theme === 'dark' ? 'dark' : 'light'}
                onVerify={setCaptchaToken}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold overflow-hidden relative mt-2"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account? {" "}
            <a href="/login" className="text-indigo-600 hover:underline cursor-pointer">Login</a>
          </div>
        </div>
      </main>
    </>
  );
}
