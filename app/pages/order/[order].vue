<template>
  <LoadingComponent v-if="loading" />
  <section class="bg-background text-text-dark font-cabin antialiased p-8">
    <div class="text-center mb-10 no-print">
      <button
        class="bg-primary text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-secondary transition duration-300"
        onclick="window.print()"
      >
        <i class="fas fa-print mr-2"></i> IMPRIMIR COPIA
      </button>
      <button
        class="bg-gray-200 text-text-dark py-3 px-6 rounded-lg text-lg font-bold hover:bg-gray-300 transition duration-300 ml-4"
        @click="router.push({ path: '/home' })"
      >
        <i class="fas fa-backward mr-2"></i> VOLVER
      </button>
    </div>
    <div class="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-2xl">
      <div class="text-center mb-8 border-b pb-4 border-gray-300">
        <i class="fas fa-mug-hot text-4xl text-secondary mb-2"></i>
        <h1 class="text-4xl font-extrabold text-primary mb-1">
          RECIBO DE PEDIDO
        </h1>
        <p class="text-lg text-gray-500">
          ¡Gracias por tu compra, Cliente General!
        </p>
      </div>

      <div class="space-y-2 mb-8 text-lg">
        <p class="font-semibold text-text-dark">
          Nº Pedido:
          <span class="text-secondary font-bold" id="order-id">{{
            order?.id
          }}</span>
        </p>
        <p class="font-semibold text-text-dark">
          Fecha:
          <span class="font-normal" id="order-date">{{
            formatFecha(order?.createdAt)
          }}</span>
        </p>
        <p class="font-semibold text-text-dark">
          Cajero: <span class="font-normal">{{ order?.user }}</span>
        </p>
      </div>

      <div class="border-t border-b border-gray-300 py-4 mb-6">
        <div class="grid grid-cols-5 font-bold text-base text-text-dark">
          <span class="col-span-2">Producto</span>
          <span class="text-center">Cant.</span>
          <span class="text-right">Precio Unitario</span>
          <span class="text-right">Subtotal</span>
        </div>
      </div>

      <div id="receipt-items">
        <div
          v-for="product in order?.details"
          class="grid grid-cols-5 py-2 border-b border-gray-100 text-base"
        >
          <span class="col-span-2 text-text-dark">{{ product.name }}</span>
          <span class="text-center font-medium">{{ product.quantity }}</span>
          <span class="text-right">{{ formatCOP(product.price) }}</span>
          <span class="text-right font-semibold">{{
            formatCOP(product.price * product.quantity)
          }}</span>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <div class="w-full max-w-xs space-y-2 text-right">
          <div class="flex justify-between border-t border-gray-200 pt-2">
            <span class="font-semibold">Subtotal (Neto):</span>
            <span id="subtotal-base" class="font-medium">{{
              formatCOP(subtotalNeto)
            }}</span>
          </div>

          <div class="flex justify-between text-red-600">
            <span class="font-semibold">Descuento ($):</span>
            <span id="discount-amount" class="font-medium">{{
              formatCOP(order?.discount)
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="font-semibold">IVA (tax):</span>
            <span id="iva-amount" class="font-medium">{{
              formatCOP(ivaMonto)
            }}</span>
          </div>

          <div class="flex justify-between border-t-2 border-primary pt-2">
            <span class="text-2xl font-bold text-primary">TOTAL A PAGAR:</span>
            <span
              id="total-final"
              class="text-2xl font-extrabold text-secondary"
              >{{ formatCOP(totalFinalConDescuento) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import "~/assets/css/oder.css";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { push } from "notivue";
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const orderId = ref();
const order = ref();
const orderDetails = ref([]);
const error = ref();


const getOrderByID = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await axios.get(
      URL_BASE_API + "/api/v1/public/orders/" + orderId.value
    );
    order.value = await data.data;
    orderDetails.value = await order.value.details;
    push.success({ title: data.message, message: "Órden encontrada" });
    console.log(order.value);
  } catch (err) {
    if (err.status === 404) {
      push.error({
        title: "Error",
        message: "No exite la orden " + orderId.value,
        timeout: 8000,
      });
    } else {
      push.error({ title: "Error", message: err.message, timeout: 8000 });
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  orderId.value = route.params.order;
  if (orderId.value > 0) {
    getOrderByID();
  }
});

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
  return orderDetails.value.reduce((sum, item) => {
    // Asumimos que 'item.price' es el precio FINAL (con impuestos incluidos)
    return sum + item.price * item.quantity;
  }, 0);
});

// Calcula el monto TOTAL del IVA de todos los productos
const ivaMonto = computed(() => {
  return orderDetails.value.reduce((totalIVA, item) => {
    const precioTotalItem = item.price * item.quantity;
    const tasaIVA = item.tax || 0; // Usar 0 si 'tax' no existe o es nulo

    // Lógica para separar el IVA (asumiendo que 'price' ya lo incluye)
    // Precio Base = Precio Final / (1 + Tasa IVA)
    const precioBaseUnitario = item.price / (1 + tasaIVA);
    const ivaUnitario = item.price - precioBaseUnitario;

    return totalIVA + ivaUnitario * item.quantity;
  }, 0);
});

// El Total Final es el subtotal bruto (que ya incluye el IVA por nuestro cálculo)
const totalFinal = computed(() => {
  return subtotalBruto.value;
});

const totalFinalConDescuento = computed(() => {
  return order.value?.total > 0
    ? order.value?.total - (order.value?.discount || 0)
    : 0;
});

// El Subtotal Neto (antes de impuestos)
const subtotalNeto = computed(() => {
  return totalFinal.value - ivaMonto.value;
});

</script>
