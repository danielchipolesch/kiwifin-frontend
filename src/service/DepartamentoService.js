export default class DepartamentoService {
	async buscarDepartamentos() {
		try {
			const res = await fetch('http://localhost:8080/api/departamento/buscar/todos', {
				method: 'GET'
			});
			return await res.json();
		} catch (err) {
			return console.log(err);
		}
	}

	async criarDepartamento(body) {
		try {
			const res = await fetch('http://localhost:8080/api/departamento/adicionar', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { 'Content-type': 'application/json' }
			});
			return await res.json();
		} catch (err) {
			return console.log(err);
		}
	}

	async atualizarDepartamento(data) {
		try {
			const res = await fetch('http://localhost:8080/api/departamento/editar', {
				method: 'PUT',
				body: JSON.stringify(data),
				headers: { 'Content-type': 'application/json' }
			});
			return await res.json();
		} catch (err) {
			return console.log(err);
		}
	}

	async deletarDepartamento(idDepartamento) {
		try {
			const res = await fetch(`http://localhost:8080/api/departamento/deletar/${idDepartamento}`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' }
			});
			return console.log(res.status);
		} catch (err) {
			return console.log(err);
		}
	}
}
