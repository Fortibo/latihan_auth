"use client";

// import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "../components/Layout";
import MyPostList from "../components/MyPostList";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
// import { useEffect } from "react";


export default function MyPostsPage() {
    const router = useRouter();
    useEffect(() => {
         let mounted = true;
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
     
         
        }
        checkSession();
        
        
    }, []);
  return (
    <Layout>
      <h1>My Posts</h1>
      <MyPostList />
    </Layout>
  );
}
