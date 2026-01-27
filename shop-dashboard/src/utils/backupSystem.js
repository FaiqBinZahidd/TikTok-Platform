/**
 * Quantro Vault - Backup & Restore System
 * Handles secure JSON serialization of application state.
 */

export const generateBackup = (products, settings, uploadedFiles, currentUser) => {
    const backupData = {
        meta: {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            user: currentUser || 'Guest'
        },
        data: {
            products,
            settings,
            uploadedFiles,
            // Include other critical state if needed
            preferences: {
                // Future proofing
            }
        }
    };

    return JSON.stringify(backupData, null, 2);
};

export const downloadBackup = (jsonString) => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Generate filename: quantro_backup_YYYY-MM-DD.json
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `quantro_vault_backup_${dateStr}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const parseBackupFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                // Validate structure
                if (!json.meta || !json.data || !Array.isArray(json.data.products)) {
                    throw new Error("Invalid backup format");
                }
                resolve(json.data);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error("File read error"));
        reader.readAsText(file);
    });
};
