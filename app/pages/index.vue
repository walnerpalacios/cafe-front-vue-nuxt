<template>
  <section class="bg-background text-text-dark font-cabin antialiased">
    <Header />
  </section>

  <section>
    <div class="sticky-controls px-4 lg:px-8 pt-6 shadow-md">
      <div class="mb-4">
        <div class="relative">
          <input
            v-model="inputSearch"
            type="text"
            placeholder="Buscar producto por nombre o descripción..."
            class="w-full p-3 border border-gray-300 rounded-xl pl-12 text-lg focus:ring-secondary focus:border-secondary transition duration-200 shadow-inner"
          />
          <i
            class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
          ></i>
        </div>
      </div>

      <div class="bg-gray-lighter p-1 rounded-xl flex space-x-2 shadow-inner">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex w-1/5 items-center px-4 py-2 rounded-xl font-semibold text-lg transition duration-200',
            activeTab === tab.id
              ? 'bg-primary text-white shadow-lg'
              : 'text-text-dark hover:bg-gray-200',
          ]"
        >
          <i :class="tab.icon + ' mr-2'"></i> {{ tab.label }}
        </button>
      </div>
    </div>
  </section>

  <section class="container mx-auto px-4 pt-4">
    <div id="menu-display-container">
      <div class="mb-16">
        <h2
          class="text-5xl font-bold text-primary mb-6 border-b-8 border-secondary/50 pb-4 flex items-center"
        >
          <i :class="currentTab?.icon + ' mr-2'"></i> {{ currentTab?.label }}
        </h2>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <div
        v-if="!loading"
        v-for="item in productsList"
        :key="item.id"
        class="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-b-4 border-secondary transition duration-300 transform hover:-translate-y-1"
        @click="product = item"
      >
        <img
          class="w-full h-48 object-cover"
          :src="item.imageUrl"
          alt="Ensalada César"
        />
        <div class="p-5">
          <div class="flex justify-between items-start mb-1">
            <h3 class="text-2xl font-bold text-text-dark">{{ item.name }}</h3>
            <span
              class="text-4xl font-extrabold text-secondary flex-shrink-0 ml-4"
            >
              {{
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(item.price)
              }}
            </span>
          </div>
          <p class="text-base text-gray-600">{{ item.description }}</p>
        </div>
      </div>
      <div
        v-if="loading"
        v-for="n in 4"
        :key="n"
        class="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-b-4 border-secondary transition duration-300 transform hover:-translate-y-1"
      >
        <div class="animate-pulse">
          <div class="w-full h-48 bg-gray-300"></div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-1">
              <div class="h-6 bg-gray-300 rounded w-1/2"></div>
              <div class="h-8 bg-gray-300 rounded w-1/4 ml-4"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-full mt-2"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="product-modal"
      v-if="product"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-12"
      @click="product = null"
    >
      <div
        class="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl"
      >
        <div class="relative">
          <img
            id="modal-image"
            class="w-full h-64 object-cover"
            :src="product.imageUrl"
            alt="Imagen del Producto"
          />
          <button
            @click="product = null"
            class="absolute top-3 right-3 bg-white rounded-full p-2 text-primary hover:bg-gray-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="p-6">
          <h3 id="modal-title" class="text-3xl font-bold text-primary mb-2">
            {{ product.name }}
          </h3>
          <p id="modal-description" class="text-gray-600 mb-6">
            {{ product.description }}
          </p>

          <div class="flex justify-between items-center mb-6 border-t pt-4">
            <span id="modal-price" class="text-3xl font-bold text-secondary">
              {{
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.price)
              }}
            </span>

            <div class="flex items-center space-x-3">
              <label for="modal-quantity" class="text-primary font-semibold"
                >Cantidad:</label
              >
              <input
                type="number"
                id="modal-quantity"
                value="1"
                min="1"
                max="10"
                class="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-secondary focus:border-secondary"
              />
            </div>
          </div>

          <button
            id="modal-add-button"
            class="w-full bg-secondary text-white py-3 rounded-lg text-lg font-bold hover:bg-primary transition duration-200"
          >
            <i class="fas fa-plus mr-2"></i> Añadir al Pedido
          </button>
        </div>
      </div>
    </div>
  </section>

  <FooterComponent />
</template>

<script setup>
import "~/assets/css/index.css";
import "~/composables/useRateLimit";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { push } from "notivue";

const inputSearch = ref("");
const tabs = ref([]);
const product = ref();
const activeTab = ref("todo");

const error = ref("");
const loading = ref(false);
const productsList = ref([]);

const originalProductsList = ref([]);

const getProductList = async (url) => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await axios.get(url);
    productsList.value = data.data;
    originalProductsList.value = data.data;
    localStorage.setItem("productListBackup", JSON.stringify(data.data));
  } catch (err) {
    push.error({ title: "Error", message: err.message, timeout: 8000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  tabs.value = [
    { id: "todo", label: "Todo el Menú", icon: "fas fa-list-ul" },
    { id: "bebidas", label: "Bebidas", icon: "fas fa-coffee" },
    { id: "comidas", label: "Comidas", icon: "fas fa-hamburger" },
    { id: "snacks", label: "Snacks", icon: "fas fa-cookie-bite" },
  ];

  const verifyRateLimit = useRateLimit("productList", 30000, 5);
  if (!verifyRateLimit()) {
    originalProductsList.value = JSON.parse(
      localStorage.getItem("productListBackup")
    );
    push.warning({
      title: "Muchas peticiones",
      message: "Demasiadas solicitudes, se cargó una copia de los datos.",
    });
    return;
  }
  getProductList(URL_BASE_API + "/api/v1/public/products");
});

const currentTab = computed(() => {
  return tabs.value.find((t) => t.id === activeTab.value) || tabs.value[0];
});

watch(currentTab, (valor) => {
  switch (valor.id) {
    case "bebidas":
      productsList.value = originalProductsList.value.filter(
        (item) => item.category === "bebidas"
      );
      break;
    case "comidas":
      productsList.value = originalProductsList.value.filter(
        (item) => item.category === "comidas"
      );
      break;
    case "snacks":
      productsList.value = originalProductsList.value.filter(
        (item) => item.category === "snacks"
      );
      break;
    default:
      productsList.value = originalProductsList.value;
      break;
  }
});

watch(inputSearch, (nuevoValor) => {
  productsList.value = originalProductsList.value.filter((item) =>
    item.name.toLowerCase().includes(nuevoValor.toLowerCase())
  );
});
</script>
