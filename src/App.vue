<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <SidebarComponent />
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Application</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <!--  -->
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
  data: () => ({
    drawer: null,
    //  selectedItem: 0,
    //  links: [
    //    ["mdi-home", "Home", "/"],
    //    ["mdi-send", "About", "/about"],
    //  ],
  }),
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
