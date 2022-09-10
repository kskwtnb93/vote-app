<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-if="showSidebar" v-model="drawer" app>
        <SidebarComponent />
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
          v-if="showSidebar"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>投票アプリ</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SidebarComponent from "@/components/Layouts/SidebarComponent";

export default {
  components: {
    SidebarComponent,
  },
  mounted() {},
  data: () => ({
    drawer: false,
    showSidebar: true,
  }),
  beforeUpdate() {
    if (this.$route.path.match(/login$/) || this.$route.path.match(/signup$/)) {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
    //  console.log(this.showSidebar);
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
