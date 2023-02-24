<template>
  <div class="container">
    <h1 v-if="this.pictureList.length === 0">暂无图片，请先去上传</h1>
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
          <img
            :src="pic.path"
            alt=""
            :class="{
              'common-img-loading': pic.status === picTypes.LOADING,
            }"
            @load="handleImgLoad(pic.index)"
            @click="handleImgClick(pic.index)"
          />
          <div
            v-if="pic.status === picTypes.LOADING"
            class="common-loader"
          ></div>
        </div>
      </div>
    </div>
    <div class="waterfall__footer" ref="waterfallFooter"></div>
    <div v-if="isRequesting" class="common-loader bottom-loader"></div>

    <div v-if="mask.show" class="pic-modal">
      <img
        :class="[
          'pic-modal__content',
          {
            'common-img-loading': mask.status === picTypes.LOADING,
          },
        ]"
        :src="pictureList[mask.index].path.replace('small-', '')"
        @load="mask.status = picTypes.DONE"
      />
      <div v-if="mask.status === picTypes.LOADING" class="common-loader"></div>
      <img
        class="pic-modal__option pic-modal__option-close"
        src="../../assets/close.png"
        @click="handleMaskClose"
      />
      <img
        @click="handlePicJump('last')"
        class="pic-modal__option pic-modal__option-left"
        src="../../assets/angle-left.png"
      />
      <img
        @click="handlePicJump('next')"
        class="pic-modal__option pic-modal__option-right"
        src="../../assets/angle-right.png"
      />
      <p>{{ mentionText }}</p>
    </div>
  </div>
</template>

