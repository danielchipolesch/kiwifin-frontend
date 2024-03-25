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
	<div class="surface-card p-4 shadow-1 border-round mb-5">
		<div class="grid p-fluid mt-3">
			<div class="field col-12 md:col-6">
				<span class="p-float-label">
					<InputText type="text" id="nome" v-model="nomePessoa" :disabled="false"/>
					<label for="nome">Nome</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="cpf" mask="999.999.999-99" v-model="cpf" :disabled="false"></InputMask>
					<label for="cpf">CPF</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<Calendar inputId="datanascimento" v-model="dataNascimento" dateFormat="dd/mm/yy" :disabled="false"/>
					<label for="datanascimento">Data de Nascimento</label>
				</span>
			</div>
			<div class="field col-12 md:col-6">
				<span class="p-float-label">
					<InputText type="email" id="email" v-model="email" />
					<label for="email">E-mail</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="celular" mask="(99) 99999-9999" v-model="celular"></InputMask>
					<label for="celular">Celular</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="cep" mask="99999-999" v-model="cep" :disabled="false"></InputMask>
					<label for="cep">CEP</label>
				</span>
			</div>
            <div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="text" id="endereco" v-model="logradouro" :disabled="false"/>
					<label for="endereco">Endereço</label>
				</span>
			</div>
			<div class="field col-12 md:col-2">
				<span class="p-float-label">
					<InputText type="text" id="complemento" v-model="complemento" :disabled="false"/>
					<label for="complemento">Complemento</label>
				</span>
			</div>
			<div class="field col-12 md:col-5">
				<span class="p-float-label">
					<InputText type="text" id="cidade" v-model="cidade" :disabled="false"/>
					<label for="cidade">Cidade</label>
				</span>
			</div>
			<div class="field col-12 md:col-1">
				<span class="p-float-label">
					<InputText type="text" id="uf" v-model="unidadeFederativa" :disabled="false"/>
					<label for="uf">UF</label>
				</span>
			</div>
		</div>
		<!--<div style="height: 150px" class="border-2 border-dashed surface-border"></div>-->
	</div>
	<Toolbar class="mb-4 bg-green-100">
		<template v-slot:start>
			<div class="my-2">
				<span class="text-black-alpha-90 text-3xl">Senha de Acesso</span>
			</div>
		</template>
	</Toolbar>
	<div class="surface-card p-4 shadow-1 border-round">
		<div class="grid p-fluid mt-3">
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="password" id="insiraSenha" v-model="insiraSenha" :disabled="false"/>
					<label for="insiraSenha">Nova Senha</label>
				</span>
			</div>
            <div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="password" id="repitaSenha" v-model="repitaSenha" :disabled="false"/>
					<label for="repitaSenha">Repita a Senha</label>
				</span>
			</div>
			<small>{{ resposta }} senhas não conferem</small>
		</div>
        <div class="flex flex-row-reverse flex-wrap">
            <Button label="Registrar" class="p-button-raised mr-2 mb-2"/>
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
