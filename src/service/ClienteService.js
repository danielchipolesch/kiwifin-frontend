export default class ClienteService {
	async buscarClientes() {
		return fetch('http://localhost:8080/api/cliente/pesquisar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}
}
