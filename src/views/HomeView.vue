<template>
  <div class="home">
    <h2 class="page-title">投票ルーム一覧</h2>

    <CreateRoom />

    <!-- <v-list class="list" subheader>
      <v-list-item class="list__item" v-for="room in rooms" :key="room.uid">
        <router-link
          class="list__item__link"
          :to="{ path: '/vote', query: { room_id: room.id } }"
        >
          <v-list-item-avatar>
            <v-img
              :alt="`${room.displayName} avatar`"
              src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="room.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon> mdi-message-outline </v-icon>
          </v-list-item-icon>
        </router-link>
      </v-list-item>
    </v-list> -->

    <v-simple-table class="room-list">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ルーム名</th>
            <th class="text-left">投票状況</th>
            <th class="text-left">投票人数</th>
            <!-- <th class="text-left"></th>
            <th class="text-left"></th>
            <th class="text-left"></th> -->
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.uid">
            <td>
              <!-- <router-link :to="{ path: '/vote', query: { room_id: room.id } }">
                {{ room.name }}
              </router-link> -->
              {{ room.name }}
            </td>
            <!-- <td>受付中／締め切り／開票済</td> -->
            <td>受付中／開票済</td>
            <td>16／20</td>
            <!-- <td>
              <v-btn>投票する</v-btn>
            </td>
            <td>
              <v-btn>投票を〆切る</v-btn>
            </td>
            <td>
              <v-btn>投票結果を見る</v-btn>
            </td> -->
            <td class="btns">
              <div class="btns__wrapper">
                <v-btn :to="{ path: '/vote', query: { room_id: room.id } }"
                  >投票する
                </v-btn>
                <!-- <v-btn>投票を締め切る</v-btn> -->
                <v-btn>投票結果を見る</v-btn>
                <!-- <v-btn>投票結果を見る</v-btn> -->
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <!-- <v-list class="list" subheader>
      <v-list-item class="list__item" v-for="user in users" :key="user.uid">
        <v-list-item-avatar>
          <v-img
            :alt="`${user.displayName} avatar`"
            src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="user.displayName"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon> mdi-message-outline </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list> -->
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";
import CreateRoom from "@/components/Dialogs/CreateRoom.vue";

export default {
  name: "HomeView",
  components: {
    CreateRoom,
  },
  data: () => ({
    rooms: [],
  }),
  mounted() {
    this.getRooms();

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
  border-bottom: thin solid rgba(0, 0, 0, 0.12);

  table {
    table-layout: fixed;

    tr {
      &:hover {
        background-color: transparent !important;
      }
    }

    th,
    td {
      text-align: left;
      padding: 16px !important;

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
    }
  }
}
</style>