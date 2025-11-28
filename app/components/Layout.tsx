// app/components/Layout.tsx
import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

