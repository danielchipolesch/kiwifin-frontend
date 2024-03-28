<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import router from '@/router/index'
import AutenticacaoService from '@/service/AutenticacaoService'
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const { layoutConfig } = useLayout();
const cpfRaw = ref(null);
const formulario = ref({})
const checked = ref(false);
const regex = /[0-9]/g;
const submitted = ref(false);
const token = ref(null)

const authService = new AutenticacaoService();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'kfg-logo' : 'kfg-logo'}.png`;
});

const autenticar = async () => {
    submitted.value = true;
    formulario.value.cpf = cpfRaw.value.replace(/[^\d]+/g,'');
    if(formulario.value.cpf && formulario.value.password){
        console.log(`CPF: ${formulario.value.cpf} e senha: ${formulario.value.password}. Formulário enviado!`);   
        try {
            await authService.autenticarColaborador(formulario.value)            
            await router.push({path: '/home'})
        } catch (error) {
            console.log(error)
            toast.add({ severity: 'error', summary: 'Erro', detail: error.message, life: 3000 })
        }           
    }
    // authService.autenticarColaborador(formulario.value)
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-30rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <!-- <form action="" @submit="autenticar($event)"> -->
                        <div class="text-center mb-5">
                            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                            <img :src="logoUrl" alt="Sakai logo" class="mb-6 w-30rem flex-shrink-0" />
                            <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
                            <span class="text-600 font-medium">Entre para continuar</span>
                        </div>
                        <div>
                            <label for="cpf" class="block text-900 text-xl font-medium mb-2">CPF</label>
                            <!-- <InputText id="cpf1" type="text" placeholder="CPF" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="cpf" /> -->
                            <InputMask id="cpf" mask="999.999.999-99" v-model.trim="cpfRaw" :disabled="false" placeholder="CPF" class="w-full md:w-30rem mb-5" style="padding: 1rem"/>
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Senha</label>
                            <Password id="password" v-model.trim="formulario.password" placeholder="Senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Lembre-me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Esqueceu a senha?</a>
                            </div>
                            <Button type="button" label="Entrar" class="p-button-raised w-full p-3 text-xl" @click="autenticar"></Button>
                        </div>
                    <!-- </form> -->
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
