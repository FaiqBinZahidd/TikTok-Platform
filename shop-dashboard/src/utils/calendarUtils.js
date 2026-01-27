/**
 * Calendar Utilities - Event Management System
 * Handles CRUD operations for user-created calendar events
 */

// Event Type Definitions
export const EVENT_TYPES = {
    CAMPAIGN: {
        id: 'campaign',
        label: 'Campaign',
        icon: '🎯',
        color: 'violet',
        bgClass: 'bg-violet-100',
        textClass: 'text-violet-700',
        borderClass: 'border-violet-200'
    },
    DEADLINE: {
        id: 'deadline',
        label: 'Deadline',
        icon: '⏰',
        color: 'red',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        borderClass: 'border-red-200'
    },
    SALES_TARGET: {
        id: 'sales-target',
        label: 'Sales Target',
        icon: '💰',
        color: 'green',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200'
    },
    RESTOCK: {
        id: 'restock',
        label: 'Restock',
        icon: '📦',
        color: 'blue',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200'
    },
    MEETING: {
        id: 'meeting',
        label: 'Meeting',
        icon: '👥',
        color: 'orange',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200'
    },
    OTHER: {
        id: 'other',
        label: 'Other',
        icon: '📌',
        color: 'gray',
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-200'
    }
};

const STORAGE_KEY = 'quantro_calendar_events';

// Generate unique ID
const generateId = () => {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all events from localStorage
export const getAllEvents = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const events = JSON.parse(stored);
        // Convert date strings back to Date objects
        return events.map(e => ({
            ...e,
            date: new Date(e.date),
            endDate: e.endDate ? new Date(e.endDate) : null
        }));
    } catch (error) {
        console.error('Error loading calendar events:', error);
        return [];
    }
};

// Save events to localStorage
const saveEvents = (events) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        return true;
    } catch (error) {
        console.error('Error saving calendar events:', error);
        return false;
    }
};

// Create a new event
export const createEvent = (eventData) => {
    const newEvent = {
        id: generateId(),
        title: eventData.title,
        type: eventData.type || 'other',
        date: eventData.date,
        endDate: eventData.endDate || null,
        description: eventData.description || '',
        metadata: eventData.metadata || {},
        createdAt: new Date(),
        isUserCreated: true // Flag to distinguish from auto-generated events
    };

    const allEvents = getAllEvents();
    allEvents.push(newEvent);
    saveEvents(allEvents);

    return newEvent;
};

// Update an existing event
export const updateEvent = (id, updates) => {
    const allEvents = getAllEvents();
    const index = allEvents.findIndex(e => e.id === id);

    if (index === -1) {
        console.error('Event not found:', id);
        return null;
    }

    allEvents[index] = {
        ...allEvents[index],
        ...updates,
        updatedAt: new Date()
    };

    saveEvents(allEvents);
    return allEvents[index];
};

// Delete an event
export const deleteEvent = (id) => {
    const allEvents = getAllEvents();
    const filtered = allEvents.filter(e => e.id !== id);

    if (filtered.length === allEvents.length) {
        console.error('Event not found:', id);
        return false;
    }

    saveEvents(filtered);
    return true;
};

// Get events for a specific date
export const getEventsForDate = (date) => {
    const allEvents = getAllEvents();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return allEvents.filter(event => {
        const eventStart = new Date(event.date);
        eventStart.setHours(0, 0, 0, 0);

        // Single day event
        if (!event.endDate) {
            return eventStart.getTime() === targetDate.getTime();
        }

        // Multi-day event
        const eventEnd = new Date(event.endDate);
        eventEnd.setHours(0, 0, 0, 0);

        return targetDate >= eventStart && targetDate <= eventEnd;
    });
};

// Get upcoming events (next N days)
export const getUpcomingEvents = (days = 7) => {
    const allEvents = getAllEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return allEvents
        .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today && eventDate <= futureDate;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Export all events as JSON
export const exportEvents = () => {
    const events = getAllEvents();
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quantro_events_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
};

// Import events from JSON
export const importEvents = (jsonData) => {
    try {
        const imported = JSON.parse(jsonData);
        if (!Array.isArray(imported)) {
            throw new Error('Invalid format: expected array');
        }

        // Validate and merge with existing events
        const existing = getAllEvents();
        const newEvents = imported.map(e => ({
            ...e,
            id: generateId(), // Generate new IDs to avoid conflicts
            date: new Date(e.date),
            endDate: e.endDate ? new Date(e.endDate) : null,
            isUserCreated: true
        }));

        saveEvents([...existing, ...newEvents]);
        return newEvents.length;
    } catch (error) {
        console.error('Error importing events:', error);
        return 0;
    }
};

// Get event type config
export const getEventTypeConfig = (typeId) => {
    return Object.values(EVENT_TYPES).find(t => t.id === typeId) || EVENT_TYPES.OTHER;
};
