<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-if="showSidebar" v-model="drawer" app>
        <SidebarComponent />
      </v-navigation-drawer>

      <v-app-bar v-if="showSidebar" app>
        <v-app-bar-nav-icon @click="swichSidebar"></v-app-bar-nav-icon>

        <!-- <v-toolbar-title>投票アプリ</v-toolbar-title> -->
      </v-app-bar>

      <v-main>
        <router-view
          @drawer-controll="
            drawer = $event;
            removeSidebar();
          "
        />
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
    drawer: false,
    showSidebar: true,
  }),
  created() {
    //  if (this.$route.path.match(/login$/) || this.$route.path.match(/signup$/)) {
    //    this.showSidebar = false;
    //  } else {
    //    this.showSidebar = true;
    //  }
  },
  mounted() {
    //  if (this.$route.path.match(/login$/) || this.$route.path.match(/signup$/)) {
    //    this.showSidebar = false;
    //  } else {
    //    this.showSidebar = true;
    //  }
    //  console.log(this.showSidebar);
    //  if (this.$route.name === "open") {
    //    console.log(this.drawer);
    //    this.drawer = false;
    //    console.log(this.drawer);
    //  }
    //  console.log(this.$route.name);
    //  if(this.$route.name === ) {
    //  }
  },
  beforeUpdate() {
    if (this.$route.path.match(/login$/) || this.$route.path.match(/signup$/)) {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
    //  console.log(this.showSidebar);
    //  if (this.$route.name === "open") {
    //    this.drawer = !this.drawer;
    //  }
  },
  methods: {
    swichSidebar() {
      this.drawer = !this.drawer;
    },
    removeSidebar() {
      this.showSidebar = false;
    },
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
.v-sheet {
  z-index: 9998;
}
.v-navigation-drawer {
  z-index: 9999;
}
</style>

<style>
.v-snack,
.v-snack:not(.v-snack--absolute) {
  z-index: 10000 !important;
}
</style>