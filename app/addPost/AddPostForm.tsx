"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AddPostForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

// snippet debug client (temp Replace in app/components/AddPostForm.tsx)
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setMsg(null);
  setLoading(true);

  // ambil session & token
  const sessionRes = await supabase.auth.getSession();
  console.log("DEBUG sessionRes:", sessionRes);
  const access_token = sessionRes.data?.session?.access_token;
  console.log("DEBUG access_token:", access_token);

  if (!access_token) {
    setMsg("Session token tidak ditemukan. Silakan sign in ulang.");
    setLoading(false);
    return;
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    };
    console.log("DEBUG fetch headers:", headers);

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers,
      body: JSON.stringify({ title, content }),
    });

    console.log("DEBUG create response status:", res.status);
    const data = await res.json();
    console.log("DEBUG create response body:", data);

    if (!res.ok) {
      setMsg(data?.error || `Gagal membuat post (status ${res.status})`);
    } else {
      setMsg("Post berhasil dibuat");
      setTitle("");
      setContent("");
    }
  } catch (err: any) {
    setMsg(err.message || "Error network");
  } finally {
    setLoading(false);
  }
}

 return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-lg font-medium mb-4">Buat Post Baru</h2>
      {msg && <div className="mb-4 text-sm text-gray-700">{msg}</div>}
      <label className="block mb-3">
        <span className="text-sm font-medium">Judul</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Masukkan judul" required />
      </label>
      <label className="block mb-4">
        <span className="text-sm font-medium">Konten</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Isi konten (opsional)" />
      </label>
      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-70">
          {loading ? "Menyimpan..." : "Simpan Post"}
        </button>
      </div>
    </form>
  );
}
