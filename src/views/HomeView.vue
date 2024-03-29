<template>
  <div class="home">
    <h2 class="page-title">投票ルーム一覧</h2>

    <div class="loading-wrapper" v-if="this.loading">
      <v-progress-circular
        :width="3"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="!this.loading">
      <CreateRoom />

      <v-simple-table class="room-list">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ルーム名</th>
              <th class="text-left">投票状況</th>
              <th class="text-left">
                投票済ユーザー数<br class="sp" />／全ユーザー数
              </th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.uid">
              <td>{{ room.name }}</td>
              <td :class="room.status.value">{{ room.status.title }}</td>
              <td>
                <div class="all-users">
                  <span class="all-users__text">
                    {{ room.answered.length }} ／{{
                      room.allUsers > 0 ? room.allUsers : 0
                    }}
                  </span>
                  <button class="all-users__icon" @click="getRooms">
                    <v-icon>mdi-reload</v-icon>
                  </button>
                </div>
              </td>
              <td class="btns">
                <div class="btns__wrapper">
                  <v-btn
                    :to="{ path: '/vote', query: { room_id: room.id } }"
                    :disabled="room.status.value === 'end' ? true : false"
                    >投票する
                  </v-btn>
                  <EndRoom :roomStatus="room.status.value" :roomId="room.id" />
                  <v-btn
                    :to="{ path: '/open', query: { room_id: room.id } }"
                    :disabled="room.status.value !== 'end' ? true : false"
                    >投票結果を見る</v-btn
                  >
                  <DeleteRoom
                    :roomStatus="room.status.value"
                    :roomId="room.id"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-snackbar
        class="snackbar snackbar--success"
        color="success"
        outlined
        v-model="snackbarSuccess"
        top
      >
        <div class="snackbar__wrapper">
          <v-icon class="snackbar__icon" color="green">mdi-check-circle</v-icon>
          <span class="snackbar__text">{{ successMessage }}</span>
        </div>

        <template v-slot:action="{ attrs }">
          <v-btn
            color="green"
            text
            v-bind="attrs"
            class="snackbar__btn"
            @click="snackbarSuccess = false"
          >
            閉じる
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";
import CreateRoom from "@/components/Dialogs/CreateRoom.vue";
import DeleteRoom from "../components/Dialogs/DeleteRoom.vue";
import EndRoom from "../components/Dialogs/EndRoom.vue";

export default {
  name: "HomeView",
  components: {
    CreateRoom,
    DeleteRoom,
    EndRoom,
  },
  data: () => ({
    rooms: [],
    successMessage: "",
    snackbarSuccess: false,
    loading: true,
  }),
  mounted() {
    this.getRooms();

    if (localStorage.message) {
      this.successMessage = localStorage.message;
      localStorage.message = "";
      this.snackbarSuccess = true;
    }

    //  エラーになるため不使用：firestore、参照したいデータ１階層目だと onSnapshot() 使用できない？
    //  解決できなかったのでルーム追加のリアルタイム反映を強制リロードで擬似的に実現
    //  ↓
    //  ルーム一覧作成 + 投稿をリアルタイムで更新（onSnapshot）
    //  const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    //  roomRef
    //    .collection("messages")
    //    .orderBy("createdAt", "asc")
    //    .onSnapshot((snapshot) => {
    //      snapshot.docChanges().forEach((change) => {
    //        console.log("new message", change.doc.data());
    //        this.messages.push(change.doc.data());
    //      });
    //    });
  },
  methods: {
    async getRooms() {
      this.loading = true;
      this.rooms = [];
      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const roomsRef = firebase.firestore().collection("rooms");
      const snapshot = await roomsRef.orderBy("createdAt", "desc").get();

      snapshot.docs.map((doc) => {
        // docsであれば配列として受け取れるのでmapを使って展開できる
        const data = { ...doc.data() };
        data.id = doc.id;
        // data()メソッド使わないと見れない
        //   console.log(data);
        this.rooms.push(data);
      });

      setTimeout(() => {
        this.loading = false;
      }, 450);
    },
  },
};
</script>

<style lang="scss">
.page-title {
  padding: 1.5em 16px 0;
  text-align: left;
}

.list {
  border-top: thin solid rgba(0, 0, 0, 0.12);

  &__item {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
    padding: 0;

    &__link {
      padding: 0 16px;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      text-decoration: none;
    }
  }
}

.v-data-table {
  //   border-bottom: thin solid rgba(0, 0, 0, 0.12);
  margin-bottom: 6em;

  table {
    table-layout: fixed;
    margin: 0 auto;

    tr {
      &:hover {
        background-color: transparent !important;
      }
    }

    th,
    td {
      text-align: left;
      padding: 16px !important;

      &.accepting {
        color: green;
        font-weight: bold;
      }

      .v-btn {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }

      &.btns {
        width: max-content;
        .btns__wrapper {
          margin-bottom: -0.5rem;
        }
      }

      .all-users {
        display: flex;
        align-items: center;

        &__icon {
          margin-left: 0.5em;

          i {
            font-size: 1.5em;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .page-title {
    padding: 1.5em 12px 1.5em;
  }

  .v-data-table {
    table {
      width: max-content;
    }
  }
}
</style>

<style scoped>
.sp {
  display: none;
}
.home {
  position: relative;
  height: 100%;
}
.loading-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #fff;
}

@media screen and (max-width: 750px) {
  .sp {
    display: inherit;
  }

  .page-title {
    padding: 1.5em 12px 1.5em;
  }

  .v-data-table {
    margin-bottom: 10em;
  }

  .v-data-table >>> table {
    width: calc(800 / 750 * 100vh);
    table-layout: auto;
  }

  .v-data-table >>> table tbody tr td:last-child {
    width: 20em;
  }
}
</style>