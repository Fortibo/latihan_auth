"use client";
import { useEffect, useState } from "react";

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/posts/list");
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
      setLoading(false);
    }
    loadPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="space-y-4">
      {posts.length === 0 && <p>Belum ada post.</p>}

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
