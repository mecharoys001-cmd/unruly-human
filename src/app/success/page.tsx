"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full border border-white/30 flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
          Thank You
        </h1>
        
        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          Your order has been confirmed. You&apos;ll receive a confirmation email
          shortly with tracking information.
        </p>

        <p className="text-white/30 text-sm mb-12">
          Order reference: {sessionId?.slice(-8).toUpperCase() || "—"}
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 border border-white/30 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
        >
          BACK TO HOME
        </Link>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
