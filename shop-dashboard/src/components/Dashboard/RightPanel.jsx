import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUpcomingEvents, getAllEvents } from '../../utils/calendarUtils';

const RightPanel = ({ notifications, setActiveView, t }) => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        // Load events
        const all = getAllEvents();
        setEvents(all);
        setUpcomingEvents(getUpcomingEvents(7));
    }, [notifications]); // Refresh if notifications change (often linked to updates)

    // Recent Activity from notifications
    const recentActivity = notifications && notifications.length > 0
        ? notifications.slice().reverse().slice(0, 5)
        : [{ id: 'default', msg: 'System initialized', type: 'info', time: 'just now' }];

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const today = new Date();

    const isToday = (d) => {
        return d === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const hasEvent = (d) => {
        const targetDate = new Date(date.getFullYear(), date.getMonth(), d);
        targetDate.setHours(0, 0, 0, 0);
        return events.some(e => {
            const eDate = new Date(e.date);
            eDate.setHours(0, 0, 0, 0);
            return eDate.getTime() === targetDate.getTime();
        });
    };

    const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));

    return (
        <div className="space-y-6">
            {/* Mini Calendar Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex-1">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span key={`${d}-${i}`} className="text-slate-400 text-xs font-semibold">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const active = isToday(day);
                        const event = hasEvent(day);
                        return (
                            <div
                                key={day}
                                onClick={() => setActiveView && setActiveView('calendar')}
                                className={`
                                    h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-all relative
                                    ${active
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }
                                `}
                            >
                                {day}
                                {event && !active && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-violet-500 rounded-full"></div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={() => setActiveView && setActiveView('calendar')}
                    className="w-full mt-4 py-2 text-xs font-bold text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors flex items-center justify-center gap-2"
                >
                    View Full Calendar <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {/* Upcoming Events / Important Dates */}
            <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden group cursor-pointer" onClick={() => setActiveView && setActiveView('calendar')}>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-yellow-400" /> {t('important_dates')}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-3 relative z-10">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.slice(0, 3).map((event, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 font-bold text-xs flex flex-col items-center leading-none min-w-[40px]">
                                    <span className="text-[10px] opacity-70">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                                    <span className="text-lg">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{event.title}</p>
                                    <p className="text-xs text-slate-400 truncate">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-400">No upcoming events this week.</p>
                            <span className="text-xs text-violet-400 font-bold mt-2 inline-block hover:underline">Create Event +</span>
                        </div>
                    )}
                </div>

                {/* Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"></div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-[24px] p-6 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{t('activity_title')}</h3>
                </div>

                <div className="space-y-4 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

                    {recentActivity.map((activity, idx) => (
                        <div key={activity.id || idx} className="relative pl-6 flex flex-col gap-0.5">
                            {/* Dot */}
                            <div className={`
                                absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10
                                ${activity.type === 'success' ? 'bg-green-400' :
                                    activity.type === 'warning' ? 'bg-orange-400' :
                                        activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'}
                            `}></div>

                            <p className="text-sm font-semibold text-slate-700 leading-tight">{activity.msg}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {t('just_now')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightPanel;
