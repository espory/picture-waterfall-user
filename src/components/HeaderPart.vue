<template>
  <nav class="nav">
    <div class="nav__container">
      <div class="nav__container__left">
        <img
          class="nav__container__left__logo"
          alt="logo"
          src="../assets/logo.png"
        />
        <span class="nav__container__left__name">Waterfall</span>
      </div>
      <div v-if="!isMobileDevice" class="nav__container__mid">
        <input
          class="common-input nav__container__mid__input"
          type="text"
          placeholder="搜索感兴趣的图片"
        />
        <button class="nav__container__mid__button">
          <svg
            t="1675151553511"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2684"
            width="32"
            height="32"
          >
            <path
              d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6c3.2 3.2 8.4 3.2 11.6 0l43.6-43.5c3.2-3.2 3.2-8.4 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
              fill="#8a8a8a"
              p-id="2685"
            ></path>
          </svg>
        </button>
      </div>
      <div class="nav__container__right">
        <button class="common-button nav-button" @click="jump(info.path)">
          {{ info.title }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HeaderPart",
  props: {
    isMobileDevice: Boolean,
  },
  data: function () {
    return {
      info: {
        title: "上传图片",
        path: "/upload",
      },
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: function () {
      const pathname = window.location.pathname;
      console.log(pathname);
      if (pathname.includes("upload")) {
        this.info = {
          title: "返回首页",
          path: "/",
        };
      } else {
        this.info = {
          title: "上传图片",
          path: "/upload",
        };
      }
    },
  },
  methods: {
    jump(path) {
      this.$router.push(path);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  height: 80px;
  box-shadow: 0 1px 0 #f7f7f7;
  background-color: white;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    height: 80px;
    &__left {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 15%;
      &__logo {
        width: 40px;
        height: 40px;
      }
      &__name {
        padding: 0 25px 0 15px;
        font-size: 20px;
        font-weight: bold;
        font-family: monaco, Consolas, "Lucida Console", monospace;
      }
    }
    &__mid {
      // width: 100%;
      flex: auto;
      height: 50px;
      display: flex;
      &__input {
        border-radius: 8px 0px 0px 8px;
      }
      &__input:focus {
        outline: none;
        border: none;
      }
      &__button {
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 15px;
        padding-left: 15px;
        cursor: pointer;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border: 1px solid #f7f7f7;
        background: #f7f7f7;
      }
    }
    &__right {
      flex: 0 0 15%;
      .nav-button {
        width: 80px;
        height: 50px;
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  .nav {
    &__container {
      &__right {
        .nav-button {
          width: 100px;
        }
      }
    }
  }
}
</style>
