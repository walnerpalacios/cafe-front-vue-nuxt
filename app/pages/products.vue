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
            Productos
          </h1>
          <button
            class="bg-secondary text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-primary transition duration-300 shadow-md w-full sm:w-auto"
            @click="formData = { id: 0 }"
          >
            <i class="fas fa-plus-circle mr-2"></i> Nuevo Producto
          </button>
        </header>

        <div class="mb-6">
          <form
            @submit.prevent="
              inputSearch &&
                getProductList(
                  URL_BASE_API + '/api/v1/public/products?search=' + inputSearch
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
                getProductList(
                  URL_BASE_API + '/api/v1/public/products?page=1&limit=10'
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
                  Nombre
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Categoría
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Precio Base
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  IVA (19%)
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  Precio Final
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
                v-for="pro in originalProductsList?.data"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-3">{{ pro.id }}</td>
                <td class="px-4 py-3 font-semibold">{{ pro.name }}</td>
                <td class="px-4 py-3">{{ pro.category }}</td>
                <td class="px-4 py-3 text-right">
                  {{ formatCOP(pro.price - pro.price * pro.tax) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-500">
                  {{ formatCOP(pro.price * pro.tax) }}
                </td>
                <td class="px-4 py-3 text-right font-bold text-secondary">
                  {{ formatCOP(pro.price) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    class="text-secondary hover:text-primary transition duration-150 mr-2"
                    @click="formData = pro"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="text-red-500 hover:text-red-700 transition duration-150"
                    @click="eliminarProducto(pro.id)"
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
            >Página {{ productsList?.meta?.currentPage }} | Mostrando
            {{ productsList?.meta?.perPage }} de
            {{ productsList?.meta?.total }} productos</span
          >
          <div class="flex space-x-2">
            <button
              v-if="productsList?.meta?.previousPageUrl"
              @click="
                getProductList(
                  URL_BASE_API +
                    '/api/v1/public/products?' +
                    productsList?.meta?.previousPageUrl.replace('/?', '') +
                    '&limit=10'
                )
              "
              class="p-2 rounded-full transition bg-gray-200 hover:bg-secondary hover:text-white"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-if="productsList?.meta?.nextPageUrl"
              @click="
                getProductList(
                  URL_BASE_API +
                    '/api/v1/public/products?' +
                    productsList?.meta?.nextPageUrl.replace('/?', '') +
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

      <div
        v-show="formData?.id >= 0"
        id="product-modal"
        class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-xl w-full max-w-4xl shadow-2xl p-6">
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h2 id="modal-title" class="text-2xl font-bold text-primary">
              {{ formData?.id > 0 ? "Editar" : "Crear" }} Producto
            </h2>
            <button
              @click="formData = { imageUrl: '', id: -1 }"
              class="text-gray-400 hover:text-red-500 transition duration-150"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form
            @submit.prevent="
              formData.value?.id > 0 ? guardarProducto() : actualizarProducto()
            "
            id="product-form"
            class="space-y-4"
          >
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label
                  for="name"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Nombre del Producto</label
                >
                <input
                  v-model="formData.name"
                  type="text"
                  id="name"
                  name="name"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition"
                />
              </div>
              <div>
                <label
                  for="name"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Codigo de producto</label
                >
                <input
                  v-model="formData.reference"
                  type="text"
                  id="name"
                  name="name"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition"
                />
              </div>
              <div>
                <label
                  for="category"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Categoría</label
                >
                <select
                  v-model="formData.category"
                  id="category"
                  name="category"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition"
                >
                  <option value="">Seleccione Categoría</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="comidas">Comidas</option>
                  <option value="snacks">Snacks y Postres</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4">
              <div>
                <label
                  for="price"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Precio Ingresado (COP)</label
                >
                <input
                  type="number"
                  v-model="formData.price"
                  id="price"
                  name="price"
                  step="1"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition text-right"
                />
              </div>
              <div>
                <label
                  for="stock"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Stock</label
                >
                <input
                  type="number"
                  v-model="formData.stock"
                  id="stock"
                  name="stock"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition text-right"
                />
              </div>
              <div>
                <label
                  for="ivaPercentage"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Porcentaje de IVA (%)</label
                >
                <input
                  type="number"
                  v-model="formData.tax"
                  id="ivaPercentage"
                  name="ivaPercentage"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition text-right"
                />
              </div>
              <div>
                <label
                  for="photoUrl"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >URL de la Foto</label
                >
                <input
                  type="text"
                  id="photoUrl"
                  v-model="formData.imageUrl"
                  name="photoUrl"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 items-start">
              <div class="col-span-1">
                <label class="block text-sm font-semibold text-text-dark mb-1"
                  >Vista Previa de la Foto</label
                >
                <img
                  :src="formData.imageUrl"
                  alt="Vista previa de la foto"
                  class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
              <div class="col-span-2">
                <label
                  for="description"
                  class="block text-sm font-semibold text-text-dark mb-1"
                  >Descripción del Producto</label
                >
                <textarea
                  id="description"
                  v-model="formData.description"
                  name="description"
                  rows="3"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              id="submit-button"
              class="w-full bg-secondary text-white py-3 mt-4 rounded-lg text-lg font-bold hover:bg-primary transition duration-300"
            >
              {{ formData.value?.id > 0 ? "Crear" : "Actualiza" }} Producto
            </button>
          </form>
        </div>
      </div>
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
const tabs = ref([]);
const activeTab = ref("todo");
const formData = ref({
  id: -1,
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  tax: 0,
  stock: 0,
  reference: "",
});

const user = ref();
const error = ref("");

const token = ref({
  token: "",
  token_type: "",
});
const loading = ref(true);
const product = ref(0);
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

const guardarProducto = async () => {
  error.value = "";
  if (!formData.value.name) {
    push.warning({ message: "Debe ingresar el nombre del producto" });
    return;
  }
  loading.value = true;
  try {
    formData.value.image_url = formData.value.imageUrl;
    delete formData.value.imageUrl;
    delete formData.value.id;
    const data = await axios.post(
      URL_BASE_API + "/api/v1/products",
      formData.value,
      {
        headers: {
          Authorization: `${token.value.token_type} ${token.value.token}`,
        },
      }
    );

    formData.value = {
      id: -1,
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      tax: 0,
      stock: 0,
      reference: "",
    };
    push.success({ title: "Operación exitosa", message: data.data.message });
    console.log(data.data);
    getProductList(URL_BASE_API + "/api/v1/public/products?page=1&limit=10");
  } catch (error) {
    push.error({ title: "Error", message: error.error, timeout: 8000 });
  }
};

const actualizarProducto = async () => {
  error.value = "";
  if (!formData.value.name) {
    push.warning({ message: "Debe ingresar el nombre del producto" });
    return;
  }
  loading.value = true;
  try {
    formData.value.image_url = formData.value.imageUrl;
    delete formData.value.imageUrl;
    const data = await axios.put(
      URL_BASE_API + `/api/v1/products/${formData.value.id}`,
      formData.value,
      {
        headers: {
          Authorization: `${token.value.token_type} ${token.value.token}`,
        },
      }
    );

    formData.value = {
      id: -1,
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      tax: 0,
      stock: 0,
      reference: "",
    };
    push.success({ title: "Operación exitosa", message: data.data.message });
    getProductList(URL_BASE_API + "/api/v1/public/products?page=1&limit=10");
  } catch (error) {
    push.error({ title: "Error", message: error.error, timeout: 8000 });
    console.log(data.data);
  }
};

const eliminarProducto = async (id) => {
  if (!confirm("Seguro que deseas eliminar el producto?")) return;

  error.value = "";
  if (!formData.value.id) {
    push.warning({ message: "Debe seleccionar un producto" });
    return;
  }
  loading.value = true;
  try {
    const data = await axios.delete(
      URL_BASE_API + "/api/v1/products/"+id,
      {
        headers: {
          Authorization: `${token.value.token_type} ${token.value.token}`,
        },
      }
    );

    formData.value = {
      id: -1,
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      tax: 0,
      stock: 0,
      reference: "",
    };
    push.success({ title: "Operación exitosa", message: data.data.message });
    getProductList(URL_BASE_API + "/api/v1/public/products?page=1&limit=10");
  } catch (error) {
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
    push.error({ title: "Error", message: err.message, timeout: 8000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loading.value = false
  user.value = JSON.parse(localStorage.getItem("user")) || {};

  token.value.token = localStorage.getItem("token") || "";
  token.value.token_type = localStorage.getItem("token_type") || "";

  const verifyRateLimit = useRateLimit("productList", 30000, 10);
  if (!verifyRateLimit()) {
    originalProductsList.value = JSON.parse(
      localStorage.getItem("productListBackup")
    );
    push.warning({
      title: "Muchas peticiones",
      message: "Demasiadas solicitudes, se cargó una copia de los datos.",
    });
    loading.value = false;
    return;
  }
  getProductList(URL_BASE_API + "/api/v1/public/products?page=1&limit=10");
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

// Calcula el subtotal (Base Imponible)
const subtotalBruto = computed(() => {
  return order.value.reduce((sum, item) => {
    // Asumimos que 'item.price' es el precio FINAL (con impuestos incluidos)
    return sum + item.price * item.quantity;
  }, 0);
});

const agregarProducto = (productoNuevo) => {
  const cantidadModal = modalQuantity.value;

  const itemExistente = order.value.find(
    (item) => item.id === productoNuevo.id
  );

  if (itemExistente) {
    itemExistente.quantity += cantidadModal;
  } else {
    order.value.push({
      ...productoNuevo,
      quantity: cantidadModal,
    });
  }
  modalQuantity.value = 1;
  product.value = null;
};

// const eliminarProducto = (productoId) => {
//   const index = order.value.findIndex((item) => item.id === productoId);
//   if (index !== -1) {
//     order.value.splice(index, 1);
//   }
// };
</script>
