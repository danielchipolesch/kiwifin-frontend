<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';

const { layoutConfig } = useLayout();
// const email = ref('');
// const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'kfg-logo' : 'kfg-logo'}.png`;
});
</script>

<script>
export default {
    data() {
        return{
            email: "",
            password: ""
        }
    },
    methods:{
        authenticate(e){
            e.preventDefault();
            const email = this.email;
            const password = this.email;
            console.log(`Email: ${email} e senha: ${password}. Formulário enviado!`);
        }
    }
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-30rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <form action="" @submit="authenticate($event)">
                        <div class="text-center mb-5">
                            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                            <img :src="logoUrl" alt="Sakai logo" class="mb-6 w-30rem flex-shrink-0" />
                            <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
                            <span class="text-600 font-medium">Entre para continuar</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email1" type="text" placeholder="Email" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Senha</label>
                            <Password id="password1" v-model="password" placeholder="Senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Lembre-me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Esqueceu a senha?</a>
                            </div>
                            <Button type="submit" label="Entrar" class="p-button-raised w-full p-3 text-xl"></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
