<template>
  <div class="container">
    <div
      class="upload"
      @dragenter="preventDragDefault"
      @dragover="preventDragDefault"
      @drop="handleFileUpload($event, UPLOAD_TYPES.DROP)"
    >
      <!-- <span class="upload__status">(0/20)</span> -->
      <img class="upload__logo" alt="images" src="../assets/images.png" />
      <h3 class="upload__title">将图片拖拽到此处<br />上传，或者</h3>
      <div class="upload__bottom">
        <!-- <button
          @click="handleFileUpload"
          class="common-button"
          style="width: 100px; height: 40px"
        >
          选择上传
        </button> -->

        <label
          for="imageUpload"
          class="common-button common-label-button"
          style="width: 100px; height: 40px"
          >选择上传</label
        >
        <input
          type="file"
          id="imageUpload"
          style="display: none"
          name="imageUpload"
          accept="image/png, image/jpeg, image/gif"
          multiple
          @change="handleFileUpload($event, UPLOAD_TYPES.INPUT)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadView",
  components: {},
  data: () => {
    return {
      // 文件上传的方式：拖拽上传 或 input 上传
      UPLOAD_TYPES: {
        DROP: "DROP",
        INPUT: "INPUT",
      },
    };
  },
  methods: {
    preventDragDefault(e) {
      e.preventDefault();
    },
    handleFileUpload(e, type) {
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
      console.log(files);
    },
    // handleFileDrop(e) {
    //   const files = e.dataTransfer.files;
    //   this.fileUpload(files);
    //   e.preventDefault();
    // },
    // handleFileInputChange(e) {
    //   const files = e.target.files;
    //   this.fileUpload(files);
    // },
    // fileUpload(fileList) {
    //   console.log(fileList);
    // },
  },
};
</script>

<style scoped lang="less">
.container {
  padding-right: 20%;
  padding-left: 20%;
  .upload {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    margin: 50px auto 30px;
    padding: 100px 0;
    border-radius: 30px;
    background: url("../assets/upload-bg.svg");

    &__logo {
      width: 80px;
      height: 80px;
    }
    &__status {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 12px;
      color: #bfbfbf;
      fill: #bfbfbf;
      font-family: PlusJakartaSans;
    }
    &__title {
      margin: 30px 0;
    }
    &__bottom {
      &__button {
      }
    }
  }
}
</style>
