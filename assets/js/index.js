import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import axios from "axios";

const url = "https://ec-course-api.hexschool.io/v2/api";
const apiPath = "michaelhsia";

// 代辦：
// 1. 購物車刪除單一
// 2. 查看更多
// 3. 表單驗證
// 4. 加入購物車跟查看更多按鈕榜loading

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
    delSingleCart(cartId) {
      axios.delete(`${url}/${apiPath}/cart/${cartId}`).then((res) => {
        this.getCart();
        console.log(this.carts);
      });
    },
    delAllCart() {
      axios
        .delete(`${url}/${apiPath}/carts`)
        .then((res) => {
          alert("已刪除所有購物車");
          this.getCart();
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
