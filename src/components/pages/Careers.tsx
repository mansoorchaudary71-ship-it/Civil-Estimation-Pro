import React from 'react';
import { Briefcase, ArrowRight, MapPin, Clock } from 'lucide-react';

const jobs = [
  { id: 1, title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote (US)', type: 'Full-time' },
  { id: 2, title: 'Civil Engineering Consultant', department: 'Product', location: 'London, UK', type: 'Full-time' },
  { id: 3, title: 'Product Marketing Manager', department: 'Marketing', location: 'Remote (Global)', type: 'Full-time' },
  { id: 4, title: 'Customer Success Specialist', department: 'Support', location: 'New York, NY', type: 'Contract' },
];

export default function Careers() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl mb-4">
          <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Join Our Team
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Help us build the software that's literally building the world. We're looking for passionate people to join our fully remote team.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Open Positions</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {jobs.map(job => (
            <div key={job.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                    {job.department}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
