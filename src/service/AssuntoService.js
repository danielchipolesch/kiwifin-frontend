export default class AssuntoService {
	getAssuntos() {
		return fetch('demo/data/assuntos.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}
}
