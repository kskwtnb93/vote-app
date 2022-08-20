<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <p class="add-room">
        <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn> -->
        <span>投票ルームを新規作成する</span>

        <v-btn color="pink" dark fab x-small v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </p>
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
                v-model="menu"
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
                  @change="menu = false"
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
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    auth: null,
    dialog: false,
    name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    allUsers: 0,
  }),
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    this.countAllUsers();
  },
  methods: {
    getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
        return user;
      });
    },
    async countAllUsers() {
      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
      // console.log("snapshot", snapshot);

      this.allUsers = snapshot.docs.length;
    },
    async createRoom() {
      const roomRef = firebase.firestore().collection("rooms");

      await roomRef
        .add({
          name: this.date,
          createdAt: firebase.firestore.Timestamp.now(),
          allUsers: this.allUsers,
          status: {
            title: "受付中",
            value: "accepting",
          },
          answered: [],
        })
        .then((result) => {
          console.log("success to create room", result);
          this.dialog = false;
          location.reload();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-room {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 32px;
  //   margin: 0;
  box-sizing: border-box;

  .v-btn {
    margin-left: 0.5rem;
  }
}
</style>