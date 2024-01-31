// vue esm
// 用 esm 方式載入 Vue 會 VeeValidate 出錯，因此使用一般 CDN
// import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// vue-loading
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

// bs5
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";

// axios
import axios from "axios";

// sweetalert
import Swal from "sweetalert2";

// api
const url = "https://ec-course-api.hexschool.io/v2/api";
const apiPath = "michaelhsia";

// VeeValidate 方法載入
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// VeeValidate 驗證資料
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

// VeeValidate 抓取語言檔案
loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

// 自定驗證語言跟形式
configure({
  generateMessage: localize("zh_TW"),
  validateOnInput: true, // 輸入時驗證
});

const app = Vue.createApp({
  data() {
    return {
      // 完成商品資料
      products: [],

      // 購物車資料
      carts: [],

      detailModal: null,
      detailProduct: {},
      // 查看更多的商品數量，不宣告該變數畫面仍可以動，但會跳黃字警告
      qty: 1,

      // 表單 post 資訊
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    openModal(product) {
      this.detailModal.show();
      this.detailProduct = product;
    },
    getProductData() {
      axios
        .get(`${url}/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    addCartProduct(productId, qty = 1) {
      const data = {
        data: {
          product_id: productId,
          qty, // 等於 qty: qty
        },
      };
      axios
        .post(`${url}/${apiPath}/cart`, data)
        .then((res) => {
          // 呼叫載入效果
          let loader = this.$loading.show();

          this.detailModal.hide();

          // loader 傳入 getCart，等取得購物車後把載入效果關閉
          this.getCart(loader);

          setTimeout(() => {
            loader.hide();
          }, 800);

          // 彈出視窗效果
          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }, 1200);
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    // 綁定 input change 事件
    updateCartProduct(cartId, productId, event) {
      const data = {
        data: {
          product_id: productId,
          // 要轉成數字型別所以乘上 1
          qty: event.target.value * 1,
        },
      };
      axios
        .put(`${url}/${apiPath}/cart/${cartId}`, data)
        .then((res) => {
          let loader = this.$loading.show();

          this.getCart();

          setTimeout(() => {
            loader.hide();
          }, 800);

          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }, 1200);
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    getCart() {
      axios
        .get(`${url}/${apiPath}/cart`)
        .then((res) => {
          this.carts = res.data.data.carts;
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    delSingleCart(cartId) {
      axios
        .delete(`${url}/${apiPath}/cart/${cartId}`)
        .then((res) => {
          let loader = this.$loading.show();

          this.getCart();

          setTimeout(() => {
            loader.hide();
          }, 800);

          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }, 1200);
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    delAllCart() {
      axios
        .delete(`${url}/${apiPath}/carts`)
        .then((res) => {
          let loader = this.$loading.show();

          this.getCart();

          setTimeout(() => {
            loader.hide();
          }, 800);

          setTimeout(() => {
            Swal.fire({
              title: `${res.data.message}`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }, 1200);
        })
        .catch((err) => {
          Swal.fire({
            title: `${err.response.data.message}`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    // 表單電話驗證
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
    submitOrder() {
      axios
        .post(`${url}/${apiPath}/order`, this.data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => alert(err.response.message));
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
    this.detailModal = new bootstrap.Modal(this.$refs.detailModal);
    this.getProductData();
    this.getCart();
  },
});

app.use(LoadingPlugin);
app.mount("#app");
