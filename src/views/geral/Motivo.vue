<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import MotivoService from '@/service/MotivoService';
import DepartamentoService from '@/service/DepartamentoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const motivos = ref(null);
const motivoDialog = ref(false);
const deleteMotivoDialog = ref(false);
const motivo = ref(null);
const departamento = ref(null);
const departamentos = ref([]);
const selectedMotivos = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sliderValue = ref(30);

const motivoService = new MotivoService();
const departamentoService = new DepartamentoService();

const buscarMotivos = () => {
	motivoService.buscarMotivos().then((data) => (motivos.value = data));
};

const buscarDepartamentos = () => {
	departamentoService.buscarDepartamentos().then((data) => (departamentos.value = data));
};

onBeforeMount(() => {
	initFilters();
});

onMounted(() => {
	buscarMotivos();
	buscarDepartamentos();
});

const openNew = () => {
	motivo.value = {};
	submitted.value = false;
	motivoDialog.value = true;
};

const hideDialog = () => {
	motivoDialog.value = false;
	submitted.value = false;
};

const salvarMotivo = () => {
	submitted.value = true;
	if (motivo.value.nome && motivo.value.prazo && motivo.value.departamento && motivo.value.status) {
		if (motivo.value.idMotivo) {
			motivo.value.nome = motivo.value.nome.value ? motivo.value.nome.value : motivo.value.nome;
			motivo.value.prazo = motivo.value.prazo.value ? motivo.value.prazo.value : motivo.value.prazo;
			motivo.value.status = motivo.value.status.value ? motivo.value.status.value : motivo.value.status;
			motivo.value.departamento = motivo.value.departamento.idDepartamento ? motivo.value.departamento.idDepartamento : motivo.value.departamento;
			motivos.value[findIndexById(motivo.value.idMotivo)] = motivo.value;
			motivoService
				.atualizarMotivo(motivo.value)
				.then(() => buscarMotivos())
				.then((res) => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo editado', life: 3000 }))
				.catch((err) => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }));
		} else {
			console.log(motivo.value.departamento);
			motivoService
				.criarMotivo(motivo.value)
				.then(() => buscarMotivos())
				.then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo criado', life: 3000 }))
				.catch((err) => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }));
			motivos.value.push(motivo.value);
		}
		motivoDialog.value = false;
		motivo.value = {};
	}
};

const editarMotivo = (editarMotivo) => {
	// console.log(motivo.value.departamento)
	motivo.value = { ...editarMotivo };
	motivo.value.departamento = motivo.value.departamento.idDepartamento;
	// departamento.value = {...editarMotivo.departamento}
	console.log(motivo.value.departamento.idDepartamento);

	motivoDialog.value = true;
};

const confirmaDeletarMotivo = (deletarMotivo) => {
	motivo.value = deletarMotivo;
	deleteMotivoDialog.value = true;
};

const deletarMotivo = () => {
	motivos.value = motivos.value.filter((val) => val.idMotivo !== motivo.value.idMotivo);
	motivoService
		.deletarMotivo(motivo.value.idMotivo)
		.then(() => buscarMotivos())
		.then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo Excluído', life: 3000 }));
	deleteMotivoDialog.value = false;
	motivo.value = {};
};

const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < motivos.value.length; i++) {
		if (motivos.value[i].id === id) {
			index = i;
			break;
		}
	}
	return index;
};

const createId = () => {
	let id = '';
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 5; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
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
				<span class="text-black-alpha-90 text-3xl">Motivos</span>
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
					:value="motivos"
					v-model:selection="selectedMotivos"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} motivos"
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
					<Column field="nome" header="Nome" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Nome</span>
							{{ slotProps.data.nome }}
						</template>
					</Column>
					<Column field="departamentoRelacionado" header="Departamento Relacionado" :sortable="true" headerStyle="width:20%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Departamento Relacionado</span>
							{{ slotProps.data.departamento.nome }}
						</template>
					</Column>
					<Column header="Prazo" headerStyle="width:12%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Prazo</span>
							{{ slotProps.data.prazo }} dias
						</template>
					</Column>
					<Column field="status" header="Status" :sortable="true" headerStyle="width:12%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							<Tag class="mr-2" v-if="slotProps.data.status" icon="pi pi-check" severity="primary" value="Ativo"></Tag>
							<Tag class="mr-2" v-if="!slotProps.data.status" icon="pi pi-times" severity="danger" value="Inativo"></Tag>
						</template>
					</Column>
					<Column headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarMotivo(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarMotivo(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="motivoDialog" :style="{ width: '500px' }" header="Novo Motivo" :modal="true" class="p-fluid">
					<div class="field">
						<label for="nome">Nome</label>
						<InputText id="nome" v-model.trim="motivo.nome" required="true" autofocus :class="{ 'p-invalid': submitted && !motivo.nome }" />
						<small class="p-invalid" v-if="submitted && !motivo.nome">Nome é obrigatório.</small>
					</div>
					<div class="field">
						<h6 for="status">Status</h6>
						<InputSwitch id="status" v-model="motivo.status" required="true" autofocus :class="{ 'p-invalid': submitted && !motivo.status }" />
						<small class="p-invalid" v-if="submitted && !motivo.status">Status é obrigatório.</small>
					</div>
					<div class="field">
						<label for="prazo">Prazo (em dias)</label>
						<InputText id="prazo" type="number" min="0" v-model.number="motivo.prazo" required="true" autofocus :class="{ 'p-invalid': submitted && !motivo.prazo }" />
						<small class="p-invalid" v-if="submitted && !motivo.prazo">Prazo é obrigatório.</small>
					</div>
					<div class="field">
						<label for="dpt">Departamento</label>

						<Dropdown
							id="dpt"
							v-if="motivo.departamento !== {}"
							v-model="motivo.departamento"
							:options="departamentos"
							optionLabel="nome"
							optionValue="idDepartamento"
							placeholder="Escolha um Departamento"
							required="true"
							autofocus
							:class="{ 'p-invalid': submitted && !motivo.departamento }" />

						<Dropdown
							id="dpt"
							v-else
							v-model="motivo.departamento.idDepartamento"
							:options="departamentos"
							optionLabel="nome"
							optionValue="idDepartamento"
							placeholder="Escolha um Departamento"
							required="true"
							autofocus
							:class="{ 'p-invalid': submitted && !motivo.departamento }" />

						<!-- <Dropdown id="dpt" v-model="motivo.departamento" :options="departamentos" optionLabel="nome" placeholder="Select" /> -->
						<small class="p-invalid" v-if="submitted && !motivo.departamento">Departamento é obrigatório.</small>
					</div>
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarMotivo" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteMotivoDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="motivo"
							>Tem certeza que deseja excluir o motivo "<b>{{ motivo.nome }}</b
							>"?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteMotivoDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarMotivo" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
