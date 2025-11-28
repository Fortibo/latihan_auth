// app/components/Header.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
    }
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // optional: refresh or route to homepage
    window.location.href = "/signin";
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">MySupabaseApp</Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm">Home</Link>
                  <Link href="/addPost" className="text-sm">Add Post</Link>
                  <Link href="/myPost" className="text-sm ">My Posts</Link>
          {user ? (
            <>
              <span className="text-sm px-3 py-1 rounded bg-gray-100">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Sign In</Link>
              <Link href="/signup" className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Sign Up</Link>
              
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
