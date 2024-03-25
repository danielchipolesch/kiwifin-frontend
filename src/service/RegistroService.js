export default class RegistroService {
	criarRegistroCliente(body) {
		return fetch('http://localhost:8080/api/cliente/adicionar', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => {
				console.log(res.body);
				if (res.status === 400) {
					throw new Error('Erro inesperado');
				} else {
					res.json();
				}
			})
			.catch((err) => console.log(err));
	}
}
