<template>
  <v-dialog v-model="dialog" persistent max-width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        :disabled="roomStatus === 'end' ? true : false"
        >投票を〆切る</v-btn
      >
    </template>

    <v-card>
      <v-card-title class="text-h5">
        投票の受付を終了してよろしいですか？
      </v-card-title>
      <!-- <v-card-text
        >削除後は投票ルームを復元できません。<br />削除を実行してよろしいでしょうか？</v-card-text
      > -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray darken-1" text @click="dialog = false">
          終了しない
        </v-btn>
        <v-btn color="red darken-1" text @click="endRoom()">終了する</v-btn>
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
    roomStatus: {
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
    async endRoom() {
      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);

      await roomRef
        .update({
          status: {
            title: "受付終了",
            value: "end",
          },
        })
        .then((result) => {
          console.log("success to end room", result);
          this.dialog = false;
          location.reload();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>