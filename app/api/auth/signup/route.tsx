import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const response = await supabase.auth.signUp({ email, password });

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Cek email untuk konfirmasi!" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
