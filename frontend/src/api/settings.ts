import { getAPIBaseURL } from '../lib/config';

// Don't cache the getAPIBaseURL(), get it dynamically
const getAPIBase = () => `${getAPIBaseURL()}/api/v1`;

export interface EnvConfig {
    key: string;
    value: string;
    description: string;
}

export interface EnvVariableUpdate {
    key: string;
    value: string;
}

export const settingsApi = {
    // Fetch all configurations
    async getConfig(): Promise<EnvConfig[]> {
        const response = await fetch(`${getAPIBase()}/admin/settings/`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch configuration');
        }

        return response.json();
    },

    // Update backend configuration
    async updateBackendConfig(
        key: string,
        value: string
    ): Promise<{ message: string }> {
        const response = await fetch(`${getAPIBase()}/admin/settings/backend/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ value }),
        });

        if (!response.ok) {
            throw new Error('Failed to update backend configuration');
        }

        return response.json();
    },

    // Add frontend configuration
    async addFrontendConfig(
        key: string,
        value: string
    ): Promise<{ message: string }> {
        const response = await fetch(`${getAPIBase()}/admin/settings/frontend/${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ value }),
        });

        if (!response.ok) {
            throw new Error('Failed to add frontend configuration');
        }

        return response.json();
    },

    // Delete backend configuration
    async deleteBackendConfig(key: string): Promise<{ message: string }> {
        const response = await fetch(`${getAPIBase()}/admin/settings/backend/${key}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete backend configuration');
        }

        return response.json();
    },
};