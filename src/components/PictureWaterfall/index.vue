<template>
  <div class="container">
    <div class="waterfall">
      <div
        v-for="(picCol, index) in showPictureCols"
        :key="index"
        class="waterfall__col"
      >
        <div
          v-for="pic in picCol"
          :key="pic.id"
          class="waterfall__col__container"
        >
          <img :src="pic.path" alt="" @click="handleImgClick(pic.index)" />
        </div>
      </div>
    </div>
    <div v-if="mask.show" class="pic-modal">
      <img class="pic-modal__content" :src="pictureList[mask.index].path" />
      <img
        class="pic-modal__icon-close"
        src="../../assets/close.png"
        @click="handleMaskClose"
      />
      <img
        @click="handlePicJump('last')"
        class="pic-modal__icon-left"
        src="../../assets/angle-left.png"
      />
      <img
        @click="handlePicJump('next')"
        class="pic-modal__icon-right"
        src="../../assets/angle-right.png"
      />
      <p>{{ mentionText }}</p>
    </div>
  </div>
</template>

<script>
import { postGetPics } from "../../service";
import { HOST } from "../../common/fetch";
import _ from "lodash";
export default {
  name: "PictureWaterfall",
  props: {},
  data: function () {
    return {
      offset: 0,
      limit: 20,
      done: false,
      showColNum: 3, //瀑布流一排 3 列
      pictureList: [],
      //控制图片遮罩层
      mask: {
        show: false,
        index: 0,
        // rawScrollTop: 0, //记录弹出遮罩层前，滚动高度，方便后续还原
      },
      //避免图片请求冲突
      isRequesting: false,
    };
  },
  computed: {
    picKeys: function () {
      return this.pictureList.map((item) => item.id);
    },
    showPictureCols: function () {
      const res = new Array(this.showColNum).fill(null).map(() => []);
      for (let index = 0; index < this.pictureList.length; index++) {
        const pic = this.pictureList[index];
        res[index % this.showColNum].push(pic);
      }
      console.log(123, res);
      return res;
    },
    mentionText: function () {
      return `${this.mask.index + 1} / ${this.pictureList.length}`;
    },
  },
  created: function () {
    this.getPics();
  },
  mounted() {
    // 监听滚动事件，设置锚点定位
    window.addEventListener("scroll", this.onScroll, false);
  },
  destroy() {
    // 移除监听器，不然当该vue组件被销毁了，监听器还在
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    async getPics() {
      this.isRequesting = true;
      const { data, done } = await postGetPics(this.limit, this.offset);
      console.log(data, done);
      //防止重复添加
      const filterData = data.filter((item) => !this.picKeys.includes(item.id));
      filterData.forEach((pic) => {
        pic.path = `${HOST}/${pic.path}`;
      });
      this.pictureList.push(...filterData);
      // 刷新图片 index ，方便大图展示
      this.pictureList.forEach((pic, index) => {
        pic.index = index;
      });
      this.done = done;
      if (!done) {
        this.offset += this.limit;
      }
      this.isRequesting = false;
    },
    onScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      //如果滚轮触底
      if (scrollTop + clientHeight >= scrollHeight) {
        // console.log(scrollTop, clientHeight, scrollHeight);
        this.onRequestPics();
      }
    },
    onRequestPics: _.debounce(function () {
      // 请求接口，如果后端数据全拿到了或者正在发起请求，则略过
      if (!this.done && !this.isRequesting) {
        this.getPics();
      }
    }, 300),
    handleImgClick(index) {
      this.mask.show = true;
      document.body.style.overflow = "hidden";
      this.mask.index = index;
      console.log(index);
    },
    handleMaskClose() {
      this.mask.show = false;
      document.body.style.overflow = "auto";
    },
    handlePicJump(type) {
      switch (type) {
        case "next":
          if (this.mask.index < this.pictureList.length - 1) {
            this.mask.index += 1;
          }
          break;
        case "last":
          if (this.mask.index > 0) {
            this.mask.index -= 1;
          }
          break;
        default:
          console.error("图片切换无此选项");
          break;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  padding: 20px 0;
  margin: 0 120px;
  // display: none;
  .waterfall {
    display: flex;
    justify-content: space-between;
    // display: none;
    &__col {
      flex: 0 0 33.3%;
      width: 0;

      // background-color: aqua;
      &__container {
        padding: 20px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
    }
  }
  .pic-modal {
    // background-color: antiquewhite;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 0px 100px;
    box-sizing: border-box;
    z-index: 10;
    &__content {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    img:active {
      opacity: 0.5;
    }
    &__icon-close {
      position: absolute;
      right: 40px;
      top: 20px;
      width: 50px;
      opacity: 0.7;
      cursor: pointer;
    }
    &__icon-left {
      position: absolute;
      left: 40px;
      width: 50px;
      top: calc(50vh - 25px);
      opacity: 0.5;
      cursor: pointer;
    }
    &__icon-right {
      position: absolute;
      right: 40px;
      width: 50px;
      top: calc(50vh - 25px);
      opacity: 0.5;
      cursor: pointer;
    }
    p {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      font-weight: 900;
      opacity: 0.7;
    }
  }
}
</style>
