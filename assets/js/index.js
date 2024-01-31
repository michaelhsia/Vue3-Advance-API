// vue esm
// 用 esm 方式載入 Vue 會 VeeValidate 出錯，因此使用一般 CDN
// import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import detailModal from "./detailModal";

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
      detailProduct: {},

      // 表單 post 資訊
      form: {
        data: {
          user: {
            name: "",
            email: "",
            tel: "",
            address: "",
          },
          message: "",
        },
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
    detailModal,
  },
  methods: {
    // product 物件為所有商品中的某一項，點擊查看更多後，會把 product 賦予給 detailProduct，再透過 props 傳到 detailModal，進而渲染 detailModal 介面
    openModal(product) {
      this.detailProduct = product;
      this.$refs.detailModal.openModal();
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
    // 如果透過「查看更多」視窗(detailModal)觸發會使用到 emit，如果透過「加入購物車」按鈕會傳入 productId，而 qty 使用預設值 1
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

          // 可以用外層 DOM 呼叫內層元件方法
          this.$refs.detailModal.closeModal();

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
    // 提交訂單後會自動清空購物車
    submitOrder() {
      axios
        .post(`${url}/${apiPath}/order`, this.form)
        .then((res) => {
          let loader = this.$loading.show();

          //   用 ref 抓取表單 DOM，在提交成功後清空表單
          this.$refs.form.resetForm();
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

app.use(LoadingPlugin);
app.mount("#app");
