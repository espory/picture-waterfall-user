<template>
  <div class="container">
    <upload-home v-if="isShowUpload" />
    <upload-form
      :pic-nav-active-id="picNavActiveId"
      :handlePicNavClick="handlePicNavClick"
      v-else
    />
  </div>
</template>

<script>
import UploadHome from "../components/Upload/UploadHome.vue";
import UploadForm from "../components/Upload/UploadForm.vue";
export default {
  name: "UploadView",
  components: {
    UploadHome,
    UploadForm,
  },
  data: function () {
    return {
      picNavActiveId: 0,
      fileList: [1],
    };
  },
  mounted() {
    // 监听滚动事件，设置锚点定位
    window.addEventListener("scroll", this.onScroll, false);
  },
  destroy() {
    // 移除监听器，不然当该vue组件被销毁了，监听器还在
    window.removeEventListener("scroll", this.onScroll);
  },

  computed: {
    //控制图片上传组件与 form 组件的切换
    isShowUpload() {
      return this.fileList.length === 0;
    },
  },
  methods: {
    onScroll() {
      // 获取所有锚点元素
      const navContents = document.querySelectorAll(".panel");
      // 所有锚点元素的 offsetTop
      const offsetTopArr = [];
      navContents.forEach((item) => {
        offsetTopArr.push(item.offsetTop);
      });
      // 获取当前文档流的 scrollTop
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // 定义当前点亮的导航下标
      let navIndex = 0;
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是n了
        const headerHeight =
          document.getElementsByClassName("nav")[0].clientHeight ?? 0;
        const footerHeight =
          document.getElementsByClassName("form__footer")[0].clientHeight ?? 0;
        const vh = document.documentElement.clientHeight;
        const el = navContents[n];
        const { top = 0, bottom = 0 } = el.getBoundingClientRect() ?? {};
        //当该内容完全置于区域内，优先（考虑最后一个元素无法被定位的问题
        if (top > headerHeight && bottom < vh - footerHeight) {
          navIndex = n;
          break;
          // } else if (scrollTop + headerHeight >= offsetTopArr[n]) {
        } else if (scrollTop + headerHeight >= offsetTopArr[n]) {
          navIndex = n;
        }
      }
      this.picNavActiveId = navIndex;
    },
    scrollTo(index) {
      const headerHeight =
        document.getElementsByClassName("nav")[0].clientHeight + 25 ?? 0;
      // 获取目标的 offsetTop(考虑到 header)
      // css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1
      const targetOffsetTop =
        document.querySelector(`.panel:nth-child(${index + 1})`).offsetTop -
        headerHeight;

      // 获取当前 offsetTop
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉
      const STEP = 50;
      // 判断是往下滑还是往上滑
      if (scrollTop > targetOffsetTop) {
        // 往上滑
        smoothUp();
      } else {
        // 往下滑
        smoothDown();
      }
      // 定义往下滑函数
      function smoothDown() {
        // 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
        if (scrollTop < targetOffsetTop) {
          // 如果和目标相差距离大于等于 STEP 就跳 STEP
          // 否则直接跳到目标点，目标是为了防止跳过了。
          if (targetOffsetTop - scrollTop >= STEP) {
            scrollTop += STEP;
          } else {
            scrollTop = targetOffsetTop;
          }
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          requestAnimationFrame(smoothDown);
        }
      }
      // 定义往上滑函数
      function smoothUp() {
        if (scrollTop > targetOffsetTop) {
          if (scrollTop - targetOffsetTop >= STEP) {
            scrollTop -= STEP;
          } else {
            scrollTop = targetOffsetTop;
          }
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          requestAnimationFrame(smoothUp);
        }
      }
    },

    handlePicNavClick(id) {
      this.scrollTo(id);
      // this.picNavActiveId = id;
    },
  },
};
</script>

<style scoped lang="less">
.container {
}
</style>
