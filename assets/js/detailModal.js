// bs5
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  template: `<div
  class="modal fade"
  id="detailModal"
  ref="detailModal"
  tabindex="-1"
  aria-labelledby="detailModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header text-white bg-success">
        <h1 class="modal-title fs-5" id="detailModalLabel">
          {{ product.title }}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row align-items-center">
          <div class="col-md-4 d-flex justify-content-center mb-3">
            <img
              class="table-img obj-fit-cover obj-position-center rounded-circle"
              :src="product.imageUrl"
              :alt="product.title"
            />
          </div>
          <div class="col-md-8">
            <span class="fs-6 badge rounded-pill text-bg-success mb-3"
              >{{ product.category }}</span
            >
            <p>商品描述：{{ product.description }}</p>
            <p>商品內容：{{ product.content }}</p>
            <p>商品售價：{{ product.price }}</p>
            <div class="input-group w-50">
              <input
                type="number"
                min="1"
                class="form-control border-success"
                v-model.number="qty"
              />
              <span
                class="input-group-text bg-success text-white border-success"
                >{{ product.unit }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          關閉更多
        </button>
        <!-- addCartProduct 會自動加總數量，所以不用使用到 put -->
        <button
          type="button"
          class="btn btn-danger"
          @click="$emit('add-to-cart', product.id, qty)"
        >
          加入購物車
        </button>
      </div>
    </div>
  </div>
</div>`,
  data() {
    return {
      // 儲存 bs5 modal 實例
      detailModal: null,

      // 查看更多的商品數量，不宣告該變數畫面仍可以動，但會跳黃字警告
      qty: 1,
    };
  },
  methods: {
    openModal() {
      this.detailModal.show();
    },
    closeModal() {
      this.detailModal.hide();
    },
  },
  // 可以用 updated 看內層元件在 props 更新時，是否有抓到資料
  // updated() {
  //   console.log(this.product);
  // },
  mounted() {
    this.detailModal = new bootstrap.Modal(this.$refs.detailModal);
  },
};
