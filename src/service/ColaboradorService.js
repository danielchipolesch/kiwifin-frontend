export default class ColaboradorService {
	async buscarColaboradores() {
		try {
			const res = await fetch('http://localhost:8080/api/colaborador/buscar/todos', {
				method: 'GET'
			});
			return await res.json();
		} catch (err) {
			return console.log(err);
		}
	}

	async criarColaborador(data) {
		try {
			const res = await fetch('http://localhost:8080/api/colaborador/adicionar', {
				method: 'POST',
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

	async atualizarColaborador(data) {
		try {
			const res = await fetch('http://localhost:8080/api/colaborador/editar', {
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

	async deletarColaborador(idColaborador) {
		try {
			const res = await fetch(`http://localhost:8080/api/colaborador/deletar/${idColaborador}`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' }
			});
			return res.body;
		} catch (err) {
			return console.log(err);
		}
	}
}
