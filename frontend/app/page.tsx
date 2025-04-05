"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LandingPage() {

  const router = useRouter();
  const { status } = useSession();

  // Redirect if user is logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home")
    }
  }, [status, router])


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md">
        <h1 className="text-2xl font-bold">CogniHub</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/auth/login">
            <Button variant="outline" className="cursor-pointer">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-100 dark:bg-gray-900">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          AI-powered Insights at Your Fingertips
        </motion.h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
          Unlock the power of AI with CogniHub. Get real-time insights, automate tasks, and enhance productivity effortlessly.
        </p>
        <Link href="/auth/login">
          <Button className="text-lg px-6 py-3 cursor-pointer">Try for Free</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-20">
        <FeatureCard title="Smart AI Models" description="Leverage state-of-the-art AI models for fast and accurate responses." />
        <FeatureCard title="Easy Integration" description="Seamlessly integrate with your existing workflow and tools." />
        <FeatureCard title="Secure & Private" description="Your data is protected with industry-leading security measures." />
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t mt-auto">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} CogniHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}