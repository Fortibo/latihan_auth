import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const res = await supabase.from("posts").delete().eq("id", id);
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 400 });
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
