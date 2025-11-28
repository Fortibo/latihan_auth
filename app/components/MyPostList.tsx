"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyPostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data?.session?.access_token;

      if (!token) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/posts/my-post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setPosts(data.posts);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (posts.length === 0) return <p>Belum ada post kamu 😺</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border rounded p-4 shadow-sm bg-white">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-gray-700 mt-1">{post.content}</p>
          <p className="text-sm text-gray-400 mt-2">
            Created at: {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
