<template>
  <div class="open">
    <div class="loading-wrapper" v-if="this.loading">
      <v-progress-circular
        :width="3"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="!this.loading">
      <h2 class="page-title">{{ room.name }} 開票</h2>

      <div class="page-contents" v-if="!this.answered && !this.loading">
        <v-simple-table class="total-table">
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
                <th>A1</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in a1" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <th>A2</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in a2" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <th>A 合計</th>
                <td v-for="user in users" :key="user.uid">
                  <template v-for="(value, key, index) in aTotal">
                    <span v-if="user.uid === key" class="wrapper" :key="index">
                      <span class="value">{{ value.value }}</span>
                      <span
                        v-if="value.rank != 'normal'"
                        class="rank-mark"
                        :class="value.rank"
                      ></span>
                    </span>
                  </template>
                </td>
              </tr>

              <tr>
                <th>B1</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in b1" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <th>B2</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in b2" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <th>B 合計</th>
                <td v-for="user in users" :key="user.uid">
                  <template v-for="(value, key, index) in bTotal">
                    <span v-if="user.uid === key" class="wrapper" :key="index">
                      <span class="value">{{ value.value }}</span>
                      <span
                        v-if="value.rank != 'normal'"
                        class="rank-mark"
                        :class="value.rank"
                      ></span>
                    </span>
                  </template>
                </td>
              </tr>

              <tr>
                <th>C1</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in c1" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <th>C2</th>
                <td v-for="user in users" :key="user.uid">
                  <span v-for="(value, key, index) in c2" :key="index">
                    <span v-if="user.uid === key">{{ value.value }}</span>
                  </span>
                </td>
              </tr>
              <tr class="total-row">
                <th>C 合計</th>
                <td v-for="user in users" :key="user.uid">
                  <template v-for="(value, key, index) in cTotal">
                    <span v-if="user.uid === key" class="wrapper" :key="index">
                      <span class="value">{{ value.value }}</span>
                      <span
                        v-if="value.rank != 'normal'"
                        class="rank-mark"
                        :class="value.rank"
                      ></span>
                    </span>
                  </template>
                </td>
              </tr>

              <tr class="total-row all-total-row" ref="first_child">
                <th>総 合</th>
                <td v-for="user in users" :key="user.uid">
                  <template v-for="(value, key, index) in allTotal">
                    <span v-if="user.uid === key" class="wrapper" :key="index">
                      <span class="value">{{ value.value }}</span>
                      <span
                        v-if="value.rank != 'normal'"
                        class="rank-mark"
                        :class="value.rank"
                      ></span>
                    </span>
                  </template>
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

    // 集計データを作成
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
          questionData[user.uid] = { value: 0, rank: "normal" };

          this.votes.map((vote) => {
            let count = questionData[user.uid].value;

            Object.keys(vote).map((voteItem) => {
              if (voteItem === questionName) {
                if (vote[voteItem] === user.uid) {
                  // A1, B1, C1
                  if (questionName.indexOf("2") != -1) {
                    questionData[user.uid].value = count + 1;
                  }

                  // A2, B2, C2
                  if (questionName.indexOf("1") != -1) {
                    questionData[user.uid].value = count + 2;
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

    //  console.log("A1", this.a1);
    //  console.log("A2", this.a2);
    //  console.log("B1", this.b1);
    //  console.log("B2", this.b2);
    //  console.log("C1", this.c1);
    //  console.log("C2", this.c2);

    // A票合計データ作成
    this.aTotal = Object.keys(this.a1).reduce((sum, value) => {
      sum[value] = {
        value: 0,
        rank: "normal",
      };
      sum[value].value = this.a1[value].value + this.a2[value].value;
      return sum;
    }, {});
    //  console.log("aTotal", this.aTotal);

    // B票合計データ作成
    this.bTotal = Object.keys(this.b1).reduce((sum, value) => {
      sum[value] = {
        value: 0,
        rank: "normal",
      };
      sum[value].value = this.b1[value].value + this.b2[value].value;
      return sum;
    }, {});
    //  console.log("bTotal", this.bTotal);

    // C票合計データ作成
    this.cTotal = Object.keys(this.c1).reduce((sum, value) => {
      sum[value] = {
        value: 0,
        rank: "normal",
      };
      sum[value].value = this.c1[value].value + this.c2[value].value;
      return sum;
    }, {});
    //  console.log("cTotal", this.cTotal);

    // 総合合計データ作成
    this.allTotal = Object.keys(this.aTotal).reduce((sum, value) => {
      sum[value] = {
        value: 0,
        rank: "normal",
      };
      sum[value].value =
        this.aTotal[value].value +
        this.bTotal[value].value +
        this.cTotal[value].value;
      return sum;
    }, {});
    //  console.log("allTotal", this.allTotal);

    const addRank = (targetObject) => {
      let array = Object.entries(targetObject);
      let no1MemberUids = [];
      let no1Value = 0;
      let no2MemberUids = [];
      let no2Value = 0;

      // ポイント１位を決める
      array.map((value) => {
        if (value[1].value >= no1Value) {
          no1MemberUids.push(value[0]);
          no1Value = value[1].value;
        }
      });
      array.map((value) => {
        if (value[1].value === no1Value) {
          no1MemberUids.push(value[0]);
        }
      });
      no1MemberUids.map((value) => {
        targetObject[value].rank = "no1";
      });

      // ポイント２位を決める
      array.map((value) => {
        if (value[1].value < no1Value) {
          if (value[1].value >= no2Value) {
            no2Value = value[1].value;
          }
        }
      });
      array.map((value) => {
        if (value[1].value === no2Value) {
          no2MemberUids.push(value[0]);
        }
      });
      no2MemberUids.map((value) => {
        targetObject[value].rank = "no2";
      });
    };

    addRank(this.aTotal);
    addRank(this.bTotal);
    addRank(this.cTotal);
    addRank(this.allTotal);

    // ユーザーのuidを取得
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.uid;

    // ローディングを止める
    setTimeout(() => {
      this.loading = false;
    }, 10);
  },
  mounted() {},
  methods: {},
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
.v-data-table >>> thead th:first-child,
.v-data-table >>> tbody th {
  min-width: 80px;
}
.v-data-table >>> tbody th {
  background-color: rgba(0, 0, 0, 0.03);
}
.v-data-table >>> .total-row td,
.v-data-table >>> .total-row th {
  position: relative;
  font-weight: bold;
  border-top: medium solid rgba(0, 0, 0, 0.12);
  border-bottom: medium solid rgba(0, 0, 0, 0.12) !important;
  /* background-color: rgba(0, 0, 0, 0.06); */
}
.v-data-table >>> .total-row td .wrapper,
.v-data-table >>> .total-row th .wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.v-data-table >>> .total-row td .wrapper .value,
.v-data-table >>> .total-row th .wrapper .value {
  position: relative;
  z-index: 2;
}
.v-data-table >>> .total-row td .wrapper .rank-mark,
.v-data-table >>> .total-row th .wrapper .rank-mark {
  position: absolute;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
}
.v-data-table >>> .total-row td .wrapper .rank-mark.no1,
.v-data-table >>> .total-row th .wrapper .rank-mark.no1 {
  background-color: rgba(255, 255, 0, 0.8);
  width: 2.4em;
  height: 2.4em;
}
.v-data-table >>> .total-row td .wrapper .rank-mark.no2,
.v-data-table >>> .total-row th .wrapper .rank-mark.no2 {
  background-color: rgba(255, 255, 0, 0.4);
}
.v-data-table >>> .all-total-row td,
.v-data-table >>> .all-total-row th {
  border-bottom: medium solid rgba(0, 0, 0, 0) !important;
  /* background-color: rgba(0, 0, 0, 0); */
  font-size: 1em;
}
.total-table {
  margin-bottom: 3em;
}
.all-total-table {
  margin-bottom: 16em;
}
</style>