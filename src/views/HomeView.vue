<template>
  <div class="home">
    <Home />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Home from "@/components/Home";

export default {
  name: "HomeView",
  components: {
    Home,
  },
};
</script>
