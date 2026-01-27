import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, X, Target, Database, Plus, Edit2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';
import { getAllEvents, getUpcomingEvents, getEventTypeConfig } from '../../utils/calendarUtils';
import EventFormModal from './EventFormModal';

const CalendarView = ({ uploadedFiles, campaigns, products, t }) => {
    // Smart Calendar with Month Navigation and Strategic Insights
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Event Management State
    const [userEvents, setUserEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [modalInitialDate, setModalInitialDate] = useState(null);
    const [showUpcoming, setShowUpcoming] = useState(true);

    // Load user events on mount
    useEffect(() => {
        loadUserEvents();
    }, []);

    const loadUserEvents = () => {
        setUserEvents(getAllEvents());
    };

    const handleAddEvent = (date = null) => {
        setModalInitialDate(date);
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setModalInitialDate(null);
        setShowEventModal(true);
    };

    const handleEventSaved = () => {
        loadUserEvents();
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getEventsForDay = (day) => {
        const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        dateObj.setHours(0, 0, 0, 0);

        const events = [];

        // Campaign Events (Creation Date)
        campaigns.forEach(c => {
            const cDate = new Date(c.date);
            cDate.setHours(0, 0, 0, 0);
            if (cDate.getTime() === dateObj.getTime()) {
                events.push({ type: 'campaign-create', title: `${c.name} (${t('created')})`, data: c });
            }

            // Campaign Duration (Active Running)
            if (c.adDetails?.startDate && c.adDetails?.endDate) {
                const start = new Date(c.adDetails.startDate);
                const end = new Date(c.adDetails.endDate);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);

                if (dateObj >= start && dateObj <= end) {
                    if (dateObj.getTime() === start.getTime()) events.push({ type: 'campaign-start', title: `START: ${c.name}`, data: c });
                    else if (dateObj.getTime() === end.getTime()) events.push({ type: 'campaign-end', title: `END: ${c.name}`, data: c });
                    else events.push({ type: 'campaign-run', title: `${c.name} (Active)`, data: c });
                }
            }
        });

        // Import History Events
        uploadedFiles.forEach(f => {
            if (typeof f === 'object' && f.date) {
                const fDate = new Date(f.date);
                fDate.setHours(0, 0, 0, 0);
                if (fDate.getTime() === dateObj.getTime()) {
                    events.push({ type: 'import', title: `${t('import_data')}: ${f.name}`, data: f });
                }
            }
        });

        // Sales Performance Events (Strategic Insights)
        const dayProducts = products.filter(p => {
            const importDate = new Date(p.importDate);
            importDate.setHours(0, 0, 0, 0);
            return importDate.getTime() === dateObj.getTime();
        });

        if (dayProducts.length > 0) {
            const totalGMV = dayProducts.reduce((sum, p) => sum + p.gmv, 0);
            events.push({
                type: 'sales',
                title: `${dayProducts.length} products • ${formatCurrency(totalGMV, '฿')}`,
                data: { products: dayProducts, totalGMV }
            });
        }

        // Traffic Pattern Insights (simulated AI)
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPayday = day === 15 || day === 30 || day === 31;

        if (isWeekend || isPayday) {
            events.push({
                type: 'insight',
                title: isWeekend ? t('weekend_traffic') : t('payday_effect'),
                data: { insight: isWeekend ? 'weekend_boost' : 'payday_boost' }
            });
        }

        // --- NEW: Stockout Predictions (Simulated) ---
        // For products with high velocity, predict run-out date
        const today = new Date();
        products.forEach(p => {
            // Mock: Use product ID to create a stable but random future date for demo
            const seed = String(p.id).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const daysUntilStockout = (seed % 25) + 5; // Random day between 5-30 days from now

            const stockoutDate = new Date(today);
            stockoutDate.setDate(today.getDate() + daysUntilStockout);
            stockoutDate.setHours(0, 0, 0, 0);

            if (stockoutDate.getTime() === dateObj.getTime() && p.itemsSold > 50) {
                events.push({
                    type: 'stockout-risk',
                    title: `⚠️ ${p.name.substring(0, 15)}... ${t('low_stock_risk')}`,
                    data: p
                });
            }
        });

        // --- User Created Events ---
        const userDayEvents = userEvents.filter(userEvent => {
            const eventStart = new Date(userEvent.date);
            eventStart.setHours(0, 0, 0, 0);

            // Single day event
            if (!userEvent.endDate) {
                return eventStart.getTime() === dateObj.getTime();
            }

            // Multi-day event
            const eventEnd = new Date(userEvent.endDate);
            eventEnd.setHours(0, 0, 0, 0);
            return dateObj >= eventStart && dateObj <= eventEnd;
        });

        userDayEvents.forEach(userEvent => {
            const typeConfig = getEventTypeConfig(userEvent.type);
            const isMultiDay = !!userEvent.endDate;
            const isStart = isMultiDay && new Date(userEvent.date).setHours(0, 0, 0, 0) === dateObj.getTime();
            const isEnd = isMultiDay && new Date(userEvent.endDate).setHours(0, 0, 0, 0) === dateObj.getTime();

            let displayTitle = `${typeConfig.icon} ${userEvent.title}`;
            if (isMultiDay) {
                if (isStart) displayTitle = `START: ${displayTitle}`;
                else if (isEnd) displayTitle = `END: ${displayTitle}`;
            }

            events.push({
                type: `user-${userEvent.type}`,
                title: displayTitle,
                data: userEvent,
                isUserEvent: true
            });
        });

        return events;
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const goToToday = () => setCurrentMonth(new Date());

    return (
        <div className="h-full bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('operational_calendar')}</h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={goToToday} className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{t('today')}</button>
                    <button
                        onClick={() => handleAddEvent()}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-full font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/30 hover:scale-105"
                    >
                        <Plus className="w-4 h-4" /> New Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {t('days_short').map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-24 bg-transparent"></div>)}

                {days.map(day => {
                    const events = getEventsForDay(day);
                    const todayDate = new Date();
                    const isToday = day === todayDate.getDate() && currentMonth.getMonth() === todayDate.getMonth() && currentMonth.getFullYear() === todayDate.getFullYear();

                    // Helper to get event color
                    const getEventStyle = (type) => {
                        if (type.includes('campaign-start')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                        if (type.includes('campaign-end')) return 'bg-rose-100 text-rose-700 border-rose-200';
                        if (type.includes('campaign-run')) return 'bg-violet-50 text-violet-600 border-violet-100 opacity-70';
                        if (type === 'import') return 'bg-slate-100 text-slate-600 border-slate-200';
                        return 'bg-indigo-100 text-indigo-700';
                    }

                    return (
                        <div
                            key={day}
                            onClick={() => events.length > 0 && setSelectedDate({ day, events })}
                            className={`min-h-[100px] p-2 rounded-xl border ${isToday ? 'bg-violet-50 border-violet-200 ring-2 ring-violet-200 ring-offset-2' : 'bg-white border-slate-100'} flex flex-col gap-1 overflow-hidden hover:shadow-md transition-all relative cursor-pointer group`}
                        >
                            <span className={`text-sm font-bold ${isToday ? 'text-violet-700' : 'text-slate-700'}`}>{day}</span>

                            {/* Quick Add Button (shows on hover) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                    handleAddEvent(dateObj);
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
                            >
                                <Plus className="w-3 h-3" />
                            </button>

                            {events.map((ev, i) => (
                                <div
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (ev.isUserEvent) {
                                            handleEditEvent(ev.data);
                                        } else {
                                            setSelectedDate({ day, events });
                                        }
                                    }}
                                    className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium border ${getEventStyle(ev.type)} ${ev.isUserEvent ? 'cursor-pointer hover:ring-2 ring-offset-1' : ''} transition-all`}
                                >
                                    {ev.title}
                                    {ev.isUserEvent && <Edit2 className="w-2 h-2 inline ml-1 opacity-50" />}
                                </div>
                            ))}
                            {/* Traffic Sim for demo */}
                            {(day % 7 === 0 || day === 15) && (
                                <div className="mt-auto flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[9px] bg-amber-50 text-amber-600 px-1 rounded flex items-center gap-1 w-full justify-center">
                                        <TrendingUp className="w-2 h-2" /> {t('traffic')}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Day Detail Modal */}
            {selectedDate && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 rounded-xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-200">
                    <div className="w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long' })} {selectedDate.day}
                            </h3>
                            <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-500" /></button>
                        </div>
                        <div className="space-y-3">
                            {selectedDate.events.map((ev, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 bg-white shadow-sm`}>
                                    {ev.type.includes('campaign') ? <Target className="w-5 h-5 text-violet-600" /> : <Database className="w-5 h-5 text-slate-500" />}
                                    <span className="font-medium text-slate-700">{ev.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Event Form Modal */}
            <EventFormModal
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSave={handleEventSaved}
                existingEvent={editingEvent}
                initialDate={modalInitialDate}
            />
        </div>
    );
};

export default CalendarView;
