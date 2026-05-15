import React from 'react';
import { Clock, User } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'The Future of AI in Construction Estimation',
    excerpt: 'How machine learning models are automating 2D takeoffs and reducing calculation errors by up to 90%.',
    author: 'Sarah Jenkins',
    date: 'Oct 24, 2023',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: '5 Ways to Optimize Your Earthworks Calculations',
    excerpt: 'A deep dive into advanced excavation modeling and grid-based volume calculation strategies.',
    author: 'David Chen',
    date: 'Oct 18, 2023',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Introducing Civil Estimation Pro 2.0',
    excerpt: 'Explore the new features, including our revamped Road Estimator and real-time collaborative workspace.',
    author: 'Product Team',
    date: 'Oct 12, 2023',
    category: 'Product Update',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Blog() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Civil Estimation Pro Blog
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Insights, updates, and tutorials from the team building the future of construction software.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="h-48 overflow-hidden relative">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute top-4 left-4">
                 <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white shadow-sm">
                   {post.category}
                 </span>
               </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  {post.author}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {post.date}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
