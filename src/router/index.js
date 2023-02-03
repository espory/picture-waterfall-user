import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import UploadView from "../views/UploadView.vue";
import ResultView from "../views/ResultView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/a",
    name: "home",
    component: HomeView,
  },
  {
    path: "/",
    name: "upload",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    component: UploadView,
  },
  {
    path: "/b",
    name: "result",
    component: ResultView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
