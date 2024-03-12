import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'landing-page',
			component: () => import('@/views/menuLateral/pages/Landing.vue')
		},
		{
			path: '/landing',
			name: 'landing',
			component: () => import('@/views/menuLateral/pages/Landing.vue')
		},
		{
			path: '/pages/notfound',
			name: 'notfound',
			component: () => import('@/views/menuLateral/pages/NotFound.vue')
		},

		{
			path: '/auth/login',
			name: 'login',
			component: () => import('@/views/menuLateral/pages/auth/Login.vue')
		},
		{
			path: '/auth/access',
			name: 'accessDenied',
			component: () => import('@/views/menuLateral/pages/auth/Access.vue')
		},
		{
			path: '/auth/error',
			name: 'error',
			component: () => import('@/views/menuLateral/pages/auth/Error.vue')
		},
		{
			path: '/home',
			component: AppLayout,
			children: [
				{
					path: '/home',
					name: 'dashboard',
					component: () => import('@/views/menuLateral/Dashboard.vue')
				},
				{
					path: '/cadastro',
					name: 'cadastro',
					component: () => import('@/views/menuSuperior/Cadastro.vue')
				},
				{
					path: '/atendimento',
					name: 'atendimento',
					component: () => import('@/views/menuLateral/geral/Atendimento.vue')
				},
				{
					path: '/cliente',
					name: 'cliente',
					component: () => import('@/views/menuLateral/geral/Cliente.vue')
				},
				{
					path: '/motivo',
					name: 'motivo',
					component: () => import('@/views/menuLateral/geral/Motivo.vue')
				},
				{
					path: '/uikit/formlayout',
					name: 'formlayout',
					component: () => import('@/views/menuLateral/uikit/FormLayout.vue')
				},
				{
					path: '/uikit/input',
					name: 'input',
					component: () => import('@/views/menuLateral/uikit/Input.vue')
				},
				{
					path: '/uikit/floatlabel',
					name: 'floatlabel',
					component: () => import('@/views/menuLateral/uikit/FloatLabel.vue')
				},
				{
					path: '/uikit/invalidstate',
					name: 'invalidstate',
					component: () => import('@/views/menuLateral/uikit/InvalidState.vue')
				},
				{
					path: '/uikit/button',
					name: 'button',
					component: () => import('@/views/menuLateral/uikit/Button.vue')
				},
				{
					path: '/uikit/table',
					name: 'table',
					component: () => import('@/views/menuLateral/uikit/Table.vue')
				},
				{
					path: '/uikit/list',
					name: 'list',
					component: () => import('@/views/menuLateral/uikit/List.vue')
				},
				{
					path: '/uikit/tree',
					name: 'tree',
					component: () => import('@/views/menuLateral/uikit/Tree.vue')
				},
				{
					path: '/uikit/panel',
					name: 'panel',
					component: () => import('@/views/menuLateral/uikit/Panels.vue')
				},

				{
					path: '/uikit/overlay',
					name: 'overlay',
					component: () => import('@/views/menuLateral/uikit/Overlay.vue')
				},
				{
					path: '/uikit/media',
					name: 'media',
					component: () => import('@/views/menuLateral/uikit/Media.vue')
				},
				{
					path: '/uikit/menu',
					component: () => import('@/views/menuLateral/uikit/Menu.vue'),
					children: [
						{
							path: '/uikit/menu',
							component: () => import('@/views/menuLateral/uikit/menu/PersonalDemo.vue')
						},
						{
							path: '/uikit/menu/seat',
							component: () => import('@/views/menuLateral/uikit/menu/SeatDemo.vue')
						},
						{
							path: '/uikit/menu/payment',
							component: () => import('@/views/menuLateral/uikit/menu/PaymentDemo.vue')
						},
						{
							path: '/uikit/menu/confirmation',
							component: () => import('@/views/menuLateral/uikit/menu/ConfirmationDemo.vue')
						}
					]
				},
				{
					path: '/uikit/message',
					name: 'message',
					component: () => import('@/views/menuLateral/uikit/Messages.vue')
				},
				{
					path: '/uikit/file',
					name: 'file',
					component: () => import('@/views/menuLateral/uikit/File.vue')
				},
				{
					path: '/uikit/charts',
					name: 'charts',
					component: () => import('@/views/menuLateral/uikit/Chart.vue')
				},
				{
					path: '/uikit/misc',
					name: 'misc',
					component: () => import('@/views/menuLateral/uikit/Misc.vue')
				},
				{
					path: '/blocks',
					name: 'blocks',
					component: () => import('@/views/menuLateral/utilities/Blocks.vue')
				},
				{
					path: '/utilities/icons',
					name: 'icons',
					component: () => import('@/views/menuLateral/utilities/Icons.vue')
				},
				{
					path: '/pages/timeline',
					name: 'timeline',
					component: () => import('@/views/menuLateral/pages/Timeline.vue')
				},
				{
					path: '/pages/empty',
					name: 'empty',
					component: () => import('@/views/menuLateral/pages/Empty.vue')
				},
				{
					path: '/pages/crud',
					name: 'crud',
					component: () => import('@/views/menuLateral/pages/Crud.vue')
				},
				{
					path: '/documentation',
					name: 'documentation',
					component: () => import('@/views/menuLateral/utilities/Documentation.vue')
				}
			]
		}
	]
});

export default router;
