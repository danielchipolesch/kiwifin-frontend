<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import DepartamentoService from '@/service/DepartamentoService';
import AssuntoService from '@/service/AssuntoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const departamentos = ref(null);
const departamentoDialog = ref(false);
const deleteDepartamentoDialog = ref(false);
const deleteDepartamentosDialog = ref(false);
const departamento = ref({});
const selectedDepartamentos = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const descricaoService = new AssuntoService();
const departamentoService = new DepartamentoService();

const nomeDepartamento = ref(null)

onBeforeMount(() => {
	initFilters();
});

onMounted(() => {
	departamentoService.getDepartamentos()
    .then((data) => (departamentos.value = data));
});

const openNew = () => {
	departamento.value = {};
	submitted.value = false;
	departamentoDialog.value = true;
};

const hideDialog = () => {
	departamentoDialog.value = false;
	submitted.value = false;
};

const salvarDepartamento = () => {
	submitted.value = true;
    // && departamento.value.descricao.trim()
    console.log(departamento.value.status.value)
	if (departamento.value.nome && departamento.value.status) {
		if (departamento.value.id) {
			departamento.value.nome = departamento.value.nome.value ? departamento.value.nome.value : departamento.value.nome;
			departamento.value.status = departamento.value.status.value ? departamento.value.status.value : departamento.value.status;
			departamentos.value[findIndexById(departamento.value.id)] = departamento.value;
            console.log(departamento.value)
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento atualizado', life: 3000 });
		} else {
			// departamento.value.id = createId();
			// departamento.value.nome = "Criado";
			// departamento.value.nome = departamento.value.nome ? departamento.value.nome.value : 'Teste';
            // departamento.value.status = departamento.value.status ? departamento.value.status.value : true;
            departamentoService.createDepartamento(departamento.value)
            console.log(departamento.value)
			departamentos.value.push(departamento.value);
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento criado', life: 3000 });
		}
		departamentoDialog.value = false;
		departamento.value = {};
	}
};

const editarDepartamento = (editarDepartamento) => {
	departamento.value = { ...editarDepartamento };
	console.log(departamento);
	departamentoDialog.value = true;
};

const confirmaDeletarDepartamento = (editarDepartamento) => {
	departamento.value = editarDepartamento;
	deleteDepartamentoDialog.value = true;
};

const deletarDepartamento = () => {
	departamentos.value = departamentos.value.filter((val) => val.id !== departamento.value.id);
	deleteDepartamentoDialog.value = false;
	departamento.value = {};
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento Excluído', life: 3000 });
};


