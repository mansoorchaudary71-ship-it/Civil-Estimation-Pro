import React from 'react';
import { Mail, MessageSquare, PhoneCall, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Have questions about our tools, pricing, or need technical support? Our team is ready to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
               <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Chat to Sales</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Speak to our friendly team.</p>
               <a href="mailto:sales@civilpro.com" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">sales@civilpro.com</a>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0">
               <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Visit Us</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Visit our office HQ.</p>
               <address className="text-sm font-semibold text-slate-700 dark:text-slate-300 not-italic">
                 100 Civil Way<br/>San Francisco, CA 94107
               </address>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0">
               <PhoneCall className="w-6 h-6 text-purple-600 dark:text-purple-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Call Us</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Mon-Fri from 8am to 5pm.</p>
               <a href="tel:+15550000000" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">+1 (555) 000-0000</a>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" placeholder="Smith" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" placeholder="jane@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none" placeholder="How can we help?" />
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
