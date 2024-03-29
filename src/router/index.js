import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'landing',
			component: () => import('@/views/pages/Landing.vue')
		},
		{
			path: '/auth/registrar',
			name: 'registrar',
			component: () => import('@/views/auth/Registrar.vue')
		},
		{
			path: '/auth/login',
			name: 'login',
			component: () => import('@/views/auth/Login.vue')
		},
		{
			path: '/auth/access',
			name: 'accessDenied',
			component: () => import('@/views/auth/Access.vue')
		},
		{
			path: '/auth/error',
			name: 'error',
			component: () => import('@/views/auth/Error.vue')
		},
		{
			path: '/pages/notfound',
			name: 'notfound',
			component: () => import('@/views/pages/NotFound.vue')
		},
		{
			path: '/home',
			component: AppLayout,
			// meta: { requiresAuth: true },
			children: [
				{
					path: '/home',
					name: 'dashboard',
					component: () => import('@/views/Dashboard.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/cadastro',
					name: 'cadastro',
					component: () => import('@/views/geral/Cadastro.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/atendimento',
					name: 'atendimento',
					component: () => import('@/views/geral/Atendimento.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/cliente',
					name: 'cliente',
					component: () => import('@/views/geral/Cliente.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/colaborador',
					name: 'colaborador',
					component: () => import('@/views/geral/Colaborador.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/departamento',
					name: 'departamento',
					component: () => import('@/views/geral/Departamento.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/motivo',
					name: 'motivo',
					component: () => import('@/views/geral/Motivo.vue')
					// beforeEnter: async (to, from, next) => {
					// 	if (token !== null || isAuth === true) {
					// 		next();
					// 	} else if (token === null || isAuth === false) {
					// 		next('/auth/login');
					// 	}
					// }
				},
				{
					path: '/uikit/formlayout',
					name: 'formlayout',
					component: () => import('@/views/uikit/FormLayout.vue')
				},
				{
					path: '/uikit/input',
					name: 'input',
					component: () => import('@/views/uikit/Input.vue')
				},
				{
					path: '/uikit/floatlabel',
					name: 'floatlabel',
					component: () => import('@/views/uikit/FloatLabel.vue')
				},
				{
					path: '/uikit/invalidstate',
					name: 'invalidstate',
					component: () => import('@/views/uikit/InvalidState.vue')
				},
				{
					path: '/uikit/button',
					name: 'button',
					component: () => import('@/views/uikit/Button.vue')
				},
				{
					path: '/uikit/table',
					name: 'table',
					component: () => import('@/views/uikit/Table.vue')
				},
				{
					path: '/uikit/list',
					name: 'list',
					component: () => import('@/views/uikit/List.vue')
				},
				{
					path: '/uikit/tree',
					name: 'tree',
					component: () => import('@/views/uikit/Tree.vue')
				},
				{
					path: '/uikit/panel',
					name: 'panel',
					component: () => import('@/views/uikit/Panels.vue')
				},
				{
					path: '/uikit/overlay',
					name: 'overlay',
					component: () => import('@/views/uikit/Overlay.vue')
				},
				{
					path: '/uikit/media',
					name: 'media',
					component: () => import('@/views/uikit/Media.vue')
				},
				{
					path: '/uikit/menu',
					component: () => import('@/views/uikit/Menu.vue'),
					children: [
						{
							path: '/uikit/menu',
							component: () => import('@/views/uikit/menu/PersonalDemo.vue')
						},
						{
							path: '/uikit/menu/seat',
							component: () => import('@/views/uikit/menu/SeatDemo.vue')
						},
						{
							path: '/uikit/menu/payment',
							component: () => import('@/views/uikit/menu/PaymentDemo.vue')
						},
						{
							path: '/uikit/menu/confirmation',
							component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
						}
					]
				},
				{
					path: '/uikit/message',
					name: 'message',
					component: () => import('@/views/uikit/Messages.vue')
				},
				{
					path: '/uikit/file',
					name: 'file',
					component: () => import('@/views/uikit/File.vue')
				},
				{
					path: '/uikit/charts',
					name: 'charts',
					component: () => import('@/views/uikit/Chart.vue')
				},
				{
					path: '/uikit/misc',
					name: 'misc',
					component: () => import('@/views/uikit/Misc.vue')
				},
				{
					path: '/blocks',
					name: 'blocks',
					component: () => import('@/views/utilities/Blocks.vue')
				},
				{
					path: '/utilities/icons',
					name: 'icons',
					component: () => import('@/views/utilities/Icons.vue')
				},
				{
					path: '/pages/timeline',
					name: 'timeline',
					component: () => import('@/views/pages/Timeline.vue')
				},
				{
					path: '/pages/empty',
					name: 'empty',
					component: () => import('@/views/pages/Empty.vue')
				},
				{
					path: '/pages/crud',
					name: 'crud',
					component: () => import('@/views/pages/Crud.vue')
				},
				{
					path: '/documentation',
					name: 'documentation',
					component: () => import('@/views/utilities/Documentation.vue')
				}
			]
		}
	]
});

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token');
	const isAuth = localStorage.getItem('isAuthenticated');
	const idCliente = localStorage.getItem('idCliente');
	console.log(token);
	console.log(isAuth);
	if (to.path === '/auth/login') {
		if (token === null || isAuth === false) {
			console.log('Entrou aqui');
			next();
		} else if (token !== null || isAuth === true) {
			console.log('Entrou aqui 2');
			next('/home');
		}
	} else if (
		to.path.startsWith('/home') ||
		to.path.startsWith('/cadastro') ||
		to.path.startsWith('/atendimento') ||
		to.path.startsWith('/cliente') ||
		to.path.startsWith('/colaborador') ||
		to.path.startsWith('/departamento') ||
		to.path.startsWith('/motivo')
	) {
		if (isAuth && (token !== null || idCliente !== null)) {
			console.log('Entrou aqui 3');
			next();
		}
		if (token === null || !isAuth) {
			console.log('Entrou aqui 4');
			next({ path: '/auth/login' });
			// next();
		}
	} else {
		console.log('Entrou aqui 5');
		next();
	}
});

export default router;
