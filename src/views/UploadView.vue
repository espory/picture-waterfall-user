<template>
  <div class="container">
    <upload-home
      v-if="isShowUploadHome"
      :handleFileUpload="handleFileUpload"
      :uploadTypes="uploadTypes"
      :isMobileDevice="isMobileDevice"
    />
    <upload-form
      :picNavActiveId="picNavActiveId"
      :handlePicNavClick="handlePicNavClick"
      :handleFileUpload="handleFileUpload"
      :uploadTypes="uploadTypes"
      :showFileList="showFileList"
      :updateFileForm="updateFileForm"
      :fileStatus="fileStatus"
      :handlePanelRemove="handlePanelRemove"
      :handleFilesCreate="handleFilesCreate"
      :isMobileDevice="isMobileDevice"
      v-else
    />
  </div>
</template>

<script>
import UploadHome from "../components/Upload/UploadHome.vue";
import UploadForm from "../components/Upload/UploadForm.vue";
import { postUploadFile, postCreateFiles } from "../service";
export default {
  name: "UploadView",
  components: {
    UploadHome,
    UploadForm,
  },
  props: {
    isMobileDevice: Boolean,
  },
  data: function () {
    return {
      picNavActiveId: 0,
      fileList: [], // id, file, uploadStatus, tmpPath, username, title, intro, type, other
      // 图片上传的方式：拖拽上传 或 input 上传
      uploadTypes: {
        DROP: "DROP",
        INPUT: "INPUT",
      },
      fileStatus: {
        REDY: "REDY", // 图片准备上传
        UPLOADING: "UPLOADING", //正在上传
        DONE: "DONE", //上传完成
      },
    };
  },
  watch: {
    fileList: {
      handler(newfileList) {
        console.log(newfileList, "new1");
        const needPostItems = newfileList.filter(
          (item) => item.uploadStatus === this.fileStatus.REDY
        );
        for (let index = 0; index < needPostItems.length; index++) {
          const item = needPostItems[index];
          item.uploadStatus = this.fileStatus.UPLOADING;
          //并发上传图片
          postUploadFile({ file: item.file }).then(({ data }) => {
            const { tmpPath } = data;
            console.log(tmpPath);
            item.uploadStatus = this.fileStatus.DONE;
            item.tmpPath = tmpPath;
            console.log(tmpPath);
          });
        }
      },
      // deep: true,
    },

    showFileList(newShowFileList) {
      console.log(newShowFileList);
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
    updateFileForm(id, attr, value) {
      const fileForm = this.fileList.find((item) => item.id === id);
      if (fileForm) {
        fileForm[attr] = value;
      }
    },
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
        document.getElementsByClassName("nav")[0].clientHeight + 10 ?? 0;
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
    handlePanelRemove(id) {
      const inx = this.fileList.findIndex((item) => item.id === id);
      if (inx !== -1) {
        this.fileList.splice(inx, 1);
      }
    },
    handlePicNavClick(index) {
      this.scrollTo(index);
      // this.picNavActiveId = id;
    },
    async handleFilesCreate(fileInfoList) {
      console.log(fileInfoList);
      const { status } = await postCreateFiles(fileInfoList);
      if (status === 200) {
        this.$router.push("/result");
      }
    },
    async handleFileUpload(e, type) {
      if (type === this.uploadTypes.DROP) {
        e.preventDefault();
      }
      let files = null;
      switch (type) {
        case this.uploadTypes.DROP:
          files = e.dataTransfer.files;
          break;
        case this.uploadTypes.INPUT:
          files = e.target.files;
          break;
        default:
          throw new Error("file upload error!");
      }
      const tempNewFileList = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        tempNewFileList.push({
          id: Math.random().toString(36).slice(-8),
          file,
          uploadStatus: this.fileStatus.REDY,
          tmpPath: null,
          username: "espory",
          title: "",
          intro: "",
          type: "",
          other: "",
        });
        //并发上传图片
        // postUploadFile({ file }).then((res) => {
        //   console.log(res);
        // });
      }
      this.fileList.push(...tempNewFileList);
    },
  },
};
</script>

<style scoped lang="less">
.container {
}
</style>
