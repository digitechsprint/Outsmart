"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Search, MessageSquare, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Notification = {
  id: string;
  type: "inquiry" | "newsletter";
  title: string;
  subtitle: string;
  href: string;
  createdAt: string;
};

const READ_IDS_KEY = "admin_notifications_read_ids";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const [{ data: inquiries }, { data: subscribers }] = await Promise.all([
        supabase
          .from("inquiries")
          .select("id, full_name, project_type, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("Newsletter")
          .select("email, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const items: Notification[] = [
        ...(inquiries || []).map((inquiry) => ({
          id: `inquiry-${inquiry.id}`,
          type: "inquiry" as const,
          title: `New inquiry from ${inquiry.full_name}`,
          subtitle: inquiry.project_type || "Contact form",
          href: "/admin/inquiries",
          createdAt: inquiry.created_at,
        })),
        ...(subscribers || []).map((subscriber) => ({
          id: `newsletter-${subscriber.email}`,
          type: "newsletter" as const,
          title: "New newsletter subscriber",
          subtitle: subscriber.email,
          href: "/admin/newsletter",
          createdAt: subscriber.created_at,
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      try {
        const stored = JSON.parse(localStorage.getItem(READ_IDS_KEY) || "[]");
        if (Array.isArray(stored)) setReadIds(stored);
      } catch {}
      setNotifications(items);
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const isUnread = (n: Notification) => !readIds.includes(n.id);
  const unreadCount = notifications.filter(isUnread).length;

  const saveReadIds = (ids: string[]) => {
    // Keep only ids that are still in the list so storage doesn't grow forever
    const visibleIds = ids.filter((id) => notifications.some((n) => n.id === id));
    setReadIds(visibleIds);
    try {
      localStorage.setItem(READ_IDS_KEY, JSON.stringify(visibleIds));
    } catch {}
  };

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) saveReadIds([...readIds, id]);
  };

  const markAllRead = () => saveReadIds(notifications.map((n) => n.id));

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 flex items-center justify-between px-8 text-gray-800 font-sans">
      <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 w-96 transition-colors focus-within:border-[#8a198c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8a198c]/20">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 font-medium text-gray-800"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((open) => !open)}
            className={`relative p-2 rounded-full transition-colors ${isOpen ? "text-[#8a198c] bg-[#8a198c]/10" : "text-gray-500 hover:text-gray-900"}`}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#8a198c] border-2 border-white rounded-full text-[10px] font-bold text-white flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-100 shadow-xl shadow-gray-200/60 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <p className="font-black text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-bold text-[#8a198c] hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <p className="text-center py-10 text-sm text-gray-400 font-medium">Loading...</p>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center gap-3 text-gray-400">
                    <Bell size={36} className="text-gray-300" />
                    <p className="text-sm font-bold text-gray-700">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = n.type === "inquiry" ? MessageSquare : Mail;
                    const unread = isUnread(n);
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => {
                          markAsRead(n.id);
                          setIsOpen(false);
                        }}
                        className={`flex items-start gap-3 px-5 py-3.5 border-b border-gray-50 transition-colors hover:bg-gray-50/80 ${unread ? "bg-[#8a198c]/[0.04]" : ""}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#8a198c]/10 text-[#8a198c] flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${unread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>{n.title}</p>
                          <p className="text-xs text-gray-500 font-medium truncate">{n.subtitle}</p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                        {unread && <span className="w-2 h-2 rounded-full bg-[#8a198c] mt-2 shrink-0" />}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8a198c] to-pink-600 flex items-center justify-center text-sm font-bold text-white shadow-md group-hover:scale-105 transition-transform">
            AK
          </div>
          <div>
            <p className="text-sm font-bold">Admin User</p>
            <p className="text-xs text-gray-500 font-medium">admin@outsmart.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
