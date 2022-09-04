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

      <!-- <p @click="createOpenVotes()">test</p> -->

      <div class="page-contents" v-if="!this.answered && !this.loading">
        <v-simple-table class="room-list">
          <template v-slot:default>
            <thead>
              <tr>
                <th><br /></th>
                <th v-for="user in users" :key="user.uid">
                  {{ user.displayName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A1</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in a1" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>A2</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in a2" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <td>A 合計</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in aTotal" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td v-for="user in users" :key="user.uid"></td>
              </tr>

              <tr>
                <td>B1</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in b1" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>B2</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in b2" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <td>B 合計</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in bTotal" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td v-for="user in users" :key="user.uid"></td>
              </tr>

              <tr>
                <td>C1</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in c1" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>C2</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in c2" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <td>C 合計</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in cTotal" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td v-for="user in users" :key="user.uid"></td>
              </tr>
              <tr class="total-row all-total-row">
                <td>総合</td>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in allTotal" :key="index">
                    <span v-if="user.uid === key">{{ value }}</span>
                  </span>
                </td>
              </tr>
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
    aggregatedDatas: [],
    a1: {},
    a2: {},
    aTotal: {},
    b1: {},
    b2: {},
    bTotal: {},
    c1: {},
    c2: {},
    cTotal: {},
    allTotal: {},
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
    //  this.users.map((user) => {
    //    this.aggregatedDatas[user.displayName] = [];

    //    this.questions.map((question) => {
    //      this.aggregatedDatas[user.displayName][question.uid] = 0;
    //      this.votes.map((vote) => {
    //        Object.keys(vote).map((voteItem) => {
    //          // console.log(voteItem + ":", vote[voteItem]);

    //          if (question.uid === voteItem && user.uid === vote[voteItem]) {
    //            let votesCount =
    //              this.aggregatedDatas[user.displayName][question.uid];

    //            if (question.uid.indexOf("1") === 1) {
    //              this.aggregatedDatas[user.displayName][question.uid] =
    //                votesCount + 2;
    //            } else if (question.uid.indexOf("2") === 1) {
    //              this.aggregatedDatas[user.displayName][question.uid] =
    //                votesCount + 1;
    //            }
    //          }
    //        });
    //      });
    //    });
    //  });

    // 集計データを作成
    const aggregateVotes = (questionName, questionData) => {
      this.questions.map(() => {
        this.users.map((user) => {
          questionData[user.uid] = 0;

          this.votes.map((vote) => {
            let count = questionData[user.uid];

            Object.keys(vote).map((voteItem) => {
              if (voteItem === questionName) {
                if (vote[voteItem] === user.uid) {
                  // A1, B1, C1
                  if (questionName.indexOf("2") != -1) {
                    questionData[user.uid] = count + 1;
                  }
                  // A2, B2, C2
                  if (questionName.indexOf("1") != -1) {
                    questionData[user.uid] = count + 2;
                  }
                }
              }
            });
          });
        });
      });
    };

    aggregateVotes("a1", this.a1);
    aggregateVotes("a2", this.a2);
    aggregateVotes("b1", this.b1);
    aggregateVotes("b2", this.b2);
    aggregateVotes("c1", this.c1);
    aggregateVotes("c2", this.c2);

    //  console.log("aggregatedDatas", this.aggregatedDatas);

    //  console.log("A1", this.a1);
    //  console.log("A2", this.a2);
    //  console.log("B1", this.b1);
    //  console.log("B2", this.b2);
    //  console.log("C1", this.c1);
    //  console.log("C2", this.c2);

    // A票合計データ作成
    this.aTotal = Object.keys(this.a1).reduce((sum, value) => {
      sum[value] = this.a1[value] + this.a2[value];
      return sum;
    }, {});
    console.log("aTotal", this.aTotal);

    // B票合計データ作成
    this.bTotal = Object.keys(this.b1).reduce((sum, value) => {
      sum[value] = this.b1[value] + this.b2[value];
      return sum;
    }, {});
    console.log("bTotal", this.bTotal);

    // C票合計データ作成
    this.cTotal = Object.keys(this.c1).reduce((sum, value) => {
      sum[value] = this.c1[value] + this.c2[value];
      return sum;
    }, {});
    console.log("cTotal", this.cTotal);

    // 総合データ作成
    this.allTotal = Object.keys(this.aTotal).reduce((sum, value) => {
      sum[value] = this.aTotal[value] + this.bTotal[value] + this.cTotal[value];
      return sum;
    }, {});
    console.log("allTotal", this.allTotal);

    // ユーザーのuidを取得
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.uid;

    // ローディングを止める
    setTimeout(() => {
      this.loading = false;
    }, 100);
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
  border-collapse: collapse;
}
.v-data-table >>> td,
.v-data-table >>> th {
  user-select: text !important;
  padding: 12px !important;
  text-align: center !important;
}
.v-data-table >>> .total-row td,
.v-data-table >>> .total-row th {
  font-weight: bold;
  border-top: medium solid rgba(0, 0, 0, 0.12);
  border-bottom: medium solid rgba(0, 0, 0, 0) !important;
}
.v-data-table >>> .all-total-row td,
.v-data-table >>> .all-total-row th {
  border-bottom: medium solid rgba(0, 0, 0, 0.12) !important;
}
</style>