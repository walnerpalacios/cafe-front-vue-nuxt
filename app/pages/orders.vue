<template>
  <main class="bg-background text-text-dark font-cabin antialiased">
    <LoadingComponent v-if="loading" />
    <header
      class="sticky-header bg-primary text-white h-12 flex items-center justify-between px-4 lg:px-8"
    >
      <div class="flex items-center space-x-2">
        <i class="fas fa-mug-hot text-xl text-secondary"></i>
        <span class="text-2xl font-bold tracking-wider">CAFÉ ORDEN</span>
      </div>
      <div class="flex items-center space-x-4">
        <MenuComponent />
        <div class="relative group hidden lg:block">
          <div
            class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-primary/80 transition duration-150"
          >
            <img
              class="w-8 h-8 rounded-full mr-2"
              src="https://ui-avatars.com/api/?name=C&amp;background=48D1CC&amp;color=fff&amp;size=32"
              alt="Avatar"
            />
            <span class="text-sm">{{ user?.fullName }}</span>
            <i class="fas fa-caret-down ml-2 text-secondary"></i>
          </div>
          <div
            class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 hidden group-hover:block transition duration-200"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
            >
              <i class="fas fa-user mr-2"></i> Mi Perfil
            </a>
            <a
              href="#"
              @click="logOut"
              class="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
            >
              <i class="fas fa-sign-out-alt mr-2"></i> Salir
            </a>
          </div>
        </div>

        <button
          class="flex items-center space-x-1 p-2 rounded-lg bg-secondary lg:hidden"
          onclick="alert('Ver carrito completo')"
        >
          <i class="fas fa-shopping-cart text-white"></i>
          <span id="cart-count" class="text-white text-xs font-bold">0</span>
        </button>
      </div>
    </header>

    <section
      class="bg-background text-text-dark antialiased min-h-screen flex flex-col"
    >
      <div class="container mx-auto p-4 sm:p-8 flex-grow">
        <header
          class="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-center border-b pb-4 border-gray-300"
        >
          <h1
            class="text-3xl sm:text-4xl font-bold text-primary tracking-wide mb-4 sm:mb-0"
          >
            <i class="fas fa-box-open text-secondary mr-3"></i> Gestión de
            Ordenes
          </h1>
        </header>
        <div class="mb-6">
          <form
            @submit.prevent="
              inputSearch &&
                getOrdersList(
                  URL_BASE_API + '/api/v1/orders?search=' + inputSearch
                )
            "
            class="flex items-center space-x-4"
          >
            <div class="relative flex-grow">
              <input
                type="text"
                v-model="inputSearch"
                id="search-input"
                placeholder="Buscar por nombre o categoría..."
                class="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-secondary focus:border-secondary transition duration-200"
              />
              <i
                class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
            </div>
            <button
              type="submit"
              class="bg-secondary text-white py-2 px-4 rounded-lg hover:bg-primary transition duration-300"
            >
              Buscar
            </button>
            <button
              type="button"
              @click="
                inputSearch = '';
                getOrdersList(
                  URL_BASE_API + '/api/v1/orders?page=1&limit=10'
                );
              "
              class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Limpiar
            </button>
          </form>
        </div>

        <div class="bg-white rounded-xl shadow-2xl overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-lighter">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Cajero
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Descuento
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="ord in originalOrdersList?.data"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-3">{{ ord.id }}</td>
                <td class="px-4 py-3">{{ ord.user }}</td>
                <td class="px-4 py-3">{{ ord.client }}</td>
                <td class="px-4 py-3">{{ formatFecha(ord.createdAt) }}</td>
                <td class="px-4 py-3 text-right">
                  {{ ord.total }}
                </td>
                <td
                  class="px-4 text-center py-3 text-right font-bold text-secondary"
                >
                  {{ formatCOP(formatCOP(ord.discount)) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <a 
                    target="_blank" :href="`/order/${ord.id}` "class="text-secondary hover:text-primary transition duration-150 mr-2"
                  >
                    <i class="fas fa-eye"></i>
                  </a>
                  <button
                    class="text-red-500 hover:text-red-700 transition duration-150"
                    @click="eliminarOrden(ord.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          id="pagination-controls"
          class="flex justify-between items-center mt-6 space-x-4"
        >
          <span class="text-sm text-gray-600 hidden sm:block"
            >Página {{ orderList?.meta?.currentPage }} | Mostrando
            {{ orderList?.meta?.perPage }} de
            {{ orderList?.meta?.total }} órdenes</span
          >
          <div class="flex space-x-2">
            <button
              v-if="orderList?.meta?.previousPageUrl"
              @click="
                getOrdersList(
                  URL_BASE_API +
                    '/api/v1/orders?' +
                    orderList?.meta?.previousPageUrl.replace('/?', '') +
                    '&limit=10'
                )
              "
              class="p-2 rounded-full transition bg-gray-200 hover:bg-secondary hover:text-white"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-if="orderList?.meta?.nextPageUrl"
              @click="
                getOrdersList(
                  URL_BASE_API +
                    '/api/v1/orders?' +
                    orderList?.meta?.nextPageUrl.replace('/?', '') +
                    '&limit=10'
                )
              "
              class="p-2 rounded-full transition bg-gray-200 hover:bg-secondary hover:text-white"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <footer class="bg-primary text-white text-center py-4 mt-auto">
        <p class="text-sm font-light">
          Proyecto Práctico Desarrollado durante el **Curso Nuxt 4 Practico**
        </p>
        <p class="text-xs opacity-70">
          © 2025 Café Orden. Todos los derechos reservados.
        </p>
      </footer>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
// import "~/assets/css/product.css";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { push } from "notivue";

const inputSearch = ref("");
const user = ref();
const error = ref("");

const token = ref({
  token: "",
  token_type: "",
});
const loading = ref(true);
const orderList = ref([]);
const originalOrdersList = ref([]);

const getOrdersList = async (url) => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `${token.value.token_type} ${token.value.token}`,
      },
    });
    orderList.value = data.data;
    originalOrdersList.value = data.data;
    localStorage.setItem("orderListBk", JSON.stringify(data.data));
  } catch (err) {
    push.error({ title: "Error", message: err.message, timeout: 8000 });
  } finally {
    loading.value = false;
  }
};

