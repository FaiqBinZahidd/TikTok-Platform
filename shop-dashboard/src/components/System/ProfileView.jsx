import React, { useState } from 'react';
import { User, Mail, Shield, Clock, Camera, Key, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfileView({ currentUser, onLogout }) {
    const [page, setPage] = useState('profile');

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    // Profile State
    const [fullName, setFullName] = useState(currentUser?.user_metadata?.full_name || '');
    const [phone, setPhone] = useState(currentUser?.user_metadata?.phone || '');
    const [profileMsg, setProfileMsg] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg(null);
        setLoadingProfile(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName, phone: phone }
            });
            if (error) throw error;
            setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
            // Ideally, we should also update the local currentUser state here if it wasn't automatically subscribed
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.message });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (newPassword !== confirmPassword) {
            setMsg({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMsg({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full p-8 overflow-y-auto">
            <h1 className="text-3xl font-black text-slate-900 mb-8">My Profile</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Info Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center sticky top-8">
                        <div className="relative w-24 h-24 mx-auto mb-6 group">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                                {currentUser?.email?.[0].toUpperCase() || <User />}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mb-1">{fullName || currentUser?.email?.split('@')[0] || 'User'}</h2>
                        <p className="text-slate-500 text-sm mb-6 capitalize">{currentUser?.role || 'Administrator'}</p>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                    <p className="text-sm font-medium text-slate-700 truncate">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Created</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {new Date(currentUser?.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button onClick={onLogout} className="w-full mt-8 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Right: Settings Forms */}
                <div className="md:col-span-2 space-y-6">

                    {/* 1. Personal Information Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                <p className="text-slate-500 text-sm">Update your public profile details</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            {profileMsg && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {profileMsg.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                                    <span className="font-bold text-sm">{profileMsg.text}</span>
                                </div>
                            )}

                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={loadingProfile}
                                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-violet-600 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {loadingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Security Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Security</h3>
                                <p className="text-slate-500 text-sm">Manage your password and account security</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {msg && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {msg.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                                    <span className="font-bold text-sm">{msg.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-violet-600 transition-colors shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
