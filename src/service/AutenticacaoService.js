import VueJwtDecode from 'vue-jwt-decode';
import router from '@/router/index';

export default class AutenticacaoService {
	async getHeaders() {
		const token = localStorage.getItem('token');
		return {
			Authorization: `${token}`,
			// Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		};
	}

	async autenticarColaborador(data) {
		const response = await fetch('http://localhost:8080/api/autenticacao/colaborador/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
			mode: 'cors'
		});
		if (response.status === 400) {
			return localStorage.setItem('isAuthenticated', false);
		}
		if (response.status === 200) {
			const { token } = await response.json();
			const decodedToken = await VueJwtDecode.decode(token);
			localStorage.setItem('token', token);
			localStorage.setItem('isAuthenticated', true);
			localStorage.setItem('perfil', decodedToken.perfil);
			// await router.push({ path: '/home' });
			return true;
		} else {
			// const { token } = response.json();
			// localStorage.setItem('token', token);
			// return token;
		}
	}

	async autenticarCliente(data) {
		const response = await fetch('http://localhost:8080/api/autenticacao/cliente/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
			mode: 'cors'
		});
		if (response.status === 400) {
			throw new Error('Erro inesperado');
		}
		if (response.status === 200) {
			const { idCliente } = await response.json();
			localStorage.setItem('isAuthenticated', true);
			localStorage.setItem('perfil', 'CLIENTE');
			localStorage.setItem('idCliente', idCliente);
			localStorage.setItem('token', null);
			// router.push({ path: '/home' });
			return true;
		} else {
			// response.body;
			// const { token } = response.json();
			// localStorage.setItem('token', token);
			// return token;
		}
	}

	async buscarColaborador() {
		const response = await fetch(`${API_URL}/user`, {
			headers: getHeaders()
		});
		const colaborador = await response.json();
		return colaborador;
	}

	logout = () => {
		localStorage.clear();
	};
}
