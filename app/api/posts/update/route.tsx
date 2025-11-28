import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PATCH(req: Request) {
  const { id, title, content } = await req.json();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const res = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id);

  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 400 });
  return NextResponse.json({ message: "Updated" }, { status: 200 });
}
