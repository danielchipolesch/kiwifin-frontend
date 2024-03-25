export default class MotivoService {
	getMotivos() {
		return fetch('http://localhost:8080/api/motivo/buscar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	createMotivo(body) {
		return fetch('http://localhost:8080/api/motivo/adicionar', {
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

	updateMotivo(data) {
		return fetch('http://localhost:8080/api/motivo/editar', {
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

	deleteMotivo(idMotivo) {
		return fetch(`http://localhost:8080/api/motivo/inativar/${idMotivo}`, {
			method: 'DELETE',
			headers: { 'Content-type': 'application/json' }
		})
			.then((res) => res.body)
			.catch((err) => console.log(err));
	}
}
