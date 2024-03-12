<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import AtendimentoService from '@/service/AtendimentoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const atendimentos = ref(null);
const atendimentoDialog = ref(false);
const deleteAtendimentoDialog = ref(false);
const deleteAtendimentosDialog = ref(false);
const atendimento = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
	{ label: 'INSTOCK', value: 'instock' },
	{ label: 'LOWSTOCK', value: 'lowstock' },
	{ label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const atendimentoService = new AtendimentoService();

onBeforeMount(() => {
	initFilters();
});
onMounted(() => {
	atendimentoService.getAtendimentos().then((data) => (atendimentos.value = data));
});
const formatCurrency = (value) => {
	return value.toLocaleString('PT-BR', { style: 'currency', currency: 'BRL' });
};

const openNew = () => {
	atendimento.value = {};
	submitted.value = false;
	atendimentoDialog.value = true;
};

const hideDialog = () => {
	atendimentoDialog.value = false;
	submitted.value = false;
};

const saveProduct = () => {
	submitted.value = true;
	if (atendimento.value.assunto && atendimento.value.assunto.trim() && atendimento.value.protocolo) {
		if (atendimento.value.id) {
			atendimento.value.conclusao = atendimento.value.conclusao.value ? atendimento.value.conclusao.value : atendimento.value.conclusao;
			atendimentos.value[findIndexById(atendimento.value.id)] = atendimento.value;
			toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
		} else {
			atendimento.value.id = createId();
			atendimento.value.andamento = createId();
			atendimento.value.image = 'atendimento-placeholder.svg';
			atendimento.value.conclusao = atendimento.value.conclusao ? atendimento.value.conclusao.value : 'INSTOCK';
			atendimentos.value.push(atendimento.value);
			toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
		}
		atendimentoDialog.value = false;
		atendimento.value = {};
	}
};

const editProduct = (editProduct) => {
	atendimento.value = { ...editProduct };
	console.log(atendimento);
	atendimentoDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
	atendimento.value = editProduct;
	deleteAtendimentoDialog.value = true;
};

const deleteProduct = () => {
	atendimentos.value = atendimentos.value.filter((val) => val.id !== atendimento.value.id);
	deleteAtendimentoDialog.value = false;
	atendimento.value = {};
	toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < atendimentos.value.length; i++) {
		if (atendimentos.value[i].id === id) {
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
	deleteAtendimentosDialog.value = true;
};
const deleteSelectedProducts = () => {
	atendimentos.value = atendimentos.value.filter((val) => !selectedProducts.value.includes(val));
	deleteAtendimentosDialog.value = false;
	selectedProducts.value = null;
	toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
				<span class="text-black-alpha-90 text-3xl">Atendimentos</span>
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
							<Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
							<Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
						</div>
					</template>

					<template v-slot:end>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
					</template>
				</Toolbar>

				<DataTable
					ref="dt"
					:value="atendimentos"
					v-model:selection="selectedProducts"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} atendimentos"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manage Products</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Search..." />
							</span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="andamento" header="Andamento" :sortable="true" headerStyle="width:5%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Andamento</span>
							{{ slotProps.data.andamento }}
						</template>
					</Column>
					<Column field="assunto" header="Assunto" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Assunto</span>
							{{ slotProps.data.assunto }}
						</template>
					</Column>
					<!--<Column header="Image" headerStyle="width:14%; min-width:10rem;">-->
					<!--	<template #body="slotProps">-->
					<!--		<span class="p-column-title">Image</span>-->
					<!--		<img :src="'demo/images/atendimento/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />-->
					<!--	</template>-->
					<!--</Column>-->
					<Column field="protocolo" header="Protocolo" :sortable="true" headerStyle="width:10%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Protocolo</span>
							{{ formatCurrency(slotProps.data.protocolo) }}
						</template>
					</Column>
					<Column field="criacao" header="Criação" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Criação</span>
							{{ slotProps.data.criacao }}
						</template>
					</Column>
					<Column field="prazo" header="Prazo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<Rating :modelValue="slotProps.data.prazo" :readonly="true" :cancel="false" />
						</template>
					</Column>
					<Column field="conclusao" header="Conclusão" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Conclusão</span>
							<span :class="'atendimento-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column>
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="atendimentoDialog" :style="{ width: '500px' }" header="Novo Atendimento" :modal="true" class="p-fluid">
					<img :src="'demo/images/atendimento/' + atendimento.image" :alt="atendimento.image" v-if="atendimento.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
					<div class="field">
						<label for="assunto">Assunto</label>
						<InputText id="assunto" v-model.trim="atendimento.assunto" required="true" autofocus :class="{ 'p-invalid': submitted && !atendimento.assunto }" />
						<small class="p-invalid" v-if="submitted && !atendimento.assunto">Assunto is required.</small>
					</div>
					<div class="field">
						<label for="description">Description</label>
						<Textarea id="description" v-model="atendimento.description" required="true" rows="3" cols="20" />
					</div>

					<div class="field">
						<label for="conclusao" class="mb-3">Inventory Conclusão</label>
						<Dropdown id="conclusao" v-model="atendimento.conclusao" :options="statuses" optionLabel="label" placeholder="Select a Conclusão">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'atendimento-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'atendimento-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
								</div>
								<span v-else>
									{{ slotProps.placeholder }}
								</span>
							</template>
						</Dropdown>
					</div>

					<div class="field">
						<label class="mb-3">Criação</label>
						<div class="formgrid grid">
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao1" assunto="criacao" value="Accessories" v-model="atendimento.criacao" />
								<label for="criacao1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao2" assunto="criacao" value="Clothing" v-model="atendimento.criacao" />
								<label for="criacao2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao3" assunto="criacao" value="Electronics" v-model="atendimento.criacao" />
								<label for="criacao3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao4" assunto="criacao" value="Fitness" v-model="atendimento.criacao" />
								<label for="criacao4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="protocolo">Protocolo</label>
							<InputNumber id="protocolo" v-model="atendimento.protocolo" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !atendimento.protocolo }" :required="true" />
							<small class="p-invalid" v-if="submitted && !atendimento.protocolo">Protocolo is required.</small>
						</div>
						<div class="field col">
							<label for="quantity">Quantity</label>
							<InputNumber id="quantity" v-model="atendimento.quantity" integeronly />
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteAtendimentoDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="atendimento"
							>Are you sure you want to delete <b>{{ atendimento.assunto }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAtendimentoDialog = false" />
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteAtendimentosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="atendimento">Are you sure you want to delete the selected atendimentos?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAtendimentosDialog = false" />
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
