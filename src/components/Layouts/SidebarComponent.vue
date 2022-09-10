<template>
  <div>
    <v-list>
      <v-list-item class="avatar">
        <v-list-item-avatar class="avatar__pic">
          <v-avatar color="indigo">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ auth && auth.displayName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ auth && auth.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="[icon, text, to] in links"
          :key="icon"
          :to="to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    selectedItem: 0,
    links: [
      ["mdi-format-list-bulleted", "投票ルーム一覧", "/"],
      // ["mdi-login", "Login", "/login"],
      // ["mdi-logout", "Signup", "/signup"],
    ],
    auth: null,
    //  dialog: false,
    //  name: "",
    //  date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    //    .toISOString()
    //    .substr(0, 10),
    //  menu1: false,
  }),
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
  },
  methods: {
    getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
        return user;
      });
    },
    logout() {
      console.log("logout");
      firebase
        .auth()
        .signOut()
        .then(() => {
          sessionStorage.removeItem("user");
          localStorage.message = "ログアウトしました。";
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //  async createRoom() {
    //    const roomRef = firebase.firestore().collection("rooms");

    //    await roomRef
    //      .add({
    //        name: this.date,
    //        createdAt: firebase.firestore.Timestamp.now(),
    //      })
    //      .then((result) => {
    //        console.log("success to create room", result);
    //        this.dialog = false;
    //      });
    //  },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  justify-content: center;

  &__pic {
    margin-right: 0 !important;
  }
}

.v-avatar {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
}
</style>