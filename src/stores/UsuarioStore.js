import { defineStore } from 'pinia';

export const useUsuarioStore = defineStore('usuario', {
	state() {
		return {
			usuario: 0
		};
	},
	actions: {
		increment() {
			this.usuario++;
		}
	},
	getters: {
		mostrarUsuario() {
			return `o nome do usuário é ${this.usuario}`;
		}
	}
});
