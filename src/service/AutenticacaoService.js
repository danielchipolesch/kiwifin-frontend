// import jwt from 'jsonwebtoken';
// const API_URL = 'http://localhost:8080/api';

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
				throw new Error('Erro inesperado');
			}
			if (response.status === 200) {
				// return response.json();
				const { token } = await response.json();
				localStorage.setItem('token', token);
				return token;
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
				localStorage.setItem('isAuth', true);
				localStorage.setItem('perfil', 'CLIENTE');
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
