<template>
  <div class="home">
    <v-list class="user-list" subheader>
      <v-list-item
        class="user-list__item"
        v-for="user in users"
        :key="user.uid"
      >
        <v-list-item-avatar>
          <v-img
            :alt="`${user.displayName} avatar`"
            src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="user.displayName"></v-list-item-title>
        </v-list-item-content>

        <!-- <v-list-item-icon>
          <v-icon> mdi-message-outline </v-icon>
        </v-list-item-icon> -->
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  name: "HomeView",
  data: () => ({
    users: [],
  }),
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.users = [];

      // ドキュメント取得
      // ref = 参照的なニュアンスの意味
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
      console.log("snapshot", snapshot);

      // snapshotがオブジェクト型なのでmapではなくforEach使わないと展開できない
      // snapshot.forEach((doc) => {
      //   // data()メソッド使わないと見れない
      //   console.log(doc.data());
      // });

      snapshot.docs.map((doc) => {
        // docsであれば配列として受け取れるのでmapを使って展開できる
        const data = { ...doc.data() };
        data.id = doc.id;

        // data()メソッド使わないと見れない
        console.log(data);
        this.users.push(data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-list {
  &__item {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
}
</style>