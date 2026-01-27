import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, ShoppingBag, ExternalLink, User, DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';
import PlatformBadge from '../PlatformBadge';

const CustomerDetailModal = ({ customer, orders, onClose, currency }) => {
    if (!customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header Profile Section */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 p-8 text-white shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1 shadow-xl">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <h2 className="text-3xl font-black tracking-tight">{customer.name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-slate-300">
                                {customer.city && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-violet-400" /> {customer.city}, {customer.country || ''}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/10 font-medium">
                                    {orders.length} Orders
                                </span>
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                                    LTV: {formatCurrency(customer.totalSpend, currency)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            {customer.email && customer.email !== 'N/A' && (
                                <a
                                    href={`mailto:${customer.email}`}
                                    className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-50 transition-colors shadow-lg"
                                >
                                    <Mail className="w-4 h-4" /> Email
                                </a>
                            )}
                            {customer.phone && customer.phone !== 'N/A' && (
                                <a
                                    href={`tel:${customer.phone}`}
                                    className="px-5 py-2.5 bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
                                >
                                    <Phone className="w-4 h-4" /> Call
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT: Contact & Address Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Contact Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <Mail className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-violet-600" />
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold text-slate-400">Email Address</p>
                                            <p className="font-medium text-slate-700 truncate" title={customer.email}>{customer.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <Phone className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-violet-600" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400">Phone Number</p>
                                            <p className="font-medium text-slate-700">{customer.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Address
                                </h3>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 text-slate-600 font-medium leading-relaxed">
                                    <p>{customer.shipline1}</p>
                                    <p>{customer.city}, {customer.state} {customer.zip}</p>
                                    <p className="font-bold text-slate-400 mt-1 uppercase text-xs">{customer.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Order History */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-violet-600" /> Purchase History
                                </h3>
                                <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-md text-xs font-bold">
                                    {orders.length} Items
                                </span>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold text-slate-500">Item</th>
                                                <th className="px-4 py-3 text-center font-bold text-slate-500">Platform</th>
                                                <th className="px-4 py-3 text-center font-bold text-slate-500">Date</th>
                                                <th className="px-4 py-3 text-right font-bold text-slate-500">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {orders.map((order, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                                <Package className="w-4 h-4" />
                                                            </div>
                                                            <div className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={order.name}>
                                                                {order.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center">
                                                            <PlatformBadge platform={order.platform} size="xs" variant="icon" />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-500 text-xs text-nowrap">
                                                        {new Date(order.importDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">
                                                        {formatCurrency(order.gmv, currency)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailModal;
