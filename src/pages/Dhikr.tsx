import { Sun, Moon, Bed, ChevronRight, Bookmark, ShieldCheck, Heart, MoonStar, HandHeart } from 'lucide-react';

export default function Dhikr() {
  const primaryAdhkar = [
    { title: 'Morning', sub: 'Start your day with remembrance and protection.', icon: Sun, type: 'daily' },
    { title: 'Evening', sub: 'Close the day seeking forgiveness and peace.', icon: Moon, type: 'daily' },
    { title: 'Before Sleep', sub: 'Restful supplications for a peaceful night.', icon: Bed, type: 'nightly' },
  ];

  const categories = [
    { title: 'Tahajjud Duas', sub: 'Supplications for the night prayer.', icon: MoonStar },
    { title: 'Before/After Salah', sub: 'Dhikr connected to obligatory prayers.', icon: HandHeart },
    { title: 'Quranic Duas', sub: 'Supplications found in the Holy Quran.', icon: Bookmark },
    { title: 'Sunnah Duas', sub: 'Prophetic traditions and general duas.', icon: Heart },
    { title: 'Istighfar', sub: 'Seeking forgiveness continuously.', icon: ShieldCheck },
    { title: 'All-times Dhikr', sub: 'General remembrance throughout the day.', icon: Activity },
    { title: 'Ruqiyah', sub: 'Recitations for spiritual healing.', icon: ShieldCheck },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      <header className="text-center space-y-3">
        <h2 className="text-5xl font-serif font-bold text-primary">Dhikr & Adhkar</h2>
        <p className="text-on-surface-variant text-lg">Daily remembrances and supplications.</p>
      </header>

      {/* Primary Adhkar Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {primaryAdhkar.map((item) => (
          <div 
            key={item.title} 
            className="ledger-card group relative hover:bg-surface-container-high transition-colors cursor-pointer overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <item.icon size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="label-caps !text-[10px] text-secondary">{item.type}</span>
              <h3 className="text-3xl font-serif font-bold text-primary">{item.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.sub}</p>
              <button className="flex items-center gap-2 text-primary font-bold text-sm pt-4 hover:gap-3 transition-all">
                <span>Begin</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold border-b border-primary/10 pb-2">Additional Supplications</h3>
        <div className="bg-[#100e0d] border border-outline/10 rounded-xl overflow-hidden divide-y divide-outline/5">
          {categories.map((cat) => (
            <div 
              key={cat.title} 
              className="flex items-center justify-between p-5 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline/5">
                  <cat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-primary">{cat.title}</h4>
                  <p className="text-sm text-on-surface-variant">{cat.sub}</p>
                </div>
              </div>
              <ChevronRight className="text-outline/50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
