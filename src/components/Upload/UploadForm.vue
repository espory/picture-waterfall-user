<template>
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
            src="../../assets/plus.png"
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
          v-for="({ id, imgURL }, index) in showFileList"
          :key="id"
          :class="{
            form__left__card: true,
            'form__left__card-selected': picNavActiveId === index,
          }"
          @click="handlePicNavClick(index)"
        >
          <img class="form__left__card__img" :src="imgURL" alt="" />
        </div>
      </div>
    </div>
    <div class="form__right">
      <div
        class="panel"
        v-for="{ id, imgURL, ...info } in showFileList"
        :key="id"
      >
        <div class="panel__item">
          <div class="panel__item__img-container">
            <img
              :class="[
                'panel__item__img',
                {
                  'common-img-loading':
                    info.uploadStatus === FILE_STATUS.UPLOADING,
                },
              ]"
              :src="imgURL"
              alt=""
            />
            <div
              v-if="info.uploadStatus === FILE_STATUS.UPLOADING"
              class="common-loader"
            ></div>
          </div>
          <div class="panel__item__placeholder"></div>
          <div class="panel__item__form">
            <div
              v-for="attr in ['title', 'intro', 'type', 'other']"
              class="panel__item__form__card"
              :key="attr"
            >
              <div class="panel__item__form__card__title">
                <span>{{ formName[attr] }} </span>
                <span style="color: #bfbfbf">(选填)</span>
              </div>
              <input
                class="common-input panel__item__form__card__input"
                type="text"
                :value="info[attr]"
                @change="updateFileForm(id, attr, $event.target.value)"
                :placeholder="'请补充' + formName[attr]"
              />
            </div>
          </div>
        </div>
        <button
          class="common-button item-remove"
          @click="handlePanelRemove(id)"
        >
          <img src="../../assets/trash.png" style="width: 24px" alt="" />
        </button>
      </div>
    </div>
    <div class="form__footer">
      <div class="form__footer__content">
        <div
          :class="[
            'form__footer__content__mention',
            { form__footer__content__mention__pending: !uploadDone },
          ]"
        >
          <img
            src="../../assets/success.png"
            style="width: 20px; margin-right: 10px"
            alt=""
          />
          已上传 {{ hasDoneNume }} 张图片 ( 共计 {{ uploadSum }} 张 )
        </div>
        <button
          class="common-button form__footer__content__button"
          :disabled="!uploadDone"
          @click="handleFilesCreate(fileInfoList)"
        >
          提交内容
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "UploadForm",
  props: {
    picNavActiveId: Number,
    UPLOAD_TYPES: Object,
    handlePicNavClick: Function,
    handleFileUpload: Function,
    showFileList: Array,
    updateFileForm: Function,
    FILE_STATUS: Object,
    handlePanelRemove: Function,
    handleFilesCreate: Function,
  },
  data: function () {
    return {
      formName: {
        title: "标题",
        intro: "介绍",
        type: "类型",
        other: "其他",
      },
    };
  },
  created: function () {
    console.log("FILE_STATUS", this.FILE_STATUS);
    console.log("showFileList", this.showFileList);
  },
  computed: {
    hasDoneNume: function () {
      return this.showFileList.filter(
        (item) => item.uploadStatus === this.FILE_STATUS.DONE
      ).length;
    },
    uploadSum: function () {
      return this.showFileList.length;
    },
    uploadDone: function () {
      return this.hasDoneNume === this.uploadSum;
    },
    fileInfoList: function () {
      return this.showFileList.map(
        ({ tmpPath, username, title, intro, type, other }) => {
          return { tmpPath, username, title, intro, type, other };
        }
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
        object-fit: cover;
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
        &__img-container {
          flex: 1 0 48%;
          width: 0;
          display: block;
          background-color: #000;
          border-radius: 10px;
          position: relative;
        }
        &__img {
          // flex: 1 0 48%;
          width: 100%;
          display: block;
          // background-color: white;
          border-radius: 10px;
        }
        // &__img-loading {
        //   opacity: 0.7;
        // }
        // &__img-loader {
        //   position: absolute;
        //   top: calc(50% - 40px);
        //   left: calc(50% - 30px);
        // }

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
      &__mention__pending {
        color: rgb(50, 37, 37);
      }
      &__button {
        width: 125px;
        height: 50px;
      }
      &__button:disabled {
        background-color: gray;
        cursor: not-allowed;
      }
      &__button:disabled:active {
        opacity: 1;
        // background-color: gray;
        // cursor: not-allowed;
      }
    }
  }
}
</style>
