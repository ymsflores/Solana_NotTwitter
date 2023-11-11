export default [
  {
    name: "Home",
    path: "/",
    component: require("@/components/PageHome").default,
  },
  {
    name: "Profile",
    path: "/profile",
    component: require("@/components/PageProfile").default,
  },
  {
    name: "Tweet",
    path: "/tweet/:tweet",
    component: require("@/components/PageTweet").default,
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)*",
    component: require("@/components/PageNotFound").default,
  },
];
