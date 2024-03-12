export default class ProductService {
	getAtendimentosSmall() {
		return fetch('demo/data/atendimentos-small.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}

	getAtendimentos() {
		return fetch('demo/data/atendimentos.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}

	getProductsWithOrdersSmall() {
		return fetch('demo/data/atendimentos-orders-small.json')
			.then((res) => res.json())
			.then((d) => d.data);
	}
}
