<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import AtendimentoService from '@/service/AtendimentoService';
import MotivoService from '@/service/MotivoService';
import AssuntoService from '@/service/AssuntoService';
import { useToast } from 'primevue/usetoast';
import { jsPDF } from 'jspdf';
import VueJwtDecode from 'vue-jwt-decode';

const toast = useToast();

const atendimentos = ref(null);
const motivos = ref(null);
const atendimentoDialog = ref(false);
const assumirAtendimentoDialog = ref(false);
const deleteAtendimentoDialog = ref(false);
const deleteAtendimentosDialog = ref(false);
const atendimento = ref(null);
const atendimentoEspecifico = ref({});
const detalhamentoEmpresaEspecifico = ref(null);
const motivo = ref({});
const selectedAtendimentos = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const perfil = localStorage.getItem('perfil');
const token = localStorage.getItem('token');
const decodedToken = VueJwtDecode.decode(token);

// const decodedToken = await VueJwtDecode.decode(token);
// localStorage.setItem('isAuthenticated', false);
// localStorage.setItem(decodedToken.perfil, false);

const motivoService = new MotivoService();
const atendimentoService = new AtendimentoService();

const gerarPdf = (atendimento) => {
	const doc = new jsPDF({
		orientation: 'p',
		unit: 'mm',
		format: 'a4'
	});
	// doc.setFontSize(20);
	doc.addImage('layout/images/kiwifin-logo.png', 'PNG', 50, 15, null, null, null, 'NONE', 0);
	doc.text(`Situação atual: ${atendimento.andamento}`, 20, 50, { align: 'left' });
	doc.output('dataurlnewwindow', `${atendimento.protocolo}.pdf`);
};

const buscarAtendimentos = () => {
	if (perfil === 'CLIENTE') {
		const idCli = localStorage.getItem('idCliente');
		atendimentoService.buscarAtendimentosPorCliente(idCli).then((data) => (atendimentos.value = data));
	}
	if (perfil !== 'CLIENTE') {
		atendimentoService.buscarAtendimentos().then((data) => (atendimentos.value = data));
	}
};

const buscarMotivos = () => {
	motivoService.buscarMotivos().then((data) => (motivos.value = data));
};

onBeforeMount(() => {
	initFilters();
});

