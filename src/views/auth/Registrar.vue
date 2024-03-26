<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted } from 'vue';
import RegistroService from '@/service/RegistroService'
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const { layoutConfig } = useLayout();
const checked = ref(false);
const formulario = ref([]);
const inserirSenha = ref(null);
const repetirSenha = ref(null);
const dataRaw = ref(null);
const cpfRaw = ref(null);
const submitted = ref(false);
const regex = /[0-9]/g;


const registroService = new RegistroService();

const submeterFormulario = () => {
submitted.value = true;
    if(formulario.value.nome && formulario.value.email && formulario.value.celular && formulario.value.cep && formulario.value.endereco && formulario.value.complemento && formulario.value.cidade && formulario.value.uf && inserirSenha.value && repetirSenha.value) {
        if (inserirSenha.value === repetirSenha.value){
            formulario.value.dataNascimento = new Date(dataRaw.value).toISOString();
            formulario.value.cpf = cpfRaw.value.replace(/[^\d]+/g,'');
            formulario.value.senha = inserirSenha.value ? inserirSenha.value : repetirSenha.value
            console.log(formulario.value);
            registroService.criarRegistroCliente(formulario.value)               
                .then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento criado', life: 3000 }))
                .catch(err => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }))
            new Promise(() => setTimeout(window.location.href = "http://localhost:5173/#/auth/login", 3000))
            // formulario.value = {};
            // console.log(formulario.value);
        }
    }
}

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'kfg-logo' : 'kfg-logo'}.png`;
});

onMounted(() => {
	formulario.value = {};
	submitted.value = false;
});

</script>


<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Kiwifin Logo" class="mb-6 w-30rem flex-shrink-0" />
                        <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
                        <span class="text-600 font-medium">Registre-se para continuar</span>
                    </div>                        
                    <div class="grid p-fluid mt-3">
                        <div class="field col-12 md:col-6">
                            <span class="p-float-label">
                                <InputText type="text" id="nome" v-model="formulario.nome" :disabled="false" :class="{ 'p-invalid': submitted && !formulario.nome }"/>
                                <label for="nome">Nome</label>
                                <small class="p-invalid" v-if="submitted && !formulario.nome">Nome é obrigatório.</small>
                            </span>
                            
                        </div>
                        <div class="field col-12 md:col-3">
                            <span class="p-float-label">
                                <InputMask id="cpf" mask="999.999.999-99" v-model.trim="cpfRaw" :disabled="false"></InputMask>
                                <label for="cpf">CPF</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-3">
                            <span class="p-float-label">
                                <Calendar inputId="datanascimento" v-model="dataRaw" dateFormat="dd/mm/yy" :disabled="false"/>
                                <label for="datanascimento">Data de Nascimento</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6">
                            <span class="p-float-label">
                                <InputText type="email" id="email" v-model.trim="formulario.email" />
                                <label for="email">E-mail</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-3">
                            <span class="p-float-label">
                                <InputMask id="celular" mask="(99) 99999-9999" v-model.trim="formulario.celular"></InputMask>
                                <label for="celular">Celular</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-3">
                            <span class="p-float-label">
                                <InputMask id="cep" mask="99999-999" v-model.trim="formulario.cep" :disabled="false"></InputMask>
                                <label for="cep">CEP</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-4">
                            <span class="p-float-label">
                                <InputText type="text" id="endereco" v-model="formulario.endereco" :disabled="false"/>
                                <label for="endereco">Endereço</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-2">
                            <span class="p-float-label">
                                <InputText type="text" id="complemento" v-model="formulario.complemento" :disabled="false"/>
                                <label for="complemento">Complemento</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-5">
                            <span class="p-float-label">
                                <InputText type="text" id="cidade" v-model="formulario.cidade" :disabled="false"/>
                                <label for="cidade">Cidade</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-1">
                            <span class="p-float-label">
                                <InputText type="text" id="uf" v-model.trim="formulario.uf" :disabled="false"/>
                                <label for="uf">UF</label>
                            </span>
                        </div>
                    </div>              
                    <div class="grid p-fluid mt-3">
                        <div class="field col-12 md:col-4">
                            <span class="p-float-label">
                                <InputText type="password" id="insiraSenha" v-model.trim="inserirSenha" :disabled="false"/>
                                <label for="insiraSenha">Nova Senha</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-4">
                            <span class="p-float-label">
                                <InputText type="password" id="repitaSenha" v-model.trim="repetirSenha" :disabled="false"/>
                                <label for="repitaSenha">Repita Senha</label>
                            </span>
                        </div>
                        <div>
                            <small>As senhas não conferem</small>
                        </div>
                    </div>
                    <div class="flex flex-row-reverse flex-wrap">
                        <Button type="submit" label="Registrar" class="p-button-raised mr-2 mb-2" @click="submeterFormulario"/>
                    </div>
                    

                    <!-- <div>
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
                    </div> -->
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
