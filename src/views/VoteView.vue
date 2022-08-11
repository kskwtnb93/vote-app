<template>
  <div class="home">
    <div class="loading-wrapper" v-if="this.loading">
      <v-progress-circular
        :width="3"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="!this.loading">
      <h2 class="page-title">{{ room.name }} 投票</h2>

      <div v-if="this.answered">
        <p>この回は投票済みです。</p>
      </div>

      <div v-if="!this.answered && !this.loading">
        <v-form
          id="form"
          name="voteForm"
          class="form"
          method="post"
          ref="form"
          lazy-validation
        >
          <v-card
            class="form__item"
            v-for="question in questions"
            :key="question.id"
            fluid
          >
            <label class="form__item__title">{{ question.title }}</label>
            <v-radio-group>
              <v-radio
                v-for="user in users"
                :key="user.uid"
                :for="question.uid"
                :name="question.uid"
                :label="user.displayName"
                :value="user.uid"
                @change="formValidation"
                required
              ></v-radio>
            </v-radio-group>
          </v-card>

          <v-btn
            class="form__submitBtn"
            type="button"
            color="primary"
            large
            :disabled="this.submitDisable"
            >上記の内容で投票する</v-btn
          >
        </v-form>
      </div>
    </div>
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
    userId: "",
    answered: false,
    loading: true,
    submitDisable: true,
  }),
  async created() {
    // URLのパラメータからルームIDを取得
    this.roomId = this.$route.query.room_id;
    // コレクション：room を参照、さらにdocメソッドでルームIDを指定
    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();
    // ルームIDが存在しない場合のリダイレクト処理
    if (!roomDoc.exists) {
      await this.$router.push("/");
    }
    this.room = roomDoc.data();

    // ユーザーのuidを取得
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.uid;
  },
  mounted() {
    this.checkAnsered();
    this.getUsers();
    this.getQuestions();
  },
  methods: {
    async checkAnsered() {
      // ドキュメント取得
      const answeredRef = firebase
        .firestore()
        .collection("rooms")
        .doc(this.roomId)
        .collection("answered");
      const snapshot = await answeredRef.get();
      // sessionStorage からユーザーのuidを取得
      const user = JSON.parse(sessionStorage.getItem("user"));
      // console.log("sessionから", user.uid);

      snapshot.docs.map((doc) => {
        // docsであれば配列として受け取れるのでmapを使って展開できる
        // data()メソッド使わないと見れない
        const data = { ...doc.data() };
        //   console.log("firestoreから", data.uid);

        if (user.uid === data.uid) {
          //  console.log("投票済みuidが一致したのでTOPにリダイレクト");
          //  this.$router.push("/");
          this.answered = true;
        }
      });
    },
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
        //   console.log(data);
        this.questions.push(data);

        // ローディングしている感出すため0.5秒後 this.loading 更新
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    submitButton() {
      const form = document.getElementById("form");
      // #form 内の値を取得
      const formData = new FormData(form);
      // firestore の参照元
      const votesRef = firebase
        .firestore()
        .collection("rooms")
        .doc(this.roomId)
        .collection("votes");
      const answeredRef = firebase
        .firestore()
        .collection("rooms")
        .doc(this.roomId)
        .collection("answered");

      this.answer = {};
      // オブジェクト作成
      for (let value of formData.entries()) {
        this.answer[value[0]] = value[1];
      }
      // 回答日情報を追加
      this.answer.createdAt = new Date();

      // console.log(this.answer);

      // firestore へフォーム入力値を送信
      votesRef
        .add(this.answer)
        .then((result) => {
          console.log("success to create answer", result);

          answeredRef
            .add({ uid: this.userId })
            .then((result) => {
              console.log("success to create answered", result);
            })
            .catch((error) => {
              console.log("fail to create answered", error);
            });

          // TOPへリダイレクト
          this.$router.push("/");
        })
        .catch((error) => {
          console.log("fail to create answer", error);
        });
    },
    formValidation() {
      let answerItemCount =
        document.voteForm.querySelectorAll(".form__item").length;
      let answeredCount = document.voteForm.querySelectorAll(":checked").length;

      console.log("回答項目数", answerItemCount);
      console.log("回答済み数", answeredCount);

      if (answerItemCount <= answeredCount + 1) {
        console.log("送信可能");
        this.submitDisable = false;
      } else {
        this.submitDisable = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  max-width: 750px;
  height: 100%;
  margin: 0 auto;
}
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.page-title {
  padding: 1.5em 12px;
  text-align: left;
}
.form {
  padding-bottom: 6em;

  &__item {
    margin: 0 12px 24px;
    padding: 24px;

    &__title {
      display: block;
      text-align: left;
    }
  }

  &__submitBtn {
    min-width: 300px;
    margin-top: 1.5em;

    &:disabled {
    }
  }
}
</style>