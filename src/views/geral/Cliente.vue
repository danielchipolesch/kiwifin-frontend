<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ClienteService from '@/service/ClienteService';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

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
    // && cliente.value.cpf.trim()
	if (cliente.value.cpf && cliente.value.descricao) {
		if (cliente.value.id) {
			cliente.value.cpf = cliente.value.cpf.value ? cliente.value.cpf.value : cliente.value.cpf;
			cliente.value.descricao = cliente.value.descricao.value ? cliente.value.descricao.value : cliente.value.descricao;
			clientes.value[findIndexById(cliente.value.id)] = cliente.value;
            console.log(cliente.value)
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado', life: 3000 });
		} else {
			cliente.value.id = createId();
			// cliente.value.nome = "Criado";
			cliente.value.imagem = 'cliente-placeholder.svg';
//			cliente.value.conclusao = cliente.value.conclusao ? cliente.value.conclusao.value : 'INSTOCK';
			cliente.value.descricao = cliente.value.descricao ? cliente.value.descricao.value : 'Genérico';
			clientes.value.push(cliente.value);
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente criado', life: 3000 });
		}
		clienteDialog.value = false;
		cliente.value = {};
	}
};

const editarCliente = (editarCliente) => {
	cliente.value = { ...editarCliente };
	console.log(cliente);
	clienteDialog.value = true;
};

const confirmaDeletarCliente = (editarCliente) => {
	cliente.value = editarCliente;
	deleteClienteDialog.value = true;
};

const deletarCliente = () => {
	clientes.value = clientes.value.filter((val) => val.id !== cliente.value.id);
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
	deleteClientesDialog.value = true;
};
const deleteSelectedClientes = () => {
	clientes.value = clientes.value.filter((val) => !selectedClientes.value.includes(val));
	deleteClientesDialog.value = false;
	selectedClientes.value = null;
	toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Clientes Excluídos', life: 3000 });
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
							<span :class="'cliente-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column> -->
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-raised p-button-secondary mr-2" @click="editarCliente(slotProps.data)" />
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editarCliente(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editarCliente(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmaDeletarCliente(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="clienteDialog" :style="{ width: '500px' }" header="Novo Cliente" :modal="true" class="p-fluid">
					<img :src="'demo/images/cliente/' + cliente.imagem" :alt="cliente.imagem" v-if="cliente.imagem" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
					<div class="field">
						<label for="cpf">CPF</label>
						<!-- <InputText id="cpf" v-model.trim="cliente.cpf" required="true" autofocus :class="{ 'p-invalid': submitted && !cliente.cpf }" /> -->
                        <Dropdown id="cpf" v-model="cliente.cpf" :options="cpfs" optionLabel="name" placeholder="Select" :class="{ 'p-invalid': submitted && !cliente.cpf }" required="true"/>
						<small class="p-invalid" v-if="submitted && !cliente.cpf">CPF is required.</small>
					</div>
                    <!-- <div class="field">
                        <Dropdown v-model="cliente.cpf2" :options="cpf2s" optionLabel="name" placeholder="Select" required="true"/>
                    </div> -->
					<div class="field">
						<label for="descricao">Descrição</label>
						<Textarea id="descricao" v-model="cliente.descricao" required="true" rows="3" cols="20" />
					</div>

					<!-- <div class="field">
						<label for="conclusao" class="mb-3">Inventory Conclusão</label>
						<Dropdown id="conclusao" v-model="cliente.conclusao" :options="statuses" optionLabel="label" placeholder="Select a Conclusão">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'cliente-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'cliente-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
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
								<RadioButton id="email1" cpf="email" value="Accessories" v-model="cliente.email" />
								<label for="email1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email2" cpf="email" value="Clothing" v-model="cliente.email" />
								<label for="email2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email3" cpf="email" value="Electronics" v-model="cliente.email" />
								<label for="email3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="email4" cpf="email" value="Fitness" v-model="cliente.email" />
								<label for="email4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="dtNascimento">Data Nascimento</label>
							<InputNumber id="dtNascimento" v-model="cliente.dtNascimento" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !cliente.dtNascimento }" :required="true" />
							<small class="p-invalid" v-if="submitted && !cliente.dtNascimento">Data Nascimento is required.</small>
						</div>
						<div class="field col">
							<label for="quantidade">Quantity</label>
							<InputNumber id="quantidade" v-model="cliente.quantidade" integeronly />
						</div>
					</div> -->
					<template #footer>
						<Button label="Voltar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-raised p-button-primary" @click="salvarCliente" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteClienteDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="cliente"
							>Tem certeza que deseja excluir o Cliente n. <b>{{ cliente.dtNascimento }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteClienteDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deletarCliente" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteClientesDialog" :style="{ width: '450px' }" header="Pense bem!" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="cliente">Tem certeza que deseja excluir os clientes selecionados?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteClientesDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-raised p-button-danger" @click="deleteSelectedClientes" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
