export default class MotivoService {
	getMotivos() {
		return fetch('demo/data/motivos.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}
}
