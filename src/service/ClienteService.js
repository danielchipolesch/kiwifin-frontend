export default class ClienteService {
	async buscarClientes() {
		return fetch('http://localhost:8080/api/cliente/pesquisar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async buscarClientePorCpf(cpf) {
		return fetch(`http://localhost:8080/api/cliente/pesquisar/cpf=${cpf}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}

	async atualizarCliente() {
		return await fetch('http://localhost:8080/api/cliente/editar', {
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
}
