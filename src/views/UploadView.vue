<template>
  <div class="container">
    <upload-home
      v-if="isShowUploadHome"
      :handleFileUpload="handleFileUpload"
      :UPLOAD_TYPES="UPLOAD_TYPES"
    />
    <upload-form
      :picNavActiveId="picNavActiveId"
      :handlePicNavClick="handlePicNavClick"
      :handleFileUpload="handleFileUpload"
      :UPLOAD_TYPES="UPLOAD_TYPES"
      :showFileList="showFileList"
      :FILE_STATUS="FILE_STATUS"
      v-else
    />
  </div>
</template>

<script>
import UploadHome from "../components/Upload/UploadHome.vue";
import UploadForm from "../components/Upload/UploadForm.vue";
import { postUploadFile } from "../service";
export default {
  name: "UploadView",
  components: {
    UploadHome,
    UploadForm,
  },
  data: function () {
    return {
      picNavActiveId: 0,
      fileList: [], // { id: 0, file: null, done: 0 }
      // 图片上传的方式：拖拽上传 或 input 上传
      UPLOAD_TYPES: {
        DROP: "DROP",
        INPUT: "INPUT",
      },
      FILE_STATUS: {
        REDY: "REDY", // 图片准备上传
        UPLOADING: "UPLOADING", //正在上传
        DONE: "DONE", //上传完成
      },
    };
  },
  watch: {
    fileList: {
      handler(newfileList) {
        console.log(newfileList, "new");
        const needPostItems = newfileList.filter(
          (item) => item.status === this.FILE_STATUS.REDY
        );
        for (let index = 0; index < needPostItems.length; index++) {
          const item = needPostItems[index];
          item.status = this.FILE_STATUS.UPLOADING;
          //并发上传图片
          postUploadFile({ file: item.file }).then((res) => {
            item.status = this.FILE_STATUS.DONE;
            console.log(res);
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    //控制图片上传组件与 form 组件的切换
    isShowUploadHome() {
      return this.fileList.length === 0;
    },
    showFileList: function () {
      return this.fileList.map((item) => {
        return { imgURL: URL.createObjectURL(item.file), ...item };
      });
    },
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
    async handleFileUpload(e, type) {
      if (type === this.UPLOAD_TYPES.DROP) {
        e.preventDefault();
      }
      let files = null;
      switch (type) {
        case this.UPLOAD_TYPES.DROP:
          files = e.dataTransfer.files;
          break;
        case this.UPLOAD_TYPES.INPUT:
          files = e.target.files;
          break;
        default:
          throw new Error("file upload error!");
      }
      const startIndex = this.fileList?.length || 0;
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        this.fileList.push({
          id: startIndex + index,
          file,
          status: this.FILE_STATUS.REDY,
        });
        //并发上传图片
        // postUploadFile({ file }).then((res) => {
        //   console.log(res);
        // });
      }
    },
  },
};
</script>

<style scoped lang="less">
.container {
}
</style>
