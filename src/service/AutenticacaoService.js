import VueJwtDecode from 'vue-jwt-decode';
import { useRouter } from 'vue-router';

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
		try {
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
				// return response.json();
				const { token } = await response.json();
				const decodedToken = await VueJwtDecode.decode(token);
				localStorage.setItem('token', token);
				localStorage.setItem('isAuthenticated', true);
				localStorage.setItem('perfil', decodedToken.perfil);
				console.log(decodedToken);
				return true;
			} else {
				// const { token } = response.json();
				// localStorage.setItem('token', token);
				// return token;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async autenticarCliente(data) {
		try {
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
				console.log(await response.json());
				localStorage.setItem('isAuthenticated', true);
				// localStorage.setItem('perfil', 'CLIENTE');
			} else {
				response.body;
				const { token } = response.json();
				localStorage.setItem('token', token);
				return token;
			}
		} catch (error) {
			console.log(error);
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
		localStorage.removeItem('token');
	};
}