const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < departamentos.value.length; i++) {
		if (departamentos.value[i].id === id) {
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

const exportCSV = () => {
	dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
	deleteDepartamentosDialog.value = true;
};
const deleteSelectedDepartamentos = () => {
	departamentos.value = departamentos.value.filter((val) => !selectedDepartamentos.value.includes(val));
	deleteDepartamentosDialog.value = false;
	selectedDepartamentos.value = null;
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamentos Excluídos', life: 3000 });
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
				<span class="text-black-alpha-90 text-3xl">Departamentos</span>
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
							<Button label="Excluir" icon="pi pi-trash" class="p-button-raised p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDepartamentos || !selectedDepartamentos.length" />
						</div>
					</template>

					 <template v-slot:end>
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
					</template> 
				</Toolbar>

				<DataTable
					ref="dt"
					:value="departamentos"
					v-model:selection="selectedDepartamentos"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Departamentos"
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
					<Column field="nome" header="Nome" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ slotProps.data.nome }}
						</template>
					</Column>
					<Column field="status" header="Status" :sortable="true" headerStyle="width:60%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ slotProps.data.status }}
						</template>
					</Column>
					<!--<Column header="Image" headerStyle="width:14%; min-width:10rem;">-->
					<!--	<template #body="slotProps">-->
					<!--		<span class="p-column-title">Image</span>-->
					<!--		<img :src="'demo/images/departamento/' + slotProps.data.imagem" :alt="slotProps.data.imagem" class="shadow-2" width="100" />-->
					<!--	</template>-->
					<!--</Column>-->
					<!-- <Column field="dtNascimento" header="Data Nascimento" :sortable="true" headerStyle="width:15%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Data Nascimento</span>
							{{ formatCurrency(slotProps.data.dtNascimento) }}
                            {{ slotProps.data.dtNascimento }}
						</template>
					</Column>
					<Column field="email" header="E-mail" :sortable="true" headerStyle="width:15%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">E-mail</span>
							{{ slotProps.data.email }}
						</template>
					</Column> -->
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
							<span :class="'departamento-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column> -->
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="editarDepartamento(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarDepartamento(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarDepartamento(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarDepartamento(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="departamentoDialog" :style="{ width: '500px' }" header="Novo Departamento" :modal="true" class="p-fluid">
					<!-- <img :src="'demo/images/departamento/' + departamento.imagem" :alt="departamento.imagem" v-if="departamento.imagem" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
					<div class="field">
						<label for="nome">Nome</label>
						<InputText id="nome" v-model.trim="departamento.nome" required="true" autofocus :class="{ 'p-invalid': submitted && !departamento.nome }" />
                        <!-- <Dropdown id="descricao" v-model="departamento.descricao" :options="descricaos" optionLabel="name" placeholder="Select" :class="{ 'p-invalid': submitted && !departamento.descricao }" required="true"/> -->
						<small class="p-invalid" v-if="submitted && !departamento.descricao">Nome é obrigatório.</small>
					</div>
                    <!-- <div class="field">
                        <Dropdown v-model="departamento.descricao2" :options="descricao2s" optionLabel="name" placeholder="Select" required="true"/>
                    </div> -->
                    <br>
					<div class="field">
						<h6 for="status">Status</h6>
                        <InputSwitch id="status" v-model="departamento.status" required="true" autofocus :class="{ 'p-invalid': submitted && !departamento.status }"/>
						<!-- <Textarea id="status" v-model="departamento.status" required="true" rows="3" cols="20" /> -->
					</div>

					<!-- <div class="field">
						<label for="conclusao" class="mb-3">Inventory Conclusão</label>
						<Dropdown id="conclusao" v-model="departamento.conclusao" :options="statuses" optionLabel="label" placeholder="Select a Conclusão">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'departamento-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'departamento-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
								</div>
								<span v-else>
									{{ slotProps.placeholder }}
								</span>
							</template>
						</Dropdown>
					</div>

					<div class="field">
						<label class="mb-3">E-mail</label>
						<div class="formgrid grid">
							<div class="field-radiobutton col-6">
								<RadioButton id="email1" descricao="email" value="Accessories" v-model="departamento.email" />
								<label for="email1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email2" descricao="email" value="Clothing" v-model="departamento.email" />
								<label for="email2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email3" descricao="email" value="Electronics" v-model="departamento.email" />
								<label for="email3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email4" descricao="email" value="Fitness" v-model="departamento.email" />
								<label for="email4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="dtNascimento">Data Nascimento</label>
							<InputNumber id="dtNascimento" v-model="departamento.dtNascimento" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !departamento.dtNascimento }" :required="true" />
							<small class="p-invalid" v-if="submitted && !departamento.dtNascimento">Data Nascimento is required.</small>
						</div>
						<div class="field col">
							<label for="quantidade">Quantity</label>
							<InputNumber id="quantidade" v-model="departamento.quantidade" integeronly />
						</div>
					</div> -->
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarDepartamento" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteDepartamentoDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="departamento"
							>Tem certeza que deseja excluir o Departamento n. <b>{{ departamento.dtNascimento }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDepartamentoDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarDepartamento" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteDepartamentosDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="departamento">Tem certeza que deseja excluir os departamentos selecionados?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDepartamentosDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deleteSelectedDepartamentos" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>