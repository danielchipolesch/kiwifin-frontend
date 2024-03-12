<script>
export default {};
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import CadastroService from '@/service/CadastroService';

const password1 = ref('');
const password2 = ref('');
const resposta = ref('');

const cadastroService = new CadastroService();

onMounted(() => {
	cadastroService.getCadastro()
        .then(resposta => {
            nomePessoa.value = resposta[0].nome.toUpperCase(),
            cpf.value = resposta[0].cpf,            
            dataNascimento.value = resposta[0].dtNascimento,
            email.value = resposta[0].email,
            celular.value = resposta[0].celular,
            cep.value = resposta[0].cep,
            logradouro.value = resposta[0].endereco.toUpperCase(),
            complemento.value = resposta[0].complemento.toUpperCase(),
            cidade.value = resposta[0].cidade.toUpperCase(),
            unidadeFederativa.value = resposta[0].uf.toUpperCase(),
            senhaAtual.value = resposta[0].senha
        })
});


watch(password1, password2, () => {
	if (password1.value !== password2.value) {
		resposta.value = 'Senhas não conferem';
	} else {
		resposta.value = 'Senhas são iguais';
	}
});


const data = ref(null);
const nomePessoa = ref(null);
const cpf = ref(null);
const dataNascimento = ref(null);
const email = ref(null);
const celular = ref(null);
const cep = ref(null);
const logradouro = ref(null);
const complemento = ref(null);
const cidade = ref(null);
const unidadeFederativa = ref(null);
const senhaAtual = ref(null);

</script>

<template>
	<Toolbar class="mb-4 bg-green-100">
		<template v-slot:start>
			<div class="my-2">
				<span class="text-black-alpha-90 text-3xl">Informações Pessoais</span>
			</div>
		</template>
	</Toolbar>
	<div class="surface-card p-4 shadow-1 border-round mb-5">
		<div class="grid p-fluid mt-3">
			<div class="field col-12 md:col-6">
				<span class="p-float-label">
					<InputText type="text" id="nome" v-model="nomePessoa" :disabled="true"/>
					<label for="nome">Nome</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="cpf" mask="999.999.999-99" v-model="cpf" :disabled="true"></InputMask>
					<label for="cpf">CPF</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<Calendar inputId="datanascimento" v-model="dataNascimento" dateFormat="dd/mm/yy" :disabled="true"></Calendar>
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
					<InputMask id="cep" mask="99999-999" v-model="cep" :disabled="true"></InputMask>
					<label for="cep">CEP</label>
				</span>
			</div>
            <div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="text" id="endereco" v-model="logradouro" :disabled="true"/>
					<label for="endereco">Endereço</label>
				</span>
			</div>
			<div class="field col-12 md:col-2">
				<span class="p-float-label">
					<InputText type="text" id="complemento" v-model="complemento" :disabled="true"/>
					<label for="complemento">Complemento</label>
				</span>
			</div>
			<div class="field col-12 md:col-5">
				<span class="p-float-label">
					<InputText type="text" id="cidade" v-model="cidade" :disabled="true"/>
					<label for="cidade">Cidade</label>
				</span>
			</div>
			<div class="field col-12 md:col-1">
				<span class="p-float-label">
					<InputText type="text" id="uf" v-model="unidadeFederativa" :disabled="true"/>
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
		<!--<div class="text-3xl font-medium text-900 mb-3">Senha de Acesso</div>-->
		<!--<div class="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>-->
		<div class="grid p-fluid mt-3">
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="password" id="senhaatual" v-model="senhaAtual" :disabled="true"/>
					<label for="senhaatual">Senha atual</label>
				</span>
			</div>

			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<label for="password1" class="block text-900 font-medium text-xl mb-2">Nova Senha</label>
					<Password id="password1" v-model="password1" placeholder="Digite a nova senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '0.5rem' }"></Password>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<label for="password2" class="block text-900 font-medium text-xl mb-2">Repita a nova senha</label>
					<Password id="password2" v-model="password2" placeholder="Repita a senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '0.5rem' }"></Password>
				</span>
				<small>{{ resposta }} Inserir função para validação de senhas</small>
			</div>
		</div>
	</div>

	<AppConfig simple />
</template>
