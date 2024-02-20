<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
	{ label: 'INSTOCK', value: 'instock' },
	{ label: 'LOWSTOCK', value: 'lowstock' },
	{ label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const productService = new ProductService();

onBeforeMount(() => {
	initFilters();
});
onMounted(() => {
	productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
	return value.toLocaleString('PT-BR', { style: 'currency', currency: 'BRL' });
};

const openNew = () => {
	product.value = {};
	submitted.value = false;
	productDialog.value = true;
};

const hideDialog = () => {
	productDialog.value = false;
	submitted.value = false;
};

const saveProduct = () => {
	submitted.value = true;
	if (product.value.assunto && product.value.assunto.trim() && product.value.protocolo) {
		if (product.value.id) {
			product.value.conclusao = product.value.conclusao.value ? product.value.conclusao.value : product.value.conclusao;
			products.value[findIndexById(product.value.id)] = product.value;
			toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
		} else {
			product.value.id = createId();
			product.value.andamento = createId();
			product.value.image = 'product-placeholder.svg';
			product.value.conclusao = product.value.conclusao ? product.value.conclusao.value : 'INSTOCK';
			products.value.push(product.value);
			toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
		}
		productDialog.value = false;
		product.value = {};
	}
};

const editProduct = (editProduct) => {
	product.value = { ...editProduct };
	console.log(product);
	productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
	product.value = editProduct;
	deleteProductDialog.value = true;
};

const deleteProduct = () => {
	products.value = products.value.filter((val) => val.id !== product.value.id);
	deleteProductDialog.value = false;
	product.value = {};
	toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
	let index = -1;
	for (let i = 0; i < products.value.length; i++) {
		if (products.value[i].id === id) {
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
	deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
	products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
	deleteProductsDialog.value = false;
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
					:value="products"
					v-model:selection="selectedProducts"
					dataKey="id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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
					<!--		<img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />-->
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
							<span :class="'product-badge status-' + (slotProps.data.conclusao ? slotProps.data.conclusao.toLowerCase() : '')">{{ slotProps.data.conclusao }}</span>
						</template>
					</Column>
					<Column headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-eye" class="p-button-rounded p-button-raised p-button-info mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-raised p-button-warning mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-raised p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
					<img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
					<div class="field">
						<label for="assunto">Assunto</label>
						<InputText id="assunto" v-model.trim="product.assunto" required="true" autofocus :class="{ 'p-invalid': submitted && !product.assunto }" />
						<small class="p-invalid" v-if="submitted && !product.assunto">Assunto is required.</small>
					</div>
					<div class="field">
						<label for="description">Description</label>
						<Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
					</div>

					<div class="field">
						<label for="conclusao" class="mb-3">Inventory Conclusão</label>
						<Dropdown id="conclusao" v-model="product.conclusao" :options="statuses" optionLabel="label" placeholder="Select a Conclusão">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
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
								<RadioButton id="criacao1" assunto="criacao" value="Accessories" v-model="product.criacao" />
								<label for="criacao1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao2" assunto="criacao" value="Clothing" v-model="product.criacao" />
								<label for="criacao2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao3" assunto="criacao" value="Electronics" v-model="product.criacao" />
								<label for="criacao3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="criacao4" assunto="criacao" value="Fitness" v-model="product.criacao" />
								<label for="criacao4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="protocolo">Protocolo</label>
							<InputNumber id="protocolo" v-model="product.protocolo" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.protocolo }" :required="true" />
							<small class="p-invalid" v-if="submitted && !product.protocolo">Protocolo is required.</small>
						</div>
						<div class="field col">
							<label for="quantity">Quantity</label>
							<InputNumber id="quantity" v-model="product.quantity" integeronly />
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product"
							>Are you sure you want to delete <b>{{ product.assunto }}</b
							>?</span
						>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>