onMounted(() => {
	buscarAtendimentos();
	buscarMotivos();
	// console.log(atendimentos.value);
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
	if (atendimento.value.assunto && atendimento.value.detalhamentoSolicitacao) {
		if (atendimento.value.idAtendimento) {
			if ((atendimento.value.detalhamentoEmpresa && perfil === 'ATENDENTE') || perfil === 'SUPERVISOR_QUALIDADE') {
				detalhamentoEmpresa.value = { idAtendimento: atendimento.value.idAtendimento, atendente: idColaborador };
			} else if (!atendimento.value.detalhamentoEmpresa) {
				atendimento.value.assunto = atendimento.value.assunto.value ? atendimento.value.assunto.value : atendimento.value.assunto;
				atendimento.value.detalhamentoSolicitacao = atendimento.value.detalhamentoSolicitacao.value ? atendimento.value.detalhamentoSolicitacao.value : atendimento.value.detalhamentoSolicitacao;
				atendimentos.value[findIndexById(atendimento.value.idAtendimento)] = atendimento.value;
				console.log(atendimento.value);
				toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento atualizado', life: 3000 });
			}
		} else {
			atendimento.value.cliente = localStorage.getItem('idCliente');
			atendimentoService
				.criarAtendimento(atendimento.value)
				.then(() => buscarAtendimentos())
				.then(() => toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento criado', life: 3000 }))
				.catch((err) => toast.add({ severity: 'error', summary: 'Erro', detail: err.message, life: 3000 }));
		}
		atendimentoDialog.value = false;
		atendimento.value = {};
	}
};

const editarAtendimento = (editarAtendimento) => {
	atendimento.value = { ...editarAtendimento };
	console.log(atendimento.motivo);
	atendimentoDialog.value = true;
};

const confirmAssumirAtendimento = (assumirAtendimento) => {
	atendimento.value = assumirAtendimento;
	// console.log(atendimento.value);
	assumirAtendimentoDialog.value = true;
};

const assumirAtendimento = async () => {
	if (perfil === 'ATENDENTE') {
		const idColaborador = decodedToken.id;
		atendimentoEspecifico.value = { idAtendimento: atendimento.value.idAtendimento, atendente: idColaborador };
		console.log(atendimentoEspecifico.value);
		console.log(atendimento.value.atendente);
		await atendimentoService.assumirAtendimento(atendimentoEspecifico.value);
		buscarAtendimentos();
		toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento assumido', life: 3000 });
	}
	assumirAtendimentoDialog.value = false;
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
							<Button label="Novo" v-if="perfil === 'CLIENTE'" icon="pi pi-plus" class="p-button-raised p-button-primary mr-2" @click="openNew" />
							<!-- <Button label="Excluir" icon="pi pi-trash" class="p-button-raised p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedAtendimentos || !selectedAtendimentos.length" /> -->
						</div>
					</template>

					<template v-slot:end>
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
						<Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
					</template>
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
					<!-- <Column selectionMode="multiple" headerStyle="width: 3%"></Column> -->
					<Column field="andamento" header="Andamento" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							{{ slotProps.data.statusAndamento }}
						</template>
					</Column>
					<Column field="assunto" header="Assunto" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Assunto</span>
							{{ slotProps.data.assunto }}
						</template>
					</Column>
					<Column field="motivo" header="Motivo" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Motivo</span>
							{{ slotProps.data.motivo.nome }}
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
					<Column field="prazo" header="Prazo" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Prazo</span>
							<!-- <Rating :modelValue="slotProps.data.prazo" :readonly="true" :cancel="false" /> -->
							{{ slotProps.data.prazo }}
						</template>
					</Column>
					<Column field="conclusao" header="Conclusão" :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Conclusão</span>
							<Tag class="mr-2" v-if="slotProps.data.conclusao === 'Concluído'" icon="pi pi-check" severity="primary" :value="slotProps.data.conclusao"></Tag>
							<Tag class="mr-2" v-if="slotProps.data.conclusao === 'Não Concluído'" icon="pi pi-times" severity="warning" :value="slotProps.data.conclusao"></Tag>
						</template>
					</Column>
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="gerarPdf(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarAtendimento(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarAtendimento(slotProps.data)" />
							<Button
								icon="pi pi-user"
								class="p-button-rounded p-button-raised p-button-help mr-2"
								v-if="perfil.includes('ATENDENTE') || (perfil.includes('SUPERVISOR_QUALIDADE') && atendimento.atendente !== null)"
								@click="confirmAssumirAtendimento(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarAtendimento(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="atendimentoDialog" :style="{ width: '500px' }" header="Atendimento" :modal="true" class="p-fluid">
					<div class="field">
						<label for="assunto">Assunto</label>
						<InputText id="assunto" v-model.trim="atendimento.assunto" required="true" autofocus :disabled="perfil !== 'CLIENTE' || atendimento.idAtendimento === null" :class="{ 'p-invalid': submitted && !atendimento.assunto }" />
						<small class="p-invalid" v-if="submitted && !atendimento.assunto">Assunto é obrigatório.</small>
					</div>
					<div class="field">
						<label for="motivo">Motivo</label>
						<!-- <Dropdown
							id="motivo"
							:options="motivos"
							optionLabel="nome"
							optionValue="idMotivo"
							placeholder="Selecione um motivo para o atendimento"
							:class="{ 'p-invalid': submitted && !atendimento.motivo }"
							required="true"
							v-if="!atendimento.motivo" /> -->
						<Dropdown
							id="dpt"
							v-model="atendimento.motivo"
							:value="atendimento.idMotivo"
							:options="motivos"
							optionLabel="nome"
							optionValue="idMotivo"
							placeholder="Escolha um Departamento"
							required="true"
							:disabled="perfil !== 'CLIENTE' || atendimento.idAtendimento === null"
							autofocus
							:class="{ 'p-invalid': submitted && !atendimento.motivo }" />

						<!-- <Dropdown
							id="dpt"
							v-else
							v-model="motivo.departamento.idDepartamento"
							:options="departamentos"
							optionLabel="nome"
							optionValue="idMotivo"
							placeholder="Escolha um Departamento"
							required="true"
							autofocus
							:class="{ 'p-invalid': submitted && !atendimento.motivo }" />
						<small class="p-invalid" v-if="submitted && !atendimento.motivo">Motivo é obrigatório.</small> -->
						<!-- <InputText type="text" id="assunto" v-model="atendimento.motivo.nome" :disabled="perfil !== 'CLIENTE'" v-if="atendimento.motivo" /> -->
					</div>
					<div class="field">
						<label for="descricao">Detalhamento da Solicitação</label>
						<Textarea
							id="descricao"
							v-model="atendimento.detalhamentoSolicitacao"
							required="true"
							rows="3"
							cols="20"
							:disabled="perfil !== 'CLIENTE' || atendimento.idAtendimento === null"
							:class="{ 'p-invalid': submitted && !atendimento.detalhamentoSolicitacao }" />
						<small class="p-invalid" v-if="submitted && !atendimento.detalhamentoSolicitacao">Descrição é obrigatória.</small>
					</div>
					<div class="field" v-if="atendimento.idAtendimento">
						<label for="detalhamentoEmpresa">Detalhamento da Empresa</label>
						<Textarea
							id="detalhamentoEmpresa"
							v-model="atendimento.detalhamentoEmpresa"
							required="false"
							rows="3"
							cols="20"
							:disabled="!atendimento.atendente || perfil === 'CLIENTE' || perfil === 'ADMINISTRADOR'"
							:class="{ 'p-invalid': submitted && !atendimento.detalhamentoEmpresa }" />
						<small class="p-invalid" v-if="submitted && !atendimento.detalhamentoEmpresa">Descrição é obrigatória.</small>
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
				<Dialog v-model:visible="assumirAtendimentoDialog" :style="{ width: '450px' }" header="Confirmação" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-thumbs-up mr-3" style="font-size: 2rem" />
						<span v-if="atendimento"
							>Tem certeza que deseja assumir o atendimento "<b>{{ atendimento.protocolo }}</b
							>"</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="assumirAtendimentoDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-success" @click="assumirAtendimento" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
