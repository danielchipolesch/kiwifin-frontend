export default class ColaboradorService {
	buscarColaboradores() {
		return fetch('http://localhost:8080/api/colaborador/buscar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	criarColaborador(body) {
		return fetch('http://localhost:8080/api/colaborador/adicionar', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => {
				if (res.status === 400) {
					throw new Error('Erro inesperado');
				} else {
					res.json();
				}
			})
			.catch((err) => console.log(err));
	}

	atualizarColaborador(data) {
		return fetch('http://localhost:8080/api/colaborador/editar', {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => {
				if (res.status === 400) {
					throw new Error('Erro inesperado');
				} else {
					res.json();
				}
			})
			.catch((err) => console.log(err));
	}

	deletarColaborador(idColaborador) {
		return fetch(`http://localhost:8080/api/colaborador/deletar/${idColaborador}`, {
			method: 'DELETE',
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => res.body)
			.catch((err) => console.log(err));
	}
}
