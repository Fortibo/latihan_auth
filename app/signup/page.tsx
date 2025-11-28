// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [typeMessage, setTypeMessage] = useState<"error" | "success" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    if (!email) {
      setTypeMessage("error");
      setMessage("Email wajib diisi.");
      return false;
    }
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setTypeMessage("error");
      setMessage("Format email tidak valid.");
      return false;
    }
    if (!password || password.length < 8) {
      setTypeMessage("error");
      setMessage("Password minimal 8 karakter.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setTypeMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || data?.error) {
        setTypeMessage("error");
        setMessage(data?.error || "Pendaftaran gagal. Coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // success
      setTypeMessage("success");
      // data.message mungkin berisi instruksi (cek email)
      setMessage(data.message || "Pendaftaran berhasil — cek email Anda untuk konfirmasi.");

      // after short delay redirect to signin
      setTimeout(() => {
        router.replace("/signin");
      }, 1700);
    } catch (err: any) {
      setTypeMessage("error");
      setMessage(err?.message || "Terjadi kesalahan jaringan.");
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white border rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Buat akun baru</h1>
        <p className="text-sm text-gray-500 mb-6">Masukkan email dan password untuk mendaftar.</p>

        {message && typeMessage === "error" && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
            {message}
          </div>
        )}

        {message && typeMessage === "success" && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 text-green-700 px-4 py-2 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="signup-form">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Minimal 8 karakter"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Gunakan minimal 8 karakter. Disarankan kombinasi huruf, angka, dan simbol.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="text-sm px-3 py-2 border rounded"
            >
              Sudah punya akun?
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-400">
          Dengan mendaftar, Anda menyetujui syarat & ketentuan.
        </div>
      </div>
    </Layout>
  );
}
