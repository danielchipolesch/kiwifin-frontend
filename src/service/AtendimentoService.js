export default class AtendimentoService {
	async buscarAtendimentosPaginaTamanho(page, size) {
		return fetch(`http://localhost:8080/api/atendimento/listar/filtrado/${page}/${size}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async buscarAtendimentos() {
		return fetch(`http://localhost:8080/api/atendimento/listar/filtrado/1/1`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async buscarAtendimentosPorCliente(idCliente) {
		return fetch(`http://localhost:8080/api/atendimento/buscar/cliente/${idCliente}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async criarAtendimento(body) {
		try {
			const res = await fetch('http://localhost:8080/api/atendimento/adicionar', {
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
