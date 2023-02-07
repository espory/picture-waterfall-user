<template>
  <PictureWaterfall :isMobileDevice="isMobileDevice" />
</template>

<script>
// @ is an alias to /src
import PictureWaterfall from "@/components/PictureWaterfall";

export default {
  name: "HomeView",
  components: {
    PictureWaterfall,
  },
  props: {
    isMobileDevice: Boolean,
  },
};
</script>
