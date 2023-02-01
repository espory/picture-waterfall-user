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
</style>
