"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import "./styles.css";
import "./globals.css";

export default function Home() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Footer />
    </div>
  );
}

