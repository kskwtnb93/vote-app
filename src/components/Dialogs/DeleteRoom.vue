<template>
  <v-dialog v-model="dialog" persistent max-width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">この投票ルームを削除する</v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        投票ルームの削除を実行してよろしいですか？
      </v-card-title>
      <v-card-text
        >削除後は投票ルームを復元できません。<br />削除を実行してよろしいでしょうか？</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray darken-1" text @click="dialog = false">
          削除しない
        </v-btn>
        <v-btn color="red darken-1" text @click="deleteRoom()">削除する</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  props: {
    roomId: {
      type: String,
      default: "",
      required: false,
    },
  },
  data: () => ({
    dialog: false,
  }),
  mounted() {},
  methods: {
    async deleteRoom() {
      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);

      await roomRef.delete().then((result) => {
        console.log("success to delete room", result);
        this.dialog = false;
        location.reload();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-room {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 32px;
  //   margin: 0;
  box-sizing: border-box;

  .v-btn {
    margin-left: 0.5rem;
  }
}
</style>