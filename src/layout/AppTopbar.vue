<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import AutenticacaoService from '@/service/AutenticacaoService';

const authService = new AutenticacaoService();

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
	bindOutsideClickListener();
});

onBeforeUnmount(() => {
	unbindOutsideClickListener();
});

const logoUrl = computed(() => {
	return `layout/images/${layoutConfig.darkTheme.value ? 'kiwi-fruit-logo' : 'kiwi-fruit-logo'}.png`;
});

const onTopBarMenuButton = () => {
	topbarMenuActive.value = !topbarMenuActive.value;
};

const meuCadastroClick = () => {
	router.push('/cadastro');
};

const sair = async () => {
	authService.logout();
	router.push('/auth/login');
};

const onSettingsClick = () => {
	topbarMenuActive.value = false;
	router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
	return {
		'layout-topbar-menu-mobile-active': topbarMenuActive.value
	};
});

const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = (event) => {
			if (isOutsideClicked(event)) {
				topbarMenuActive.value = false;
			}
		};
		document.addEventListener('click', outsideClickListener.value);
	}
};
const unbindOutsideClickListener = () => {
	if (outsideClickListener.value) {
		document.removeEventListener('click', outsideClickListener);
		outsideClickListener.value = null;
	}
};
const isOutsideClicked = (event) => {
	if (!topbarMenuActive.value) return;

	const sidebarEl = document.querySelector('.layout-topbar-menu');
	const topbarEl = document.querySelector('.layout-topbar-menu-button');

	return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img :src="logoUrl" alt="logo" />
			<!-- <span class="text-green-500 font-medium">Kiwifin Group</span> -->
			<div class="mb-0 font-bold text-3xl">
				<span class="text-green-600">Kiwifin Group</span>
			</div>
		</router-link>

		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
			<i class="pi pi-ellipsis-v"></i>
		</button>

		<div class="layout-topbar-menu" :class="topbarMenuClasses">
			<!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button> -->
			<button @click="meuCadastroClick()" class="p-link layout-topbar-button">
				<i class="pi pi-user"></i>
				<span>Profile</span>
			</button>
			<button @click="sair()" class="p-link layout-topbar-button">
				<i class="pi pi-sign-out"></i>
				<span>Sair</span>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
