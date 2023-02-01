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
            <div class="form__left__card">
              <img
                class="form__left__card__img"
                src="../assets/demo.png"
                alt=""
              />
            </div>
            <div class="form__left__card form__left__card-selected">
              <img
                class="form__left__card__img"
                src="../assets/demo.png"
                alt=""
              />
            </div>

            <div class="form__left__card">
              <img
                class="form__left__card__img"
                src="../assets/demo.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="form__right">
          <div class="panel" v-for="item in [1, 2, 3]" :key="item">
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
    };
  },
  computed: {
    //控制图片上传组件与 form 组件的切换
    isShowUpload() {
      return this.fileList.length === 0;
    },
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
