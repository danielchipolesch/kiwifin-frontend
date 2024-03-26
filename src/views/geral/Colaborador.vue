<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ColaboradorService from '@/service/ColaboradorService';
import DepartamentoService from '@/service/DepartamentoService';
import PerfilService from '@/service/PerfilService';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

const toast = useToast();

const departamentos = ref(null)
const colaboradores = ref(null);
const perfis = ref([]);
const colaboradorDialog = ref(false);
const deleteColaboradorDialog = ref(false);
const deleteColaboradoresDialog = ref(false);
const colaborador = ref({});
const perfil = ref(null)
const perfisSelecionados = ref([]);
const selectedColaboradores = ref(null);
const dt = ref(null);
const filters = ref({});
const cpf = ref(null)
const submitted = ref(false);


const colaboradorService = new ColaboradorService();
const departamentoService = new DepartamentoService();
const perfilService = new PerfilService();

const buscarColaboradores = () => {
    colaboradorService.buscarColaboradores()
        .then((data) => (colaboradores.value = data));
}

const buscarDepartamentos = () => {
    departamentoService.getDepartamentos()
        .then(data => departamentos.value = data);
}

const buscarPerfis = () => {
    perfilService.buscarPerfis()
        .then(data => perfis.value = data);
}

onBeforeMount(() => {
	initFilters();
});

onMounted(() => {
	buscarColaboradores();
    buscarDepartamentos();
    buscarPerfis();
});

const formatarString = (value) => {
	return value.toUpperCase();
};

const openNew = () => {
	colaborador.value = {};
	submitted.value = false;
	colaboradorDialog.value = true;
};

const hideDialog = () => {
	colaboradorDialog.value = false;
	submitted.value = false;
};

const salvarColaborador = () => {
	submitted.value = true;
    //  && colaborador.value.cpf && colaborador.value.email && colaborador.value.departamento && colaborador.value.perfil
	if (colaborador.value.nome) {
		if (colaborador.value.idColaborador) {
            colaborador.value.nome = colaborador.value.nome.value ? colaborador.value.nome.value : colaborador.value.nome;
            colaborador.value.email = colaborador.value.email.value ? colaborador.value.email.value : colaborador.value.email;
			colaborador.value.cpf = colaborador.value.cpf.value ? colaborador.value.cpf.value : colaborador.value.cpf;
            colaborador.value.departamento = colaborador.value.departamento.value ? colaborador.value.departamento.value : colaborador.value.departamento;
            colaborador.value.perfil = perfisSelecionados.value ? perfisSelecionados.value : colaborador.value.perfil;
			colaboradores.value[findIndexById(colaborador.value.id)] = colaborador.value;
            colaboradorService.atualizarColaborador(colaborador.value)
                .then(() => buscarColaboradores())
                .then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador atualizado', life: 3000 }))
                .catch(err => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }))
		} else {
            colaborador.value.perfil = perfisSelecionados.value ? perfisSelecionados.value : colaborador.value.perfil;
			colaboradorService.criarColaborador(colaborador.value)
                .then(() => buscarColaboradores())
                .then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador criado', life: 3000 }))
                .catch(err => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }))
            console.log(colaborador.value)
			// colaboradores.value.push(colaborador.value);
			// toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador criado', life: 3000 });
		}        
			// colaboradores.value.push(colaborador.value);
			// toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador criado', life: 3000 });
		colaboradorDialog.value = false;
		colaborador.value = {};
	}
};

const editarColaborador = (editarColaborador) => {
	colaborador.value = { ...editarColaborador };
    perfisSelecionados.value = colaborador.value.perfil
	console.log(perfisSelecionados.value);
	colaboradorDialog.value = true;
};

const confirmaDeletarColaborador = (editarColaborador) => {
	colaborador.value = editarColaborador;
	deleteColaboradorDialog.value = true;
};

const deletarColaborador = () => {
	colaboradores.value = colaboradores.value.filter((val) => val.idColaborador !== colaborador.value.idColaborador);
    colaboradorService.deletarColaborador(colaborador.value.idColaborador)
        .then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador Excluído', life: 3000 }))
	deleteColaboradorDialog.value = false;
	colaborador.value = {};
};

const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < colaboradores.value.length; i++) {
		if (colaboradores.value[i].id === id) {
			index = i;
			break;
		}
	}
	return index;
};

const confirmDeleteSelected = () => {
	deleteColaboradoresDialog.value = true;
};

const deleteSelectedColaboradores = () => {
	colaboradores.value = colaboradores.value.filter((val) => !selectedColaboradores.value.includes(val));
	deleteColaboradoresDialog.value = false;
	selectedColaboradores.value = null;
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaboradores Excluídos', life: 3000 });
};

const initFilters = () => {
	filters.value = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS }
	};
};
</script>