<script>
import { postGetPics } from "../../service";
import { HOST } from "../../common/fetch";
const debounce = require("lodash.debounce");
export default {
  name: "PictureWaterfall",
  props: {
    isMobileDevice: Boolean,
  },
  data: function () {
    return {
      offset: 0,
      limit: 20,
      done: false,
      //瀑布流列数
      pictureList: [],
      //控制图片遮罩层
      mask: {
        show: false,
        index: 0,
        status: "LOADING",
        // rawScrollTop: 0, //记录弹出遮罩层前，滚动高度，方便后续还原
      },
      //避免图片请求冲突
      isRequesting: false,
      // 图片加载状态
      picTypes: {
        LOADING: "LOADING",
        DONE: "DONE",
      },
      io: null,
    };
  },
  computed: {
    picKeys: function () {
      return this.pictureList.map((item) => item.id);
    },
    showPictureCols: function () {
      const showColNum = this.isMobileDevice ? 2 : 3;
      const res = new Array(showColNum).fill(null).map(() => []);
      for (let index = 0; index < this.pictureList.length; index++) {
        const pic = this.pictureList[index];
        res[index % showColNum].push(pic);
      }
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
    // window.addEventListener("scroll", this.onScroll, false);
    window.addEventListener("touchstart", this.onTouchstart, false);
    window.addEventListener("touchmove", this.onTouchmove, false);
    window.addEventListener("touchend", this.onTouchend, false);
    this.io = new IntersectionObserver(this.onHandleObserve);
    this.io.observe(this.$refs.waterfallFooter);
  },
  destroy() {
    // 移除监听器，不然当该vue组件被销毁了，监听器还在
    // window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("touchstart", this.onTouchstart);
    window.removeEventListener("touchmove", this.onTouchmove);
    window.removeEventListener("touchend", this.onTouchend);

    // 关闭观察器
    this.io.unobserve(this.$refs.waterfallFooter);
    this.io.disconnect();
  },
  methods: {
    onTouchstart(e) {
      //记录初始滑动位置，只有在顶部进行下拉才有效
      this.startPos =
        document.documentElement.scrollTop === 0
          ? e.changedTouches[0].clientY
          : Infinity;
    },
    onTouchmove() {},
    onTouchend(e) {
      const endPos = e.changedTouches[0].clientY;
      if (endPos - this.startPos > 100) {
        console.log("触发更新");
        this.offset = 0;
        this.limit = 20;
        this.done = false;
        //瀑布流列数
        this.pictureList = [];
        this.getPics();
      }
    },
    async getPics() {
      this.isRequesting = true;
      const { data, done } = await postGetPics(this.limit, this.offset);
      //防止重复添加
      const filterData = data.filter((item) => !this.picKeys.includes(item.id));
      filterData.forEach((pic) => {
        // 为了加快首屏渲染，初始加载缩略图，点击图片展示大图
        pic.path = `${HOST}/small-${pic.path}`;
        pic.status = this.picTypes.LOADING; //初始页面处于loading 状态
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
    // onScroll() {
    //   const { scrollTop, clientHeight, scrollHeight } =
    //     document.documentElement;
    //   //如果滚轮触底
    //   if (scrollTop + clientHeight >= scrollHeight) {
    //     this.onRequestPics();
    //   }
    // },
    onHandleObserve(entries) {
      console.log(entries);
      // 如果不可见，就返回
      if (entries[0].intersectionRatio <= 0) return;
      this.onRequestPics();
    },
    onRequestPics: debounce(function () {
      // 请求接口，如果后端数据全拿到了或者正在发起请求，则略过
      console.log(111);
      if (!this.done && !this.isRequesting) {
        this.getPics();
      }
    }, 300),

    handleImgClick(index) {
      this.mask.show = true;
      document.body.style.overflow = "hidden";
      this.mask.index = index;
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
            this.mask.status = this.picTypes.LOADING;
          }
          break;
        case "last":
          if (this.mask.index > 0) {
            this.mask.index -= 1;
            this.mask.status = this.picTypes.LOADING;
          }
          break;
        default:
          console.error("图片切换无此选项");
          break;
      }
    },
    handleImgLoad(index) {
      this.pictureList[index].status = this.picTypes.DONE;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  padding: 20px 0;
  margin: 0 10vw;
  // display: none;
  .waterfall {
    min-height: 90vh;
    display: flex;
    justify-content: space-between;
    // display: none;
    &__col {
      flex: 0 0 33.3%;
      width: 0;

      // background-color: aqua;
      &__container {
        position: relative;
        min-height: 20vh;
        padding: 20px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
    }
    &__footer {
      width: 100%;
      height: 20vh;
    }
  }
  .bottom-loader {
    position: static;
    margin-top: 30px;
    width: 30px;
    height: 30px;
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
    // img:active {
    //   opacity: 0.5;
    // }
    &__content {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &__option {
      position: absolute;
      cursor: pointer;
      border-radius: 50%;
      border: 0;
      background-color: rgb(255, 255, 255);
    }
    &__option:active {
      background-color: rgb(91, 147, 211);
    }
    &__option-close {
      right: 10px;
      top: 20px;
      width: 40px;
    }

    &__option-left {
      left: 10px;
      width: 40px;
      top: calc(50vh - 25px);
    }

    &__option-right {
      right: 10px;
      width: 40px;
      top: calc(50vh - 25px);
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

@media (min-width: 1200px) {
}

@media only screen and (max-width: 1199px) and (min-width: 992px) {
}

@media only screen and (max-width: 767px) {
  .container {
    margin: 0 5px;
    .waterfall__col {
      flex: 0 0 50%;
      &__container {
        padding: 10px;
      }
    }
    .pic-modal {
      padding: 8vh 0;
      p {
        bottom: 20px;
        margin: 0;
        font-size: 24px;
        font-weight: 900;
        color: white;
      }
      &__option-close {
        right: 10px;
        top: 20px;
        width: 40px;
      }

      &__option-left {
        left: 10px;
        width: 40px;
        top: auto;
        bottom: 10px;
        z-index: 20;
      }

      &__option-right {
        right: 10px;
        width: 40px;
        top: auto;
        bottom: 10px;
        z-index: 20;
      }
    }
  }
  .nav__container__mid {
    display: none;
  }
}
</style>
