import { api, type AuthUser } from './api';

const readPlatformTokenFromHash = (): string | null => {
	const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
	const params = new URLSearchParams(hash);
	return params.get('token');
};

export const authApi = {
	async login(): Promise<void> {
		await api.auth.login();
	},

	async logout(): Promise<void> {
		localStorage.removeItem('auth_token');
	},

	async getCurrentUser(): Promise<AuthUser> {
		const response = await api.auth.me();
		return response.data;
	},

	async completeCallback(): Promise<void> {
		const platformToken = readPlatformTokenFromHash();
		if (!platformToken) {
			throw new Error('Missing token from authentication callback.');
		}

		const exchange = await api.auth.exchangePlatformToken(platformToken);
		localStorage.setItem('auth_token', exchange.data.token);
	},
};
