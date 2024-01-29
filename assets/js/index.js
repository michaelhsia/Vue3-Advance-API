import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import axios from "axios";

const url = "https://ec-course-api.hexschool.io/v2/api";
const apiPath = "michaelhsia";

const app = createApp({
  data() {
    return {
      products: [],
    };
  },
  methods: {
    getProductData() {
      axios
        .get(`${url}/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
          console.log(this.products);
        })
        .catch((err) => alert(err.response));
    },
  },
  mounted() {
    this.getProductData();
  },
});

app.mount("#app");
