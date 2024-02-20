<script>
export default {};
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
// import { useLayout } from '@/layout/composables/layout';
import CountryService from '@/service/CountryService';

// const { layoutConfig } = useLayout();
// const email = ref('');
const password1 = ref('');
const password2 = ref('');
const resposta = ref('');

watch(password1, password2, () => {
	if (password1.value !== password2.value) {
		resposta.value = 'Senhas não conferem';
	} else {
		resposta.value = 'Senhas são iguais';
	}
});

// const checked = ref(false);

const countries = ref([]);
// const cities = ref([
//     { name: 'New York', code: 'NY' },
//     { name: 'Rome', code: 'RM' },
//     { name: 'London', code: 'LDN' },
//     { name: 'Istanbul', code: 'IST' },
//     { name: 'Paris', code: 'PRS' }
// ]);
// const filteredCountries = ref(null);
const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(null);
const value5 = ref(null);
const value6 = ref(null);
const value7 = ref(null);
const value8 = ref(null);
const value9 = ref(null);
const value10 = ref(null);
const countryService = new CountryService();

onMounted(() => {
	countryService.getCountries().then((data) => (countries.value = data));
});

// const searchCountry = (event) => {
//     //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
//     const filtered = [];
//     const query = event.query;
//     for (let i = 0; i < countries.value.length; i++) {
//         const country = countries.value[i];
//         if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
//             filtered.push(country);
//         }
//     }
//     filteredCountries.value = filtered;
// };
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
		<!--<div class="text-3xl font-medium text-900 mb-3">Informações Pessoais</div>-->
		<!--<div class="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>-->
		<div class="grid p-fluid mt-3">
			<div class="field col-12 md:col-6">
				<span class="p-float-label">
					<InputText type="text" id="nome" v-model="value1" />
					<label for="nome">Nome</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="cpf" mask="999.999.999-99" v-model="value2"></InputMask>
					<label for="cpf">CPF</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<Calendar inputId="datanascimento" v-model="value3" dateFormat="dd/mm/yy"></Calendar>
					<label for="datanascimento">Data de Nascimento</label>
				</span>
			</div>
			<div class="field col-12 md:col-6">
				<span class="p-float-label">
					<InputText type="email" id="email" v-model="value4" />
					<label for="email">E-mail</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="celular" mask="(99) 99999-9999" v-model="value5"></InputMask>
					<label for="celular">Celular</label>
				</span>
			</div>
			<div class="field col-12 md:col-3">
				<span class="p-float-label">
					<InputMask id="cep" mask="99999-999" v-model="value6"></InputMask>
					<label for="cep">CEP</label>
				</span>
			</div>
			<div class="field col-12 md:col-5">
				<span class="p-float-label">
					<InputText type="text" id="cidade" v-model="value7" />
					<label for="cidade">Cidade</label>
				</span>
			</div>
			<div class="field col-12 md:col-1">
				<span class="p-float-label">
					<InputText type="text" id="uf" v-model="value8" />
					<label for="uf">UF</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="text" id="endereco" v-model="value9" />
					<label for="endereco">Endereço</label>
				</span>
			</div>
			<div class="field col-12 md:col-2">
				<span class="p-float-label">
					<InputText type="text" id="complemento" v-model="value10" />
					<label for="complemento">Complemento</label>
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
					<InputText type="password" id="senhaatual" v-model="value11" />
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
		<!--<div style="height: 150px" class="border-2 border-dashed surface-border"></div>-->
	</div>

	<AppConfig simple />
</template>