const eliminarOrden = async (id) => {
  if (!confirm("Seguro que deseas eliminar la orden?")) return;

  error.value = "";
  if (!id) {
    push.warning({ message: "Debe seleccionar una orden" });
    return;
  }
  loading.value = true;
  try {
    const data = await axios.delete(URL_BASE_API + "/api/v1/orders/" + id, {
      headers: {
        Authorization: `${token.value.token_type} ${token.value.token}`,
      },
    });
    push.success({ title: "Operación exitosa", message: data.data.message });
    getOrdersList(URL_BASE_API + "/api/v1/orders?page=1&limit=10");
  } catch (error) {
    if (err.message.includes("401")) {
      push.warning({ title: "Sesión expirada", message: "Por favor inicie sesión de nuevo.", timeout: 8000 });
      localStorage.clear();
      return navigateTo({ path: "/auth" });
    }
    push.error({ title: "Error", message: error.error, timeout: 8000 });
    console.log(data.data);
  }
};

const logOut = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await axios.get(URL_BASE_API + "/api/v1/auth/logout", {
      headers: {
        Authorization: `${token.value.token_type} ${token.value.token}`,
      },
    });
    localStorage.clear();
    return navigateTo({ path: "/" });
  } catch (err) {
    if (err.message.includes("401")) {
      push.warning({ title: "Sesión expirada", message: "Por favor inicie sesión de nuevo.", timeout: 8000 });
      localStorage.clear();
      return navigateTo({ path: "/auth" });
    }
    push.error({ title: "Error", message: err.message, timeout: 8000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loading.value = false;
  user.value = JSON.parse(localStorage.getItem("user")) || {};

  token.value.token = localStorage.getItem("token") || "";
  token.value.token_type = localStorage.getItem("token_type") || "";

  const verifyRateLimit = useRateLimit("orderList", 30000, 10);
  if (!verifyRateLimit()) {
    originalOrdersList.value = JSON.parse(localStorage.getItem("orderListBK"));
    push.warning({
      title: "Muchas peticiones",
      message: "Demasiadas solicitudes, se cargó una copia de los datos.",
    });
    loading.value = false;
    return;
  }
  getOrdersList(URL_BASE_API + "/api/v1/orders?page=1&limit=10");
});

const formatCOP = (price) => {
  const numericPrice = isNaN(price) ? 0 : price;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

const formatFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Bogota",
  }).format(fecha);
};

// Calcula el subtotal (Base Imponible)
const subtotalBruto = computed(() => {
  return order.value.reduce((sum, item) => {
    // Asumimos que 'item.price' es el precio FINAL (con impuestos incluidos)
    return sum + item.price * item.quantity;
  }, 0);
});
</script>
