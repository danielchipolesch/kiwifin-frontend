export default class ClienteService {
	getClientes() {
		return fetch('demo/data/clientes.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}
}