<template>
	<Toolbar class="mb-4 bg-green-100">
		<template v-slot:start>
			<div class="my-2">
				<span class="text-black-alpha-90 text-3xl">Colaboradores</span>
			</div>
		</template>
	</Toolbar>

	<div class="grid">
		<div class="col-12">
			<div class="surface-card p-4 shadow-1 border-round mb-5">
				<Toast />
                    <Toolbar class="mb-4">
                        <template v-slot:start>
                            <div class="my-2">
                                <Button label="Novo" icon="pi pi-plus" class="p-button-raised p-button-primary mr-2" @click="openNew" />
                            </div>
                        </template>
                    </Toolbar>

				<DataTable
					ref="dt"
					:value="colaboradores"
					v-model:selection="selectedColaboradores"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} colaboradores"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0"></h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3%"></Column>
					<Column field="nome" header="Nome" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ formatarString(slotProps.data.nome) }}
						</template>
					</Column>
					<Column field="cpf" header="CPF" :sortable="true" headerStyle="width:15%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">CPF</span>
							{{ slotProps.data.cpf }}
						</template>
					</Column>
					<Column field="dtNascimento" header="Data Nascimento" :sortable="true" headerStyle="width:15%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Data Nascimento</span>
                            {{ moment(slotProps.data.dataNascimento).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="email" header="E-mail" :sortable="true" headerStyle="width:15%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">E-mail</span>
							{{ slotProps.data.email }}
						</template>
					</Column>
					<!-- <Column field="prazo" header="Prazo" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<Rating :modelValue="slotProps.data.prazo" :readonly="true" :cancel="false" />
                            {{ slotProps.data.prazo }}
						</template>
					</Column>
					<Column field="conclusao" header="Conclusão" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Conclusão</span>
							<span :class="'colaborador-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column> -->
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="editarColaborador(slotProps.data)" />
							<!-- <Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarColaborador(slotProps.data)" /> -->
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarColaborador(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarColaborador(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="colaboradorDialog" :style="{ width: '500px' }" header="Novo Colaborador" :modal="true" class="p-fluid">
					<div class="field">
						<label for="nome">Nome</label>
						<InputText id="nome" v-model.trim="colaborador.nome" required="true" autofocus :class="{ 'p-invalid': submitted && !colaborador.nome }" />
						<small class="p-invalid" v-if="submitted && !colaborador.nome">Nome é obrigatório.</small>
					</div>
                    <div class="field">
						<label for="cpf">CPF</label>
						<InputText id="cpf" v-model.trim="colaborador.cpf" required="true" autofocus :class="{ 'p-invalid': submitted && !colaborador.cpf }" />
						<small class="p-invalid" v-if="submitted && !colaborador.cpf">CPF é obrigatório.</small>
					</div>
                    <div class="field">
						<label for="email">E-mail</label>
						<InputText id="email" type="email" v-model.trim="colaborador.email" required="true" autofocus :class="{ 'p-invalid': submitted && !colaborador.email }" />
						<small class="p-invalid" v-if="submitted && !colaborador.email">E-mail é obrigatório.</small>
					</div>
                    <div class="field" v-if="!colaborador.idColaborador">
						<label for="senha">Senha</label>
						<InputText id="senha" type="password" v-model.trim="colaborador.senha" required="true" autofocus :class="{ 'p-invalid': submitted && !colaborador.senha }" />
						<small class="p-invalid" v-if="submitted && !colaborador.email">Senha é obrigatória.</small>
					</div>
                    <div class="field">
                        <label for="departamento">Departamento</label>
                        <Dropdown id="departamento" v-model.number="colaborador.departamento" :options="departamentos" optionLabel="nome" optionValue="idDepartamento" placeholder="Escolha um Departamento" required="true" autofocus :class="{ 'p-invalid': submitted && !colaborador.departamento }"/>
                        <small class="p-invalid" v-if="submitted && !colaborador.departamento">Departamento é obrigatório.</small>
                    </div>
                    <div class="field">
                        <label for="perfil">Perfil</label>
                        <MultiSelect id="perfil" v-if="!colaborador.perfil" v-model="perfisSelecionados" :options="perfis" optionLabel="descricao" optionValue="idPerfil" placeholder="Selecione os perfis" :filter="true" :class="{ 'p-invalid': submitted && !perfisSelecionados }">
                        </MultiSelect>
                        <MultiSelect id="perfil" v-if="colaborador.perfil" v-model="perfisSelecionados.descricao" :options="perfis" optionLabel="descricao" optionValue="idPerfil" placeholder="Selecione os perfis" :filter="true" :class="{ 'p-invalid': submitted && !perfisSelecionados }">
                        </MultiSelect>
                        <small class="p-invalid" v-if="submitted && !perfisSelecionados">Perfil é obrigatório.</small>
                    </div>
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarColaborador" />
					</template>
				</Dialog>
				<Dialog v-model:visible="deleteColaboradorDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="colaborador"
							>Tem certeza que deseja excluir o colaborador "<b>{{ colaborador.nome }}</b>"?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteColaboradorDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarColaborador" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteColaboradoresDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="colaborador">Tem certeza que deseja excluir os colaboradores selecionados?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteColaboradoresDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deleteSelectedColaboradores" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
