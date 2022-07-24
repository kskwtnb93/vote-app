<template>
  <v-app id="inspire">
    <SidebarComponent />

    <v-main>
      <h1>{{ room ? rooms.name : "" }}</h1>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader></v-subheader>

              <v-list two-line>
                <template v-for="(data, index) in messages">
                  <v-list-item :key="index">
                    <v-list-item-avatar color="grey darken-1">
                      <!-- <v-img v-if="data.photoURL" :src="data.photoURL"></v-img> -->
                    </v-list-item-avatar>

                    <v-list-item-content class="message">
                      <v-list-item-subtitle>
                        <!-- {{ data.message }} -->
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- <v-divider
                    v-if="index !== messages.length - 1"
                    :key="`divider-${index}`"
                    inset
                  ></v-divider> -->
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-textarea
        v-model="body"
        class="mx-2"
        label="メッセージを送信する"
        prepend-icon="mdi-comment"
        auto-grow
      ></v-textarea>

      <v-btn class="mr-4" type="submit" :disabled="invalid" @click="submit">
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";
import SidebarComponent from "@/components/Layouts/SidebarComponent";

export default {
  components: {
    SidebarComponent,
  },
  async created() {
    // URLのパラメータからルームIDを取得
    this.roomId = this.$route.query.room_id;
    //  console.log(this.roomId);

    // コレクション：room を参照、さらにdocメソッドでルームIDを指定
    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();

    // ルームIDが存在しない場合のリダイレクト処理
    if (!roomDoc.exists) {
      await this.$router.push("/");
    }

    this.room = roomDoc.data();
    console.log("room", this.room);

    //  const snapshot = await roomRef
    //    .collection("messages")
    //    .orderBy("createdAt", "asc")
    //    .get();

    //  snapshot.docs.map((doc) => {
    //    this.messages.push(doc.data());
    //  });

    //  const chatRef = firebase.firestore().collection("chats");
    //  //  console.log("chatref", chatRef);
    //  const snapshot = await chatRef.get();
    //  //  console.log(snapshot);

    //  snapshot.forEach((doc) => {
    //    // console.log(doc.data());
    //    this.messages.push(doc.data());
    //  });
  },
  data: () => ({
    messages: [],
    body: "",
    roomId: "",
    room: null,
    cards: ["Today"],
    drawer: null,
    auth: null,
  }),
  mounted() {
    // ログイン情報を取得
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.auth);

    // メッセージ一覧作成 + 投稿をリアルタイムで更新（onSnapshot）
    const roomRef = firebase.firestore().collection("rooms").doc(this);
    roomRef
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log("new message", change.doc.data());
          this.messages.push(change.doc.data());
        });
      });
  },
  computed: {
    invalid() {
      if (!this.body) {
        console.log("invalid true");
        return true;
      } else {
        console.log("invalid false");
        return false;
      }
    },
  },
  methods: {
    clear() {
      this.body = "";
    },
    submit() {
      console.log(this.body);
      // this.messages.push({ message: this.body });
      // unshiftで配列のメッセージ一覧の一番初めにメッセージを追加する
      // this.messages.push({
      //   message: this.body,
      //   name: this.auth.displayName,
      //   photoURL: this.auth.photoURL,
      //   createdAt: firebase.firestore.Timestamp.now(),
      // });
      // this.body = "";

      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
      roomRef
        .collection("messages")
        .add({
          message: this.body,
          name: this.auth.displayName,
          photoURL: this.auth.photoURL,
          createdAt: firebase.firestore.Timestamp.now(),
        })
        .then((result) => {
          console.log("success", result);
          this.body = "";
        })
        .catch((error) => {
          console.log("fail", error);
          alert("メッセージの送信に失敗しました。");
        });
    },
  },
};
</script>

<style>
.message {
  text-align: left;
}
</style>