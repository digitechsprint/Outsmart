"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("Please enter a valid email address.");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.message || "Failed to subscribe. Please try again.");
        setStatus("error");
        return;
      }
    } catch {
      setErrorMessage("Failed to subscribe. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
    setTimeout(() => {
      setStatus("idle");
    }, 4000);
  };
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-6 px-6 font-sans border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto">

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">

          {/* Logo & Description */}
          <div className="md:col-span-12 lg:col-span-3 flex flex-col">
            <Link href="/" className="inline-flex items-center mb-4 -mt-2">
              <img src="/logo.png" alt="Outsmart Technology" className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              We Build Software That Thinks Ahead. Partner with us to outsmart the competition.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Contact Us', href: '/contact' }
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--primary)" }}></span>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    onClick={(e) => {
                      if (window.location.pathname === item.href) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Software Engineering', href: '/service/custom-software' },
                { name: 'Digital Platforms', href: '/service/web-mobile' },
                { name: 'Intelligence', href: '/service/ai-automation' },
                { name: 'Infrastructure', href: '/service/cloud-saas' }
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--primary)" }}></span>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-lg font-bold mb-4">Subscribe Our Newsletter</h4>
            <form className="flex flex-col sm:flex-row gap-2 mb-2" onSubmit={handleSubscribe}>
              <div className="w-full relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className={`bg-[#1A1A1A] border rounded-lg px-4 py-2.5 text-sm focus:outline-none w-full text-white placeholder:text-gray-600 transition-colors ${status === 'error' ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-gray-500'}`}
                  suppressHydrationWarning
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                suppressHydrationWarning
                className="text-white text-sm font-bold px-5 py-2.5 rounded-lg whitespace-nowrap transition-opacity hover:opacity-90 shadow-lg shrink-0 disabled:opacity-60"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {status === "error" && <p className="text-red-500 text-xs font-medium mb-2">{errorMessage}</p>}
            {status === "success" && <p className="text-green-500 text-xs font-medium mb-2">Successfully subscribed to our newsletter!</p>}
            <p className="text-xs text-gray-500 leading-relaxed font-medium mt-2">
              *Stay updated with the latest tech trends & insights.
            </p>
          </div>

        </div>

        {/* Contact Info Row (Horizontal) */}
        <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-start md:items-center justify-between gap-6 py-6 border-t border-gray-800">
          <Link href="/contact#location-map" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: "var(--primary)" }}>
              <MapPin className="text-white w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200 group-hover:text-[--primary] transition-colors">Location</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-none whitespace-nowrap group-hover:text-gray-300 transition-colors">
                111, F-Block, Sector 8, Noida, U.P.-201301
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: "var(--primary)" }}>
              <Phone className="text-white w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200">Urgent Support?</h4>
              <a href="tel:+919599342525" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                +91-9599-34-2525
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: "var(--primary)" }}>
              <Mail className="text-white w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200">E-Mail Us</h4>
              <a href="mailto:info@outsmarttechnology.com" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                info@outsmarttechnology.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm font-medium tracking-wide mb-4 md:mb-0">
            Copyright © 2026 Sprint Digitech. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 pr-16 md:pr-20">
            <h4 className="text-sm font-bold text-gray-300 mr-2 hidden sm:block">Follow Us:</h4>
            <a href="https://www.linkedin.com/in/outsmart-technology-1933b9357/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform shadow-lg" style={{ backgroundColor: "var(--primary)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61594061408997" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform shadow-lg" style={{ backgroundColor: "var(--primary)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
