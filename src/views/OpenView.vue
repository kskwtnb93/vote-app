<template>
  <div class="open">
    <div class="loading-wrapper" v-if="this.loading">
      <v-progress-circular
        :width="3"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>

    <!-- <v-dialog v-model="failedDialog" persistent max-width="360">
      <v-card>
        <v-card-title class="text-h5"></v-card-title>
        <v-card-text>
          投票が〆切られたか、投票ルームが削除されたため投票できません。<br />５秒後に一覧ページに移動します。
        </v-card-text>
      </v-card>
    </v-dialog> -->

    <div v-if="!this.loading">
      <h2 class="page-title">{{ room.name }} 開票</h2>

      <p @click="createOpenVotes()">test</p>

      <div class="page-contents" v-if="!this.answered && !this.loading">
        <v-simple-table class="room-list">
          <template v-slot:default>
            <thead>
              <tr>
                <th></th>
                <th v-for="user in users" :key="user.uid">
                  {{ user.displayName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in questions" :key="question.id">
                <td>{{ question.title }}</td>
                <td v-for="user in users" :key="user.uid">1</td>
              </tr>
              <!-- <tr>
                  <td>合計</td>
                  <td v-for="user in users" :key="user.uid">1</td>
                </tr> -->
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  name: "OpenView",
  components: {},
  data: () => ({
    answered: false,
    loading: true,
    room: "",
    roomId: "",
    votes: [],
    questions: [],
    users: [],
    userId: "",
  }),
  async created() {
    // URLのパラメータからルームIDを取得
    this.roomId = this.$route.query.room_id;

    // コレクション：room を参照、さらにdoc()でルームIDを指定
    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();
    this.room = roomDoc.data();

    // ルームIDが存在しない場合のリダイレクト処理
    //  if (!roomDoc.exists) {
    //    // ローディング演出を中止
    //    this.loading = false;

    //    // ダイアログを表示
    //    this.failedDialog = true;

    //    // ５秒後にリダイレクト実行
    //    await setTimeout(() => {
    //      this.$router.push("/");
    //    }, 5000);
    //  }

    // 投票締め切り後にアクセスしてきた場合のリダイレクト処理
    //  if (this.room.status.value === "end") {
    //    // ローディング演出を中止
    //    this.loading = false;

    //    // ダイアログを表示
    //    this.failedDialog = true;

    //    // ５秒後にリダイレクト実行
    //    await setTimeout(() => {
    //      this.$router.push("/");
    //    }, 5000);
    //  }

    // 投票データ参照
    const votesRef = roomRef.collection("votes");
    const votesSnapshot = await votesRef.get();
    // ユーザーデータ参照
    const usersRef = firebase.firestore().collection("users");
    const userSnapshot = await usersRef.get();
    // 項目データ参照
    const questionsRef = firebase.firestore().collection("questions");
    const questionsSnapshot = await questionsRef.get();

    // 投票データを取得
    votesSnapshot.docs.map((doc) => {
      const data = { ...doc.data() };
      this.votes.push(data);
    });

    // ユーザーデータを取得
    userSnapshot.docs.map((doc) => {
      const data = { ...doc.data() };
      this.users.push(data);
    });

    // 項目データ取得
    questionsSnapshot.docs.map((doc) => {
      const data = { ...doc.data() };
      this.questions.push(data);
    });

    // 開票データを作成
    this.users.map((user) => {
      console.log(user.uid);

      this.questions.map((question) => {
        console.log(question.uid);

        this.votes.map((vote) => {
          Object.keys(vote).map((voteItem) => {
            console.log(voteItem + ":", vote[voteItem]);
          });
        });

        //   this.votes.forEach(function (vote) {
        //     Object.keys(vote).forEach(function (voteItem) {
        //       console.log(voteItem + ":", vote[voteItem]);
        //     });
        //   });
      });
    });

    // ユーザーのuidを取得
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.uid;

    // ローディングを止める
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  mounted() {
    // ユーザーのuidを取得
    //  this.getMyId();
    //  this.getUsers();
    //  this.getQuestions();
    //  this.createOpenVotes();
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
    getMyId() {
      // ユーザーのuidを取得
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.userId = user.uid;
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

        //   console.log(this.questions);
      });

      // ローディングしている感出すため0.5秒後 this.loading 更新
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.open {
  //   max-width: 750px;
  height: 100%;
  //   margin: 0 auto;
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
.page-sub-title {
  text-align: left;
}
</style>

<style scoped>
.v-data-table >>> table {
  width: auto !important;
}
.v-data-table >>> td,
.v-data-table >>> th {
  padding: 12px !important;
  text-align: center !important;
}
</style>