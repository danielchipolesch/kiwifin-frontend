export default class MotivoService {
	getMotivos() {
		return (
			fetch('http://localhost:8080/api/motivo/buscar/todos', {
				method: 'GET'
			})
				.then((res) => res.json())
				// .then((d) => d.data)
				.catch((err) => console.log(err))
		);
	}
}
