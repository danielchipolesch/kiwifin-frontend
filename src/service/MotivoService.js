export default class MotivoService {
	async buscarMotivos() {
		try {
			const res = await fetch('http://localhost:8080/api/motivo/buscar/todos', {
				method: 'GET'
			});
			return await res.json();
		} catch (err) {
			return console.log(err);
		}
	}

	async criarMotivo(body) {
		try {
			const res = await fetch('http://localhost:8080/api/motivo/adicionar', {
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

	async atualizarMotivo(data) {
		try {
			const res = await fetch('http://localhost:8080/api/motivo/editar', {
				method: 'PUT',
				body: JSON.stringify(data),
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

	async deletarMotivo(idMotivo) {
		try {
			const res = await fetch(`http://localhost:8080/api/motivo/inativar/${idMotivo}`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' }
			});
			return res.body;
		} catch (err) {
			return console.log(err);
		}
	}
}
