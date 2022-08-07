<template>
  <div class="home">
    <h2 class="page-title">{{ room.name }} 投票</h2>

    <v-form id="form" method="post" ref="form" lazy-validation>
      <v-container v-for="question in questions" :key="question.id" fluid>
        <label class="form-section__title">{{ question.title }}</label>
        <v-radio-group>
          <v-radio
            v-for="user in users"
            :key="user.uid"
            :for="question.uid"
            :name="question.uid"
            :label="user.displayName"
            :value="user.uid"
            required
          ></v-radio>
        </v-radio-group>
      </v-container>
      <v-btn type="button" @click="submitButton">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  name: "VoteView",
  components: {
    //  CreateRoom,
  },
  data: () => ({
    users: [],
    room: "",
    roomId: "",
    questions: [],
    answer: {},
  }),
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
    console.log("room", this.room.name);
  },
  mounted() {
    this.getUsers();
    this.getQuestions();
  },
  methods: {
    async getUsers() {
      this.users = [];

      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
      // console.log("snapshot", snapshot);

      snapshot.docs.map((doc) => {
        // docsであれば配列として受け取れるのでmapを使って展開できる
        const data = { ...doc.data() };
        data.id = doc.id;

        // data()メソッド使わないと見れない
        //   console.log(data);
        this.users.push(data);
      });
    },
    async getQuestions() {
      this.questions = [];

      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const questionsRef = firebase.firestore().collection("questions");
      const snapshot = await questionsRef.get();
      // console.log("snapshot", snapshot);

      snapshot.docs.map((doc) => {
        // docsであれば配列として受け取れるのでmapを使って展開できる
        const data = { ...doc.data() };
        data.id = doc.id;

        // data()メソッド使わないと見れない
        console.log(data);
        this.questions.push(data);
      });
    },
    submitButton() {
      const form = document.getElementById("form");
      // #form 内の値を取得
      const formData = new FormData(form);
      // firestore の参照元
      const answerRef = firebase.firestore().collection("answers");

      this.answer = {};
      // オブジェクト作成
      for (let value of formData.entries()) {
        this.answer[value[0]] = value[1];
      }
      // 作成日情報を追加
      this.answer.careatedAt = new Date();

      // console.log(this.answer);

      // firestore へフォーム入力値を送信
      answerRef
        .add(this.answer)
        .then((result) => {
          console.log("success to create answer", result);
        })
        .catch((error) => {
          console.log("fail to create answer", error);
        });
    },
  },
};
</script>

<style lang="scss">
.page-title {
  padding: 1.5em 16px;
  text-align: left;
}
.form-section {
  &__title {
    display: block;
    text-align: left;
  }
}
</style>