<template>
  <section
    class="upload"
    @dragenter="preventDragDefault"
    @dragover="preventDragDefault"
    @drop="handleFileUpload($event, UPLOAD_TYPES.DROP)"
  >
    <!-- <span class="upload__status">(0/20)</span> -->
    <img class="upload__logo" alt="images" src="../../assets/images.png" />
    <h3 v-if="!isMobileDevice" class="upload__title">
      将图片拖拽到此处<br />上传，或者
    </h3>
    <h3 v-else class="upload__title">点击上传图片</h3>
    <div class="upload__bottom">
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
  </section>
</template>

<script>
export default {
  name: "UploadHome",
  props: {
    UPLOAD_TYPES: Object,
    handleFileUpload: Function,
    isMobileDevice: Boolean,
  },
  data: function () {
    return {};
  },
  methods: {
    preventDragDefault(e) {
      e.preventDefault();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.upload {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  margin: 50px 20% 30px;
  padding: 100px 0;
  border-radius: 30px;
  background: url("../../assets/upload-bg.svg");

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
@media only screen and (max-width: 767px) {
  .upload {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
