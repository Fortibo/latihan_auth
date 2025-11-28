// app/add-post/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import AddPostForm from "./AddPostForm";

export default function AddPostPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    window.fetch("/api/posts/list").then(r => r.json()).then(console.log);
    async function checkSession() {
      // Ambil session/user dari client-side Supabase
      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;

      if (!mounted) return;

      if (!user) {
        // belum login -> redirect ke signin
        router.replace("/signin");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? null);
      setLoading(false);
    }

    checkSession();

    // Subscribe to auth changes (optional — handle sign out)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/signin");
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      try {
        listener.subscription.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">Memeriksa sesi... Jika lama, coba refresh halaman.</div>
      </Layout>
    );
  }

  if (!userId) {
    // fallback (shouldn't reach karena router.replace dijalankan)
    return (
      <Layout>
        <div className="p-6 text-center">Redirecting to sign in...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Buat Post</h1>
          {userEmail && <p className="text-sm text-gray-600">Signed in as {userEmail}</p>}
        </div>

        <AddPostForm userId={userId} />
      </div>
    </Layout>
  );
}
