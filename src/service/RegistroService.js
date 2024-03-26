export default class RegistroService {
	async criarRegistroCliente(body) {
		try {
			const res = await fetch('http://localhost:8080/api/cliente/adicionar', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { 'Content-type': 'application/json' }
			});
			if (res.status === 400) {
				throw new Error('Erro inesperado');
			} else {
				res.json();
			}
		} catch (err) {
			return console.log(err);
		}
	}
}
