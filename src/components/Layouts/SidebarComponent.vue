<template>
  <div>
    <v-list>
      <v-list-item class="avatar">
        <v-list-item-avatar class="avatar__pic">
          <v-avatar color="indigo">
            <v-icon> mdi-account-circle </v-icon>
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
      </v-list-item-group>
    </v-list>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Open Dialog
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            <span class="text-h5">投票ルームを作成する</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="ルーム名"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      locale="jp-ja"
                      :day-format="(date) => new Date(date).getDate()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              閉じる
            </v-btn>
            <v-btn color="blue darken-1" text @click="createRoom()">
              投票ルームを作成する
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    selectedItem: 0,
    links: [
      ["mdi-home", "Home", "/"],
      ["mdi-send", "About", "/about"],
      ["mdi-login", "Login", "/login"],
      ["mdi-logout", "Signup", "/signup"],
    ],
    auth: null,
    dialog: false,
    name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
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
    async createRoom() {
      const roomRef = firebase.firestore().collection("rooms");

      await roomRef
        .add({
          name: this.date,
          createdAt: firebase.firestore.Timestamp.now(),
        })
        .then((result) => {
          console.log("success to create room", result);
          this.dialog = false;
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
</style>