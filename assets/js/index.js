import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import axios from "axios";

const url = "https://ec-course-api.hexschool.io/v2/api";
const apiPath = "michaelhsia";

const app = createApp({
  data() {
    return {
      // 完成商品資料
      products: [],
      // 購物車資料
      carts: [],
    };
  },
  methods: {
    getProductData() {
      axios
        .get(`${url}/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => alert(err.response));
    },
    addCartProduct(productId) {
      const data = {
        data: {
          product_id: productId,
          qty: 1,
        },
      };
      axios
        .post(`${url}/${apiPath}/cart`, data)
        .then((res) => {
          this.getCart();
        })
        .catch((err) => alert(err.response));
    },
    getCart() {
      axios
        .get(`${url}/${apiPath}/cart`)
        .then((res) => {
          this.carts = res.data.data.carts;
          console.log(this.carts);
        })
        .catch((err) => alert(err.response));
    },
  },
  computed: {
    total() {
      return this.carts.reduce(
        (finalTotal, current) => finalTotal + current.final_total,
        0
      );
    },
  },
  mounted() {
    this.getProductData();
    this.getCart();
  },
});

app.mount("#app");
