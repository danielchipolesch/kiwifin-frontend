<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import AtendimentoService from '@/service/AtendimentoService';
import AssuntoService from '@/service/AssuntoService';
import { useToast } from 'primevue/usetoast';
import {jsPDF} from 'jspdf';

const toast = useToast();

const atendimentos = ref(null);
const atendimentoDialog = ref(false);
const deleteAtendimentoDialog = ref(false);
const deleteAtendimentosDialog = ref(false);
const atendimento = ref({});
const selectedAtendimentos = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
	{ label: 'INSTOCK', value: 'instock' },
	{ label: 'LOWSTOCK', value: 'lowstock' },
	{ label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const assuntoService = new AssuntoService();
const atendimentoService = new AtendimentoService();

const gerarPdf = (atendimento) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        
    });
    // doc.setFontSize(20);
    doc.addImage("layout/images/kiwifin-logo.png", 'PNG', 50, 15, null, null, null, 'NONE', 0 );
    doc.text(`Situação atual: ${atendimento.andamento}`, 20, 50, {align:"left"});
    doc.output("dataurlnewwindow", `${atendimento.protocolo}.pdf`);
}

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

const salvarAtendimento = () => {
	submitted.value = true;
    // && atendimento.value.assunto.trim()
	if (atendimento.value.assunto && atendimento.value.descricao) {
		if (atendimento.value.id) {
			atendimento.value.assunto = atendimento.value.assunto.value ? atendimento.value.assunto.value : atendimento.value.assunto;
			atendimento.value.descricao = atendimento.value.descricao.value ? atendimento.value.descricao.value : atendimento.value.descricao;
			atendimentos.value[findIndexById(atendimento.value.id)] = atendimento.value;
            console.log(atendimento.value)
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento atualizado', life: 3000 });
		} else {
			atendimento.value.id = createId();
			// atendimento.value.andamento = "Criado";
			atendimento.value.imagem = 'atendimento-placeholder.svg';
//			atendimento.value.conclusao = atendimento.value.conclusao ? atendimento.value.conclusao.value : 'INSTOCK';
			atendimento.value.descricao = atendimento.value.descricao ? atendimento.value.descricao.value : 'Genérico';
			atendimentos.value.push(atendimento.value);
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento criado', life: 3000 });
		}
		atendimentoDialog.value = false;
		atendimento.value = {};
	}
};

const editarAtendimento = (editarAtendimento) => {
	atendimento.value = { ...editarAtendimento };
	console.log(atendimento);
	atendimentoDialog.value = true;
};

const confirmaDeletarAtendimento = (editarAtendimento) => {
	atendimento.value = editarAtendimento;
	deleteAtendimentoDialog.value = true;
};

const deletarAtendimento = () => {
	atendimentos.value = atendimentos.value.filter((val) => val.id !== atendimento.value.id);
	deleteAtendimentoDialog.value = false;
	atendimento.value = {};
	toast.add({ severity: 'success', summary: 'Successful', detail: 'Atendimento Deleted', life: 3000 });
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
const deleteSelectedAtendimentos = () => {
	atendimentos.value = atendimentos.value.filter((val) => !selectedAtendimentos.value.includes(val));
	deleteAtendimentosDialog.value = false;
	selectedAtendimentos.value = null;
	toast.add({ severity: 'success', summary: 'Successful', detail: 'Atendimentos Deleted', life: 3000 });
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
							<Button label="Novo" icon="pi pi-plus" class="p-button-raised p-button-primary mr-2" @click="openNew" />
							<Button label="Excluir" icon="pi pi-trash" class="p-button-raised p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedAtendimentos || !selectedAtendimentos.length" />
						</div>
					</template>

					<!-- <template v-slot:end>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
					</template> -->
				</Toolbar>

				<DataTable
					ref="dt"
					:value="atendimentos"
					v-model:selection="selectedAtendimentos"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} atendimentos"
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
					<Column field="andamento" header="Andamento" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ slotProps.data.andamento }}
						</template>
					</Column>
					<Column field="assunto" header="Assunto" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Assunto</span>
							{{ slotProps.data.assunto }}
						</template>
					</Column>
					<!--<Column header="Image" headerStyle="width:14%; min-width:10rem;">-->
					<!--	<template #body="slotProps">-->
					<!--		<span class="p-column-title">Image</span>-->
					<!--		<img :src="'demo/images/atendimento/' + slotProps.data.imagem" :alt="slotProps.data.imagem" class="shadow-2" width="100" />-->
					<!--	</template>-->
					<!--</Column>-->
					<Column field="protocolo" header="Protocolo" :sortable="true" headerStyle="width:10%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Protocolo</span>
							<!-- {{ formatCurrency(slotProps.data.protocolo) }} -->
                            {{ slotProps.data.protocolo }}
						</template>
					</Column>
					<Column field="criacao" header="Criação" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Criação</span>
							{{ slotProps.data.criacao }}
						</template>
					</Column>
					<Column field="prazo" header="Prazo" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<!-- <Rating :modelValue="slotProps.data.prazo" :readonly="true" :cancel="false" /> -->
                            {{ slotProps.data.prazo }}
						</template>
					</Column>
					<Column field="conclusao" header="Conclusão" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Conclusão</span>
							<span :class="'atendimento-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column>
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="gerarPdf(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarAtendimento(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarAtendimento(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarAtendimento(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="atendimentoDialog" :style="{ width: '500px' }" header="Novo Atendimento" :modal="true" class="p-fluid">
					<img :src="'demo/images/atendimento/' + atendimento.imagem" :alt="atendimento.imagem" v-if="atendimento.imagem" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
					<div class="field">
						<label for="assunto">Assunto</label>
						<!-- <InputText id="assunto" v-model.trim="atendimento.assunto" required="true" autofocus :class="{ 'p-invalid': submitted && !atendimento.assunto }" /> -->
                        <Dropdown id="assunto" v-model="atendimento.assunto" :options="assuntos" optionLabel="name" placeholder="Select" :class="{ 'p-invalid': submitted && !atendimento.assunto }" required="true"/>
						<small class="p-invalid" v-if="submitted && !atendimento.assunto">Assunto is required.</small>
					</div>
					<div class="field">
						<label for="descricao">Descrição</label>
						<Textarea id="descricao" v-model="atendimento.descricao" required="true" rows="3" cols="20" />
					</div>				
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarAtendimento" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteAtendimentoDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="atendimento"
							>Tem certeza que deseja excluir o Atendimento n. <b>{{ atendimento.protocolo }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAtendimentoDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarAtendimento" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteAtendimentosDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="atendimento">Tem certeza que deseja excluir os atendimentos selecionados?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAtendimentosDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deleteSelectedAtendimentos" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
