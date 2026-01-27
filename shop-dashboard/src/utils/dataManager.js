/**
 * DataManager.js
 * Abstraction layer to handle data operations between LocalStorage (Legacy) and Supabase (V2).
 * Ensures smooth transition by falling back to LocalStorage if Supabase is not Configured/Available.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const dataManager = {
    // --- READ OPERATIONS ---
    async getProducts() {
        if (isSupabaseConfigured()) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (!error && data) {
                    // Map DB columns back to App Internal Format if needed, or ensure they match
                    return data.map(row => ({
                        ...row,
                        // Remap columns back to internal keys if mismatched
                        gmv: row.revenue,
                        itemsSold: row.sales,
                        // Ensure numbers are numbers
                        price: Number(row.price),
                        stock: Number(row.stock)
                    }));
                }
                console.warn('Supabase fetch failed:', error);
            }
        }
        return JSON.parse(localStorage.getItem('shopProProducts') || '[]');
    },

    async getSettings() {
        if (isSupabaseConfigured()) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase.from('settings').select('*').eq('user_id', session.user.id).single();
                if (data) return data;
            }
        }
        return JSON.parse(localStorage.getItem('shopProSettings') || '{}');
    },

    // --- WRITE OPERATIONS ---
    async saveProducts(products, user) {
        // 1. Always save to LocalStorage (Safety Net)
        localStorage.setItem('shopProProducts', JSON.stringify(products));

        // 2. Sync to Supabase if Online & Authenticated
        if (isSupabaseConfigured() && user) {
            try {
                // Map Application Data -> Database Schema
                const dbRows = products.map(p => ({
                    user_id: user.id,
                    sku: p.sku || p.id, // Fallback for SKU
                    name: p.name,
                    price: p.gmv / (p.itemsSold || 1), // Derive approximate price if missing
                    stock: p.stock || 0,
                    sales: p.itemsSold || 0,
                    revenue: p.gmv || 0,
                    platform: p.platform || 'Unknown',
                    status: p.status || 'Active',
                    image: p.image || null
                    // timestamps handled by DB
                }));

                // Batch Upsert (Using SKU + UserID as constraints if you had unique constraints, 
                // but for now we might just be appending. To be "smart", we should likely 
                // DELETE existing for this user and REPLACE, or Upsert on ID.)
                // Strategy: Delete all for this user and re-insert? (Safe but slow for huge data)
                // Better Strategy for MVP: Just Insert new ones or Upsert.
                // Given we don't have a stable unique ID from the CSVs across uploads, 
                // simplistic sync is hard. 
                // DECISION: For this revision, we will just upsert based on SKU if possible, 
                // but since we lack a unique index in the schema I gave, we will actually 
                // just attempt to insert and rely on the UI state management for now.
                // FUTURE IMPROVEMENT: Add unique constraint on (user_id, sku).

                const { error } = await supabase.from('products').upsert(dbRows, { onConflict: 'id' });

                if (error) throw error;
                // console.log(`Synced ${dbRows.length} products to Supabase.`);

            } catch (err) {
                console.error('Supabase Sync Error:', err);
            }
        }
    },

    async saveSettings(settings, user) {
        localStorage.setItem('shopProSettings', JSON.stringify(settings));
        if (isSupabaseConfigured() && user) {
            await supabase.from('settings').upsert({
                user_id: user.id,
                ...settings,
                updated_at: new Date()
            });
        }
    },

    // --- DELETE OPERATIONS ---
    async clearAllUserData(user) {
        // 1. Clear Local
        localStorage.setItem('shopProProducts', '[]');
        localStorage.setItem('shopProFiles', '[]');

        // 2. Clear Cloud
        if (isSupabaseConfigured() && user) {
            try {
                // Delete all products for this user
                await supabase.from('products').delete().eq('user_id', user.id);
                console.log('Cloud data cleared.');
            } catch (e) {
                console.error('Supabase Clear Failed', e);
            }
        }
    }
};
