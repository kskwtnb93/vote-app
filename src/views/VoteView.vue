<template>
  <div class="home">
    <div class="loading-wrapper" v-if="this.loading">
      <v-progress-circular
        :width="3"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>

    <v-dialog v-model="failedDialog" persistent max-width="360">
      <v-card>
        <v-card-title class="text-h5"></v-card-title>
        <v-card-text>
          投票が〆切られたか、投票ルームが削除されたため投票できません。<br />５秒後に一覧ページに移動します。
        </v-card-text>
      </v-card>
    </v-dialog>

    <div v-if="!this.loading && !this.failedDialog">
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
            @click="
              startConfirm();
              createConfirmData();
            "
            :disabled="this.submitDisable"
            >上記の内容で投票する</v-btn
          >
        </v-form>

        <v-dialog
          class="confirm-dialog"
          v-model="confirmDialog"
          persistent
          max-width="600px"
        >
          <v-card class="pb-4">
            <v-card-subtitle class="pa-6">
              <span
                >送信後は修正できません。<br />以下の内容で投票しますが宜しいですか？</span
              >
            </v-card-subtitle>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ul class="confirm-dialog__list">
                      <li
                        class="confirm-dialog__list__item"
                        v-for="(value, key, index) in confirmData"
                        :key="index"
                      >
                        {{ key }}：{{ value }}
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions class="confirm-dialog__actions">
              <v-btn color="secondary" @click="dialog = false">
                回答を修正する
              </v-btn>

              <v-btn color="primary" @click="sendVotes">
                この内容で投票する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    confirmData: {},
    userId: "",
    answered: false,
    loading: true,
    submitDisable: true,
    confirmDialog: false,
    failedDialog: false,
    answeredUsers: 0,
    allUsers: 0,
  }),
  async created() {
    // URLのパラメータからルームIDを取得
    this.roomId = this.$route.query.room_id;

    // コレクション：room を参照、さらにdoc()でルームIDを指定
    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();

    // ルームIDが存在しない場合のリダイレクト処理
    if (!roomDoc.exists) {
      // ローディング演出を中止
      this.loading = false;

      // ダイアログを表示
      this.failedDialog = true;

      // ５秒後にリダイレクト実行
      await setTimeout(() => {
        this.$router.push("/");
      }, 5000);
    }
    this.room = roomDoc.data();

    // 投票締め切り後にアクセスしてきた場合のリダイレクト処理
    if (this.room.status.value === "end") {
      // ローディング演出を中止
      this.loading = false;

      // ダイアログを表示
      this.failedDialog = true;

      // ５秒後にリダイレクト実行
      await setTimeout(() => {
        this.$router.push("/");
      }, 5000);
    }

    // ユーザーのuidを取得
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.uid;
  },
  mounted() {
    this.checkAnsered();
    this.getUsers();
    this.countAllUsers();
    this.getQuestions();
  },
  methods: {
    async checkAnsered() {
      // ドキュメント取得
      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
      const roomDoc = await roomRef.get();
      const roomData = roomDoc.data();
      // sessionStorage からユーザーのuidを取得
      const user = JSON.parse(sessionStorage.getItem("user"));
      // console.log("sessionから", user.uid);

      roomData.answered.map((answeredIds) => {
        //   console.log("firestoreから", answeredIds);

        if (user.uid === answeredIds) {
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
    async countAllUsers() {
      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
      // console.log("snapshot", snapshot);

      this.allUsers = snapshot.docs.length;
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
    formValidation() {
      let answerItemCount =
        document.voteForm.querySelectorAll(".form__item").length;
      let answeredCount = document.voteForm.querySelectorAll(":checked").length;

      // console.log("回答項目数", answerItemCount);
      // console.log("回答済み数", answeredCount);

      if (answerItemCount <= answeredCount + 1) {
        //   console.log("送信可能");
        this.submitDisable = false;
      } else {
        this.submitDisable = true;
      }
    },
    startConfirm() {
      const form = document.getElementById("form");
      // #form 内の値を取得
      const formData = new FormData(form);

      this.answer = {};
      // オブジェクト作成
      for (let value of formData.entries()) {
        this.answer[value[0]] = value[1];
      }
      // 回答日情報を追加
      this.answer.createdAt = new Date();
      // console.log(this.answer);
    },
    createConfirmData() {
      // console.log(this.answer);

      for (let value of Object.entries(this.answer)) {
        let questionTitle = "";
        let userName = "";

        this.questions.forEach(function (question) {
          if (question.uid === value[0]) {
            questionTitle = question.title;
          }
        });

        this.users.forEach(function (user) {
          if (user.uid === value[1]) {
            userName = user.displayName;
          }
        });

        if (questionTitle != "" && userName != "") {
          this.confirmData[questionTitle] = userName;
        }
      }

      // console.log(this.confirmData);
      this.confirmDialog = true;
    },
    sendVotes() {
      // firestore の参照元
      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
      const votesRef = roomRef.collection("votes");
      // const answeredRef = roomRef.collection("answered");

      // firestore へフォーム入力値を送信
      votesRef
        .add(this.answer)
        .then((result) => {
          console.log("success to create answer", result);

          roomRef
            .update({
              // 最新のユーザー数に念のため更新
              allUsers: this.allUsers,
              // 配列型のフィールドに追加：firebase.firestore.FieldValue.arrayUnion()
              answered: firebase.firestore.FieldValue.arrayUnion(this.userId),
            })
            .then((result) => {
              console.log("success to create answered", result);

              // TOPへリダイレクト
              this.$router.push("/");
            })
            .catch((error) => {
              console.log("fail to create answered", error);
            });

          //  answeredRef
          //    .add({ uid: this.userId })
          //    .then((result) => {
          //      console.log("success to create answered", result);
          //    })
          //    .catch((error) => {
          //      console.log("fail to create answered", error);
          //    });
        })
        .catch((error) => {
          console.log("fail to create answer", error);
        });
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
  }
}

.confirm-dialog {
  &__list {
    width: max-content;
    margin: 0 auto;

    &__item {
      width: max-content;
      text-align: left;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>