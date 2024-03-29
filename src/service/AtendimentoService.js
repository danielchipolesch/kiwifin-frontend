export default class AtendimentoService {
	async buscarAtendimentosPaginaTamanho(page, size) {
		return fetch(`http://localhost:8080/api/atendimento/listar/filtrado/${page}/${size}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async buscarAtendimentos() {
		return fetch(`http://localhost:8080/api/atendimento/listar/todos`, {
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

	async assumirAtendimento(data) {
		try {
			const res = await fetch('http://localhost:8080/api/atendimento/atendente/assumir', {
				method: 'PUT',
				body: JSON.stringify(data),
				headers: { 'Content-type': 'application/json' }
			});
			if (res.status === 400) {
				throw new Error('Erro inesperado 1');
			}
			if (res.status === 200) {
				res.json();
			}
		} catch (err) {
			return console.log(err);
		}
	}
}
