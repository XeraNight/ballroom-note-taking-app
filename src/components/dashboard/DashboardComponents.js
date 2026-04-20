'use client';

import clsx from 'clsx';

export function CategoryPointsWidget({ title, value, category, icon, color = 'blue' }) {
  const iconColor = color === 'blue' ? 'text-standard-blue' : 'text-latin-red';
  const bgColor = color === 'blue' ? 'bg-standard-blue/10' : 'bg-red-600/10';

  return (
    <section className="col-span-12 md:col-span-6 lg:col-span-4 rounded-3xl glass-card p-8 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
      <div className="flex items-center gap-6">
        <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl", bgColor, iconColor)}>
          <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
        <div>
          <p className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-on-surface">{value}</h4>
            <span className="text-sm font-bold opacity-30 tracking-widest uppercase">pts</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Current Class</p>
        <span className={clsx("text-2xl font-black italic", iconColor)}>{category}</span>
      </div>
    </section>
  );
}

export function ActivityFeed({ title, items }) {
  return (
    <section className="col-span-12 md:col-span-4 lg:col-span-6 rounded-3xl glass-card border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-on-surface font-bold tracking-tight">{title}</h3>
        <button className="text-xs text-on-surface-variant hover:text-white transition-colors">View All</button>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
              <span className={clsx("material-symbols-outlined text-lg", item.iconColor)}>{item.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{item.title}</p>
              <p className="text-xs text-white/40">{item.subtitle}</p>
            </div>
            <span className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">chevron_right</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeroRoutineCard({ title, subtitle, tag, time, image, gradient, color = 'blue' }) {
  return (
    <section className="col-span-12 lg:col-span-8 group relative h-[440px] rounded-[2rem] overflow-hidden glass-card p-10 flex flex-col justify-between border border-white/5">
      <div className="absolute inset-0 z-0">
        <img alt="/images/latin_hero.jpg" className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" src={image} />
        <div className={clsx("absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent", gradient)}></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className={clsx(
            "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border",
            color === 'blue' ? "bg-blue-600/20 text-blue-400 border-blue-500/20" : "bg-red-600/80 backdrop-blur-md text-white border-transparent"
          )}>{tag}</span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-bold tracking-widest uppercase border border-white/10">{time}</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white max-w-md uppercase">{title}</h2>
        <p className="text-white/60 mt-4 max-w-sm">{subtitle}</p>
      </div>
    </section>
  );
}
