export default class PerfilService {
	async buscarPerfis() {
		return fetch('http://localhost:8080/api/perfil/buscar/todos', {
			method: 'GET'
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
	}
}
