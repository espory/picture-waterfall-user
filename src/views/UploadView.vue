<template>
  <div class="container">
    <section
      class="upload"
      @dragenter="preventDragDefault"
      @dragover="preventDragDefault"
      @drop="handleFileUpload($event, UPLOAD_TYPES.DROP)"
      v-if="isShowUpload"
    >
      <!-- <span class="upload__status">(0/20)</span> -->
      <img class="upload__logo" alt="images" src="../assets/images.png" />
      <h3 class="upload__title">将图片拖拽到此处<br />上传，或者</h3>
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
    <template v-else>
      <section class="form">
        <div class="form__left">
          <div class="form__left-fixed">
            <label
              for="imageUpload"
              class="common-button common-label-button form__left__button"
              style="width: 80px; height: 80px"
            >
              <img
                class="form__left__button__icon"
                src="../assets/plus.png"
                alt="继续上传"
              />
            </label>
            <input
              type="file"
              id="imageUpload"
              style="display: none"
              name="imageUpload"
              accept="image/png, image/jpeg, image/gif"
              multiple
              @change="handleFileUpload($event, UPLOAD_TYPES.INPUT)"
            />
            <div
              v-for="item in [0, 1, 2]"
              :key="item"
              :class="{
                form__left__card: true,
                'form__left__card-selected': picNavActiveId === item,
              }"
              @click="handlePicNavClick(item)"
            >
              <img
                class="form__left__card__img"
                src="../assets/demo.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="form__right">
          <div class="panel" v-for="item in [0, 1, 2]" :key="item">
            <div class="panel__item">
              <img class="panel__item__img" src="../assets/demo.png" alt="" />
              <div class="panel__item__placeholder"></div>
              <div class="panel__item__form">
                <div
                  v-for="item in [1, 2, 3, 4]"
                  class="panel__item__form__card"
                  :key="item"
                >
                  <div class="panel__item__form__card__title">
                    <span>标题{{ item }} </span>
                    <span style="color: #bfbfbf">(选填)</span>
                  </div>
                  <input
                    class="common-input panel__item__form__card__input"
                    type="text"
                    placeholder="输入标题"
                  />
                </div>
              </div>
            </div>
            <button class="common-button item-remove">
              <img src="../assets/trash.png" style="width: 24px" alt="" />
            </button>
          </div>
        </div>
        <div class="form__footer">
          <div class="form__footer__content">
            <div class="form__footer__content__mention">
              <img
                src="../assets/success.png"
                style="width: 20px; margin-right: 10px"
                alt=""
              />
              已上传 0 张图片 ( 共计 3 张 )
            </div>
            <button class="common-button form__footer__content__button">
              提交内容
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  name: "UploadView",
  components: {},
  data: function () {
    return {
      // 文件上传的方式：拖拽上传 或 input 上传
      UPLOAD_TYPES: {
        DROP: "DROP",
        INPUT: "INPUT",
      },
      fileList: [1],
      picNavActiveId: 0,
    };
  },
  mounted() {
    // 监听滚动事件
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
      // 获取目标的 offsetTop
      // css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1
      const targetOffsetTop = document.querySelector(
        `.panel:nth-child(${index + 1})`
      ).offsetTop;
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
    handlePicNavClick(id) {
      this.scrollTo(id);
      // this.picNavActiveId = id;
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
  .upload {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    margin: 50px 20% 30px;
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
  .form {
    // background-color: antiquewhite;
    margin: 15px 7%;
    display: flex;
    &__left {
      flex: 0 0 90px;

      // background-color: aqua;
      &-fixed {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &__button {
        background-color: #f7f7f7;
        &__icon {
          width: 20px;
          height: 20px;
        }
      }
      &__card {
        width: 85px;
        height: 85px;
        margin-top: 10px;
        border-radius: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &__img {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: clip;
          overflow-clip-margin: content-box;
        }
      }
      &__card-selected {
        border: solid #42a0ff 3px;
      }
    }

    &__right {
      flex: auto;
      margin-left: 80px;
      margin-bottom: 100px;
      // background-color: rgb(22, 26, 26);
      .panel {
        width: 100%;
        // height: 1000px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
        &__item {
          flex: auto;
          width: 0;
          background-color: #f7f7f7;
          padding: 50px 80px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-radius: 20px;
          &__img {
            flex: 1 0 48%;
            width: 0;
            display: block;
            background-color: aquamarine;
            border-radius: 10px;
          }
          &__placeholder {
            flex: 0 0 4%;
          }
          &__form {
            // grow、shrink、basic
            flex: 0 0 48%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            &__card {
              width: 80%;
              text-align: left;
              font-weight: 600;
              font-size: 16px;
              color: #7f7f7f;
              &__title {
                padding: 0 0 8px 1px;
              }
              &__input {
                background-color: white;
                border-color: white;
                border: none;
              }
              &__input::placeholder {
                color: #bfbfbf;
              }
            }
          }
        }
        .item-remove {
          background-color: #f7f7f7;
          margin-left: 40px;
          width: 65px;
          height: 65px;
          border: none;
          border-radius: 50%;
        }
      }
    }
    &__footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      height: 110px;
      background: #f7fbfd;

      &__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        margin: 0 120px;
        &__mention {
          width: 300px;
          height: 54px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #42a0ff;
          font-weight: 700;
        }
        &__button {
          width: 125px;
          height: 50px;
        }
      }
    }
  }
}
</style>
