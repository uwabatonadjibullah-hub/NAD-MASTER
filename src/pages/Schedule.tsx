import { useState } from 'react';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Schedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [9, 10, 11, 12, 13, 14, 15];
  const hours = ['04:00', '06:00', '08:00', '10:00', '12:00'];

  const events = [
    { time: '04:30', title: 'Fajr & Dhikr', type: 'religious', top: '5%', height: '8%' },
    { time: '05:30 - 07:00', title: 'Quran Hifz', sub: 'Juz 28 Revision', type: 'serious', top: '15%', height: '15%' },
    { time: '07:15 - 08:30', title: 'Strength Training', type: 'serious', top: '32%', height: '12%' },
    { time: '08:45 - 09:45', title: 'Slack Time', type: 'slack', top: '46%', height: '10%' },
    { time: '10:00 - 12:30', title: 'Advanced Fiqh', sub: 'Module 4: Transactions', type: 'serious', top: '58%', height: '25%' },
    { time: '12:45', title: 'Dhuhr Prayer', type: 'religious', top: '85%', height: '8%' },
  ];

  return (
    <div className="h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-surface">
      {/* Week Selector */}
      <section className="bg-[#100e0d] border-b border-outline/10 shrink-0">
        <div className="flex overflow-x-auto scrollbar-hide px-6 py-4 gap-8 snap-x">
          <div className="flex flex-col snap-start shrink-0 border-l-[3px] border-outline/30 pl-3 opacity-40">
            <span className="label-caps !text-[10px]">Week -1</span>
            <span className="text-sm mt-1">Oct 02 - Oct 08</span>
          </div>
          <div className="flex flex-col snap-start shrink-0 border-l-[3px] border-primary pl-3">
            <span className="label-caps !text-[10px] !text-primary">Week 0 (Current)</span>
            <span className="text-lg font-serif mt-1">Oct 09 - Oct 15</span>
          </div>
          <div className="flex flex-col snap-start shrink-0 border-l-[3px] border-outline/30 pl-3 opacity-40">
            <span className="label-caps !text-[10px]">Week 1</span>
            <span className="text-sm mt-1">Oct 16 - Oct 22</span>
          </div>
        </div>
      </section>

      {/* Grid View */}
      <section className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-outline/20 scrollbar-track-transparent">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 bg-surface-bright z-10 border-b border-outline/10">
            <div className="p-4 border-r border-outline/10 flex items-center justify-center">
              <span className="label-caps opacity-50">Time</span>
            </div>
            {days.map((day, i) => (
              <div key={day} className={cn("p-4 text-center border-r border-outline/10", i === 1 && "bg-surface-container-low")}>
                <div className={cn("label-caps", i === 1 && "text-primary")}>{day}</div>
                <div className={cn("text-2xl font-serif mt-1", i === 1 && "text-primary")}>{dates[i]}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 relative min-h-[800px]">
            {/* Grid Background */}
            <div className="absolute inset-0 flex flex-col h-full pointer-events-none">
              {hours.map((hour) => (
                <div key={hour} className="flex-1 border-b border-outline/5 flex items-start">
                  <div className="w-[80px] h-full border-r border-outline/10 flex justify-center pt-2">
                    <span className="label-caps !text-[10px] opacity-40">{hour}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-7 h-full divide-x divide-outline/5">
                    {days.map((_, i) => (
                      <div key={i} className={cn(i === 1 && "bg-surface-container-low/20")} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tuesday Events (Column 2) */}
            <div className="absolute top-0 bottom-0 left-[calc(80px+(100%-80px)/7)] w-[calc((100%-80px)/7)] px-2 py-4">
              {events.map((event, i) => (
                <div
                  key={i}
                  style={{ top: event.top, height: event.height }}
                  className={cn(
                    "absolute left-2 right-2 rounded-r p-3 flex flex-col justify-center border-l-4 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer",
                    event.type === 'religious' && "bg-[#4d4541]/80 border-secondary",
                    event.type === 'serious' && "bg-[#93000a]/30 border-error",
                    event.type === 'slack' && "bg-surface-container-lowest border-outline border-dashed flex items-center justify-center"
                  )}
                >
                  {event.type === 'slack' ? (
                    <>
                      <Coffee className="text-outline mb-1" size={16} />
                      <span className="label-caps !text-[9px] text-center">{event.title}</span>
                      <span className="label-caps !text-[9px] opacity-50">{event.time}</span>
                    </>
                  ) : (
                    <>
                      <span className="label-caps !text-[9px] opacity-70 mb-1">{event.time}</span>
                      <span className="font-bold text-sm leading-tight truncate">{event.title}</span>
                      {event.sub && (
                        <span className="label-caps !text-[8px] opacity-50 mt-1 truncate">{event.sub}</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
