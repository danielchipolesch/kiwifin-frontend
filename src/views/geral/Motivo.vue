<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import MotivoService from '@/service/MotivoService';
import AssuntoService from '@/service/AssuntoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const motivos = ref(null);
const motivoDialog = ref(false);
const deleteMotivoDialog = ref(false);
const deleteMotivosDialog = ref(false);
const motivo = ref({});
const selectedMotivos = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
	{ label: 'INSTOCK', value: 'instock' },
	{ label: 'LOWSTOCK', value: 'lowstock' },
	{ label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const descricaoService = new AssuntoService();
const motivoService = new MotivoService();

onBeforeMount(() => {
	initFilters();
});
onMounted(() => {
	motivoService.getMotivos().then((data) => (motivos.value = data));
});
const formatCurrency = (value) => {
	return value.toLocaleString('PT-BR', { style: 'currency', currency: 'BRL' });
};

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
    // && motivo.value.descricao.trim()
	if (motivo.value.descricao && motivo.value.descricao) {
		if (motivo.value.id) {
			motivo.value.descricao = motivo.value.descricao.value ? motivo.value.descricao.value : motivo.value.descricao;
			motivo.value.descricao = motivo.value.descricao.value ? motivo.value.descricao.value : motivo.value.descricao;
			motivos.value[findIndexById(motivo.value.id)] = motivo.value;
            console.log(motivo.value)
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo atualizado', life: 3000 });
		} else {
			motivo.value.id = createId();
			// motivo.value.nome = "Criado";
			motivo.value.imagem = 'motivo-placeholder.svg';
//			motivo.value.conclusao = motivo.value.conclusao ? motivo.value.conclusao.value : 'INSTOCK';
			motivo.value.descricao = motivo.value.descricao ? motivo.value.descricao.value : 'Genérico';
			motivos.value.push(motivo.value);
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo criado', life: 3000 });
		}
		motivoDialog.value = false;
		motivo.value = {};
	}
};

const editarMotivo = (editarMotivo) => {
	motivo.value = { ...editarMotivo };
	console.log(motivo);
	motivoDialog.value = true;
};

const confirmaDeletarMotivo = (editarMotivo) => {
	motivo.value = editarMotivo;
	deleteMotivoDialog.value = true;
};

const deletarMotivo = () => {
	motivos.value = motivos.value.filter((val) => val.id !== motivo.value.id);
	deleteMotivoDialog.value = false;
	motivo.value = {};
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivo Excluído', life: 3000 });
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

const exportCSV = () => {
	dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
	deleteMotivosDialog.value = true;
};
const deleteSelectedMotivos = () => {
	motivos.value = motivos.value.filter((val) => !selectedMotivos.value.includes(val));
	deleteMotivosDialog.value = false;
	selectedMotivos.value = null;
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Motivos Excluídos', life: 3000 });
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
							<!-- <Button label="Novo" icon="pi pi-plus" class="p-button-raised p-button-primary mr-2" @click="openNew" /> -->
							<Button label="Excluir" icon="pi pi-trash" class="p-button-raised p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedMotivos || !selectedMotivos.length" />
						</div>
					</template>

					 <template v-slot:end>
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
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

					<Column selectionMode="multiple" headerStyle="width: 3%"></Column>
					<Column field="nome" header="Nome" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ slotProps.data.nome }}
						</template>
					</Column>
					<Column field="descricao" header="Descrição" :sortable="true" headerStyle="width:60%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Descrição</span>
							{{ slotProps.data.descricao }}
						</template>
					</Column>
					<!--<Column header="Image" headerStyle="width:14%; min-width:10rem;">-->
					<!--	<template #body="slotProps">-->
					<!--		<span class="p-column-title">Image</span>-->
					<!--		<img :src="'demo/images/motivo/' + slotProps.data.imagem" :alt="slotProps.data.imagem" class="shadow-2" width="100" />-->
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
							<span :class="'motivo-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column> -->
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="editarMotivo(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarMotivo(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarMotivo(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarMotivo(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="motivoDialog" :style="{ width: '500px' }" header="Novo Motivo" :modal="true" class="p-fluid">
					<img :src="'demo/images/motivo/' + motivo.imagem" :alt="motivo.imagem" v-if="motivo.imagem" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
					<div class="field">
						<label for="descricao">Descrição</label>
						<!-- <InputText id="descricao" v-model.trim="motivo.descricao" required="true" autofocus :class="{ 'p-invalid': submitted && !motivo.descricao }" /> -->
                        <Dropdown id="descricao" v-model="motivo.descricao" :options="descricaos" optionLabel="name" placeholder="Select" :class="{ 'p-invalid': submitted && !motivo.descricao }" required="true"/>
						<small class="p-invalid" v-if="submitted && !motivo.descricao">Descrição is required.</small>
					</div>
                    <!-- <div class="field">
                        <Dropdown v-model="motivo.descricao2" :options="descricao2s" optionLabel="name" placeholder="Select" required="true"/>
                    </div> -->
					<div class="field">
						<label for="descricao">Descrição</label>
						<Textarea id="descricao" v-model="motivo.descricao" required="true" rows="3" cols="20" />
					</div>

					<!-- <div class="field">
						<label for="conclusao" class="mb-3">Inventory Conclusão</label>
						<Dropdown id="conclusao" v-model="motivo.conclusao" :options="statuses" optionLabel="label" placeholder="Select a Conclusão">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'motivo-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'motivo-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
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
								<RadioButton id="email1" descricao="email" value="Accessories" v-model="motivo.email" />
								<label for="email1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email2" descricao="email" value="Clothing" v-model="motivo.email" />
								<label for="email2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email3" descricao="email" value="Electronics" v-model="motivo.email" />
								<label for="email3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email4" descricao="email" value="Fitness" v-model="motivo.email" />
								<label for="email4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="dtNascimento">Data Nascimento</label>
							<InputNumber id="dtNascimento" v-model="motivo.dtNascimento" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !motivo.dtNascimento }" :required="true" />
							<small class="p-invalid" v-if="submitted && !motivo.dtNascimento">Data Nascimento is required.</small>
						</div>
						<div class="field col">
							<label for="quantidade">Quantity</label>
							<InputNumber id="quantidade" v-model="motivo.quantidade" integeronly />
						</div>
					</div> -->
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarMotivo" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteMotivoDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="motivo"
							>Tem certeza que deseja excluir o Motivo n. <b>{{ motivo.dtNascimento }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteMotivoDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarMotivo" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteMotivosDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="motivo">Tem certeza que deseja excluir os motivos selecionados?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteMotivosDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deleteSelectedMotivos" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>