export default class DepartamentoService {
	getDepartamentos() {
		return fetch('http://localhost:8080/api/departamento/buscar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	createDepartamento(body) {
		return fetch('http://localhost:8080/api/departamento/adicionar', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	updateDepartamento(data) {
		return fetch('http://localhost:8080/api/departamento/editar', {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	deleteDepartamento(idDepartamento) {
		return fetch(`http://localhost:8080/api/departamento/deletar/${idDepartamento}`, {
			method: 'DELETE',
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => console.log(res.status))
			.catch((err) => console.log(err));
	}
}
