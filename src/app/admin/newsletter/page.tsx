import { supabase } from "@/lib/supabaseClient";
import { Mail, Calendar, Users } from "lucide-react";

export const revalidate = 0; // Disable cache to always fetch latest data

export default async function AdminNewsletter() {
  // Fetch from Supabase
  const { data: subscribers, error } = await supabase
    .from('Newsletter')
    .select('*')
    .order('created_at', { ascending: false });

  const allSubscribers = subscribers || [];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-500 font-medium">All emails subscribed through the website footer.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm shadow-gray-200/50 rounded-2xl px-5 py-3">
          <div className="w-10 h-10 rounded-xl bg-[#8a198c]/10 text-[#8a198c] flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Total Subscribers</p>
            <p className="text-xl font-black text-gray-900">{allSubscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white border border-gray-100 shadow-sm shadow-gray-200/50 rounded-2xl p-6">
        {error ? (
          <div className="text-center py-10 text-red-500 font-medium">
            Failed to load subscribers. Error: {error.message}
          </div>
        ) : allSubscribers.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Mail size={48} className="text-gray-300" />
            <div>
              <p className="text-lg font-bold text-gray-700">No subscribers yet</p>
              <p className="text-sm font-medium mt-1">When users subscribe to the newsletter, their emails will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-bold px-4 w-16">#</th>
                  <th className="pb-3 font-bold px-4">Email Address</th>
                  <th className="pb-3 font-bold px-4">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {allSubscribers.map((subscriber, index) => (
                  <tr key={`${subscriber.email}-${subscriber.created_at}`} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="py-5 px-4 text-sm font-bold text-gray-400">{index + 1}</td>
                    <td className="py-5 px-4">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Mail size={14} className="text-[#8a198c]" />
                        <a href={`mailto:${subscriber.email}`} className="hover:text-[#8a198c] transition-colors">{subscriber.email}</a>
                      </p>
                    </td>
                    <td className="py-5 px-4 text-gray-500 text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
