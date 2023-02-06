<template>
  <div id="app">
    <!-- 由于nav fixed 定位会”内陷“，因此添加此 div 进行占位 -->
    <div class="nav_placeholder"></div>
    <header-part />
    <router-view />
  </div>
</template>
<script>
import HeaderPart from "./components/HeaderPart.vue";
export default {
  components: { HeaderPart },
};
</script>
<style lang="less">
#app {
  font-family: PlusJakartaSans, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Cantarell, Helvetica Neue, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .nav_placeholder {
    height: 80px;
  }
}
.common-input {
  width: calc(100% - 50px);
  color: #7f7f7f;
  border: 1px solid #f7f7f7;
  background: #f7f7f7;
  padding: 15px 4px 15px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #4a4a4a;
  border: none;
}
.common-input:focus {
  outline: none;
  border: none;
}
.common-button {
  color: #fff;
  border-color: #42a0ff;
  background: #42a0ff;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
}
.common-button:active {
  opacity: 0.8;
}
.common-label-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.common-loader {
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 30px);

  border: 5px solid #f3f3f3;
  border-top: 5px solid #555;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: inline-block;
  animation: spin 2s linear infinite;
}
.common-img-loading {
  opacity: 0.5;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
