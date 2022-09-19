<template>
  <v-app>
    <div>
      <v-card class="login-form">
        <v-card-title class="login-title">ユーザー新規登録</v-card-title>

        <v-card-subtitle class="login-subtitle"
          >ユーザー情報をご入力ください。</v-card-subtitle
        >

        <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="ユーザー名"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="メールアドレス"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="パスワード"
            required
          ></v-text-field>

          <v-btn
            color="success"
            class="login-btn"
            @click="submit"
            :disabled="isValid"
          >
            登録する
          </v-btn>
        </v-form>

        <v-snackbar
          class="snackbar snackbar--error"
          color="error"
          outlined
          v-model="snackbarError"
          top
        >
          <div class="snackbar__wrapper">
            <v-icon class="snackbar__icon" color="red">mdi-check-circle</v-icon>
            <!-- <span class="snackbar__text">{{ this.errorMessage }}</span> -->
            <span class="snackbar__text"
              >ユーザーの新規作成に失敗しました。</span
            >
          </div>

          <template v-slot:action="{ attrs }">
            <v-btn
              color="red"
              text
              v-bind="attrs"
              class="snackbar__btn"
              @click="snackbarError = false"
            >
              閉じる
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    valid: false,
    name: "",
    nameRules: [
      (v) => !!v || "名前を入力してください。",
      (v) => (v && v.length <= 10) || "名前は10文字以内で入力してください。",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください。",
      (v) => /.+@.+\..+/.test(v) || "正しくメールアドレスを入力してください。",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "パスワードを半角英数字で入力してください。",
      (v) =>
        (v && v.length >= 6) ||
        "パスワードは半角英数字6文字以上で入力してください。",
    ],
    //  errorMessage: "ユーザーの新規作成に失敗しました。",
    snackbarError: false,
  }),
  computed: {
    isValid() {
      // console.log("isValid", this.valid);
      // console.log(this.name);
      // console.log(this.nameRules);

      if (this.name != null && this.email != null && this.password != null) {
        return !this.valid;
      } else {
        return this.valid;
      }
    },
  },
  mounted() {
    this.$emit("drawer-controll", false);
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    submit() {
      // console.log("submit call");
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(async (result) => {
          //  console.log("success", result);

          // Authenticationへの登録
          await result.user.updateProfile({ displayName: this.name });
          //  console.log("update user", result.user);

          // Cloud Firestoreへの登録
          const usersRef = firebase.firestore().collection("users");
          await usersRef
            .add({
              uid: result.user.uid,
              displayName: result.user.displayName,
              email: result.user.email,
              registeredAt: firebase.firestore.Timestamp.now(),
            })
            .then((result) => {
              console.log("success to create user", result);
            });

          localStorage.message = "ユーザーの新規作成に成功しました。";

          // TOPページにリダイレクトする処理
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log("fail", error);

          // エラーメッセージを表示
          this.snackbarError = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 50%;
  min-width: 640px;
  margin: 150px auto;
  padding: 30px;
}
.login-title {
  display: inline-block;
  text-align: center;
}
.login-btn {
  /* margin-right: 20px; */
}
.error-message {
  margin-top: 20px;
}
.snackbar--error {
  .snackbar__text {
    color: #f44336;
    font-weight: bold;
  }
}

@media screen and (max-width: 750px) {
  .login-form {
    min-width: 90%;
    padding: 20px;
  }
}
</style>