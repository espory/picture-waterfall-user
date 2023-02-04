<template>
  <div class="container">
    <div class="waterfall">
      <div
        v-for="(picCol, index) in showPictureCols"
        :key="index"
        class="waterfall__col"
      >
        <div
          v-for="pic in picCol"
          :key="pic.id"
          class="waterfall__col__container"
        >
          <img :src="pic.path" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postGetPics } from "../../service";
import { HOST } from "../../common/fetch";
export default {
  name: "PictureWaterfall",
  props: {},
  data: function () {
    return {
      offset: 0,
      limit: 20,
      done: false,
      showColNum: 3, //瀑布流一排 3 列
      pictureList: [],
    };
  },
  computed: {
    picKeys: function () {
      return this.pictureList.map((item) => item.id);
    },
    showPictureCols: function () {
      const res = new Array(this.showColNum).fill(null).map(() => []);
      for (let index = 0; index < this.pictureList.length; index++) {
        const pic = this.pictureList[index];
        pic.path = `${HOST}/${pic.path}`;
        res[index % this.showColNum].push(pic);
      }
      console.log(123, res);
      return res;
    },
  },
  created: async function () {
    const { data, done } = await postGetPics(this.limit, this.offset);
    console.log(data, done);
    //防止重复添加
    const filterData = data.filter((item) => !this.picKeys.includes(item.id));
    this.pictureList.push(...filterData);
    this.done = done;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  padding: 20px 0;
  margin: 0 120px;
  // background-color: antiquewhite;
  .waterfall {
    display: flex;
    justify-content: space-between;
    &__col {
      flex: 0 0 33.3%;
      width: 0;

      // background-color: aqua;
      &__container {
        padding: 20px;
        img {
          width: 100%;
        }
      }
    }
    &__col-1 {
      flex: 0 0 33.3%;
      width: 0;

      // background-color: aqua;
      &__container {
        padding: 20px;
        img {
          width: 100%;
        }
      }
    }
    &__col-2 {
      flex: 0 0 33.3%;
      width: 0;

      // background-color: aquamarine;
      &__container {
        padding: 20px;
        img {
          width: 100%;
        }
      }
    }
    &__col-3 {
      flex: 0 0 33.3%;
      width: 0;

      background-color: red;
      &__container {
        padding: 20px;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
