// app/signin/page.tsx
"use client";
import { useState } from "react";
import Layout from "@/app/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    setIsSubmitting(true);
    setMessage("");

    // 1) Panggil API server-side yang melakukan signIn
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok || data?.error) {
      setMessage(data?.error || "Sign In gagal");
      return;
    }

    const session = data.session;
    if (!session) {
      setMessage("Session tidak ditemukan dari server.");
      return;
    }

    // 2) Simpan session di client (Supabase JS) supaya browser punya credentials
    // session harus berisi { access_token, refresh_token, expires_at, ... }
    const { error: setErr } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (setErr) {
      setMessage("Gagal menyimpan session: " + setErr.message);
      return;
    }

    // 3) Redirect ke add-post
    router.replace("/add-post");
  }

  return (
    <Layout>
      <h1>Sign In</h1>
      {message && <p className="mb-4 p-2 rounded bg-red-100 text-red-700">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" name="email" placeholder="Email" required className="w-full border px-3 py-2 rounded" />
        <input type="password" name="password" placeholder="Password" required className="w-full border px-3 py-2 rounded" />
        <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </Layout>
  );
}
