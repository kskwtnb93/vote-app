<template>
  <div>
    <v-list>
      <v-list-item class="avatar">
        <v-list-item-avatar class="avatar__pic">
          <v-avatar>
            <input
              type="file"
              ref="fileInput"
              accept="image/jpeg, image/jpg, image/png"
              style="display: none"
              @change="updateIcon"
            />

            <v-icon v-if="!photoUrl" x-large @click="changeIcon">
              mdi-account-circle
            </v-icon>

            <img v-if="photoUrl" :src="photoUrl" @click="changeIcon" alt="" />
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
            <v-icon>mdi-logout</v-icon>
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
    photoUrl: "",
  }),
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    // sessionの中にphotoURLがあれば更新
    this.photoUrl = this.auth.photoURL;
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
    changeIcon() {
      // console.log("changeIcon call");
      this.$refs.fileInput.click();
    },
    updateIcon() {
      // console.log("updateIcon call");
      const user = this.getAuth();

      if (!user) {
        sessionStorage.removeItem("user");
        this.$router.push("/login");
      }

      const file = this.$refs.fileInput.files[0];
      const filePath = `/user/${file.name}`;
      console.log(file);

      firebase
        .storage()
        .ref()
        .child(filePath)
        .put(file)
        .then(async (snapshot) => {
          //  console.log("snapshot", snapshot);

          const photoUrl = await snapshot.ref.getDownloadURL();
          console.log("photoUrl", photoUrl);

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              user.updateProfile({
                photoURL: photoUrl,
              });

              this.auth.photoURL = photoUrl;
              sessionStorage.setItem("user", JSON.stringify(this.auth));

              // リロードなしで画像更新するためにdata更新
              this.photoUrl = photoUrl;
            }
          });
        });
    },
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
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
}

.v-list-item__content {
  padding-top: 0;
}
</style>