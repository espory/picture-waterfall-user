<template>
  <div class="container">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="check-circle"
      width="64"
      height="64"
      fill="#52c41a"
      aria-hidden="true"
    >
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
      ></path>
    </svg>
    <div class="content">图片上传成功，等待管理员审核</div>
    <div class="button-footer">
      <button
        class="common-button button-footer__button-main"
        @click="jump('/upload')"
      >
        继续上传
      </button>
      <button
        class="common-button button-footer__button-normal"
        @click="jump('/home')"
      >
        完成
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultView",
  methods: {
    jump(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  margin-top: 10%;

  .content {
    color: rgba(0, 0, 0, 0.88);
    font-size: 24px;
    font-weight: 400;
    margin: 30px 0;
  }
  .button-footer {
    &__button-main {
      font-size: 16px;
      //   width: 90px;
      //   height: 32px;
      padding: 10px 25px;
      border-radius: 6px;
      margin-right: 10px;
      background-color: #1777ff;
      font-weight: normal;
      color: white;
    }
    &__button-main:active {
      background-color: #2982fe;
    }
    &__button-normal {
      font-size: 16px;
      padding: 10px 25px;
      border-radius: 6px;
      margin-right: 5px;
      background-color: white;
      color: black;
      font-weight: normal;
      border-color: rgb(209, 206, 206);
    }
    &__button-normal:active {
      background-color: rgb(242, 240, 240);
    }
  }
}
</style>
