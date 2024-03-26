<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ClienteService from '@/service/ClienteService';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
import {jsPDF} from 'jspdf';

const toast = useToast();

const clientes = ref(null);
const clienteDialog = ref(false);
const deleteClienteDialog = ref(false);
const deleteClientesDialog = ref(false);
const cliente = ref({});
const selectedClientes = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);


const clienteService = new ClienteService();

const gerarPdf = (cliente) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        
    });
    // doc.setFontSize(20);
    doc.addImage("layout/images/kiwifin-logo.png", 'PNG', 50, 15, null, null, null, 'NONE', 0 );
    doc.text(`Nome: ${cliente.nome}`, 20, 50, {align:"left"});
    doc.output("dataurlnewwindow", `${cliente.nome}.pdf`);
}

onBeforeMount(() => {
	initFilters();
});

onMounted(() => {
	clienteService.buscarClientes().then((data) => (clientes.value = data));
});

// const formatarMoeda = (value) => {
// 	return value.toLocaleString('PT-BR', { style: 'currency', currency: 'BRL' });
// };

const formatarString = (value) => {
	return value.toUpperCase();
};

const formatarData = (data) => {
    data2 = new Date(data)
    return data2.toLocaleDateString("pt-BR", {timeZone: 'UTC'})
}

const openNew = () => {
	cliente.value = {};
	submitted.value = false;
	clienteDialog.value = true;
};

const hideDialog = () => {
	clienteDialog.value = false;
	submitted.value = false;
};

const salvarCliente = () => {
	submitted.value = true;
	if (cliente.value.nome && cliente.value.cpf) {
		if (cliente.value.idCliente) {
			cliente.value.cpf = cliente.value.cpf.value ? cliente.value.cpf.value : cliente.value.cpf;
			cliente.value.descricao = cliente.value.descricao.value ? cliente.value.descricao.value : cliente.value.descricao;
			clientes.value[findIndexById(cliente.value.id)] = cliente.value;
            console.log(cliente.value)
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado', life: 3000 });
            clienteDialog.value = false;
		    cliente.value = {};
		}
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Preenche todos os dados', life: 3000 });
	}
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Preenche todos os dados', life: 3000 });
};

const editarCliente = (editarCliente) => {
	cliente.value = { ...editarCliente };
	console.log(cliente.value);
	clienteDialog.value = true;
};

const confirmaDeletarCliente = (editarCliente) => {
	cliente.value = editarCliente;
	deleteClienteDialog.value = true;
};

const deletarCliente = () => {
	clientes.value = clientes.value.filter((val) => val.idCliente !== cliente.value.idCliente);
	deleteClienteDialog.value = false;
	cliente.value = {};
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Excluído', life: 3000 });
};

const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < clientes.value.length; i++) {
		if (clientes.value[i].id === id) {
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
	deleteClientesDialog.value = true;
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
				<span class="text-black-alpha-90 text-3xl">Clientes</span>
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
						</div>
					</template>
				</Toolbar>

				<DataTable
					ref="dt"
					:value="clientes"
					v-model:selection="selectedClientes"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
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
					<Column field="nome" header="Nome" :sortable="true" headerStyle="width:35%; min-width:10rem;">
						<template #body="slotProps">
							<!-- <span class="p-column-title">Status</span> -->
							{{ formatarString(slotProps.data.nome) }}
						</template>
					</Column>
					<Column field="cpf" header="CPF" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<!-- <span class="p-column-title">CPF</span> -->
							{{ slotProps.data.cpf }}
						</template>
					</Column>
					<Column field="dtNascimento" header="Data Nascimento" :sortable="true" headerStyle="width:20%; min-width:8rem;">
						<template #body="slotProps">
							<!-- <span class="p-column-title">Data Nascimento</span> -->
                            {{ moment(slotProps.data.dataNascimento).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="email" header="E-mail" :sortable="true" headerStyle="width:15%; min-width:10rem;">
						<template #body="slotProps">
							<!-- <span class="p-column-title">E-mail</span> -->
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
							<span :class="'cliente-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column> -->
					<Column headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="gerarPdf(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarCliente(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="clienteDialog" :style="{ width: '900px' }" header="Cliente" :modal="true" class="p-fluid">
                    <div class="grid p-fluid mt-3">
                        <div class="field col-12 md:col-6">                            
                            <label for="nome">Nome</label>
                            <InputText type="text" id="nome" v-model="cliente.nome" :disabled="false" :class="{ 'p-invalid': submitted && !cliente.nome }"/>
                            <small class="p-invalid" v-if="submitted && !cliente.nome">Nome é obrigatório.</small>                                                
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="cpf">CPF</label>
                            <InputMask id="cpf" mask="999.999.999-99" v-model.trim="cliente.cpf" :disabled="false"></InputMask>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="datanascimento">Data de Nascimento</label>
                            <Calendar inputId="datanascimento" v-model="cliente.dataNascimento" dateFormat="dd/mm/yy" :disabled="false"/>                           
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="email">E-mail</label>
                            <InputText type="email" id="email" v-model.trim="cliente.email" />                                
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="celular">Celular</label>
                            <InputMask id="celular" mask="(99) 99999-9999" v-model.trim="cliente.celular"></InputMask>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="cep">CEP</label>
                            <InputMask id="cep" mask="99999-999" v-model.trim="cliente.cep" :disabled="false"></InputMask>
                        </div>
                        <div class="field col-12 md:col-4">
                            <span class="p-float-label">
                                <InputText type="text" id="endereco" v-model="cliente.endereco" :disabled="false"/>
                                <label for="endereco">Endereço</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-2">
                            <span class="p-float-label">
                                <InputText type="text" id="complemento" v-model="cliente.complemento" :disabled="false"/>
                                <label for="complemento">Complemento</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-5">
                            <span class="p-float-label">
                                <InputText type="text" id="cidade" v-model="cliente.cidade" :disabled="false"/>
                                <label for="cidade">Cidade</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-1">
                            <span class="p-float-label">
                                <InputText type="text" id="uf" v-model.trim="cliente.uf" :disabled="false"/>
                                <label for="uf">UF</label>
                            </span>
                        </div>
                    </div>
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarCliente" />
					</template>
				</Dialog>
				<Dialog v-model:visible="deleteClienteDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="cliente">Tem certeza que deseja excluir o cliente "<b>{{ cliente.nome }}</b>"?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteClienteDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarCliente" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
