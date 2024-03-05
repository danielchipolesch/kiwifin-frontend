export default class CadastroService {
	getCadastro() {
		return fetch('demo/data/cadastros.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}
}
