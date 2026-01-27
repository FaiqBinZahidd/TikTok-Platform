import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, FileText, DollarSign, Package } from 'lucide-react';
import { EVENT_TYPES, createEvent, updateEvent, deleteEvent } from '../../utils/calendarUtils';

const EventFormModal = ({ isOpen, onClose, onSave, existingEvent = null, initialDate = null }) => {
    const isEditing = !!existingEvent;

    const [formData, setFormData] = useState({
        title: '',
        type: 'other',
        date: '',
        endDate: '',
        description: '',
        metadata: {}
    });

    useEffect(() => {
        if (existingEvent) {
            setFormData({
                title: existingEvent.title,
                type: existingEvent.type,
                date: existingEvent.date.toISOString().split('T')[0],
                endDate: existingEvent.endDate ? existingEvent.endDate.toISOString().split('T')[0] : '',
                description: existingEvent.description || '',
                metadata: existingEvent.metadata || {}
            });
        } else if (initialDate) {
            setFormData(prev => ({
                ...prev,
                date: initialDate.toISOString().split('T')[0]
            }));
        }
    }, [existingEvent, initialDate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const eventData = {
            title: formData.title,
            type: formData.type,
            date: new Date(formData.date),
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            description: formData.description,
            metadata: formData.metadata
        };

        if (isEditing) {
            updateEvent(existingEvent.id, eventData);
        } else {
            createEvent(eventData);
        }

        onSave?.();
        handleClose();
    };

    const handleDelete = () => {
        if (!isEditing) return;
        if (confirm('Are you sure you want to delete this event?')) {
            deleteEvent(existingEvent.id);
            onSave?.();
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            type: 'other',
            date: '',
            endDate: '',
            description: '',
            metadata: {}
        });
        onClose();
    };

    if (!isOpen) return null;

    const eventTypeConfig = EVENT_TYPES[formData.type.toUpperCase().replace('-', '_')] || EVENT_TYPES.OTHER;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${eventTypeConfig.bgClass} rounded-xl flex items-center justify-center text-2xl`}>
                            {eventTypeConfig.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {isEditing ? 'Edit Event' : 'New Event'}
                            </h2>
                            <p className="text-sm text-slate-400">
                                {isEditing ? 'Update your event details' : 'Add to your business calendar'}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., TikTok Flash Sale, Supplier Meeting"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Event Type */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            <Tag className="w-4 h-4 inline mr-1" />
                            Event Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        >
                            {Object.values(EVENT_TYPES).map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                min={formData.date}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add notes, budget details, or any other information..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Type-Specific Fields */}
                    {formData.type === 'campaign' && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-violet-50 rounded-xl border border-violet-100">
                            <div>
                                <label className="block text-xs font-bold text-violet-700 mb-1">
                                    <DollarSign className="w-3 h-3 inline" /> Budget
                                </label>
                                <input
                                    type="number"
                                    value={formData.metadata.budget || ''}
                                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, budget: e.target.value } })}
                                    placeholder="e.g., 500"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-violet-200 outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-violet-700 mb-1">Platform</label>
                                <select
                                    value={formData.metadata.platform || ''}
                                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, platform: e.target.value } })}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-violet-200 outline-none focus:border-violet-500"
                                >
                                    <option value="">Select</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Shopee">Shopee</option>
                                    <option value="Lazada">Lazada</option>
                                    <option value="Amazon">Amazon</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {formData.type === 'sales-target' && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <label className="block text-xs font-bold text-green-700 mb-1">
                                <DollarSign className="w-3 h-3 inline" /> Target Amount
                            </label>
                            <input
                                type="number"
                                value={formData.metadata.targetAmount || ''}
                                onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, targetAmount: e.target.value } })}
                                placeholder="e.g., 10000"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-green-200 outline-none focus:border-green-500"
                            />
                        </div>
                    )}

                    {formData.type === 'restock' && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div>
                                <label className="block text-xs font-bold text-blue-700 mb-1">
                                    <Package className="w-3 h-3 inline" /> Product
                                </label>
                                <input
                                    type="text"
                                    value={formData.metadata.product || ''}
                                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, product: e.target.value } })}
                                    placeholder="Product name"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-blue-200 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.metadata.quantity || ''}
                                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, quantity: e.target.value } })}
                                    placeholder="e.g., 100"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-blue-200 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/30"
                        >
                            {isEditing ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;
