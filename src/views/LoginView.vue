<template>
  <v-app>
    <div>
      <v-card class="login-form">
        <v-card-title class="login-title">ログイン</v-card-title>

        <v-card-subtitle class="login-subtitle"
          >ユーザー情報をご入力ください。</v-card-subtitle
        >

        <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>

        <v-form ref="form" v-model="valid" lazy-validation>
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
            ログイン
          </v-btn>

          <!-- <v-btn color="" @click="isClear()"> CLEAR </v-btn> -->

          <!-- <v-alert
            dense
            text
            type="success"
            v-if="message"
            class="success-message"
          >
            {{ message }}
          </v-alert> -->

          <!-- <v-alert
            dense
            outlined
            type="error"
            class="error-message"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert> -->
        </v-form>

        <!-- <div class="text-center ma-2">
          <v-btn dark @click="snackbar = true"> Open Snackbar </v-btn>
        </div> -->

        <v-snackbar
          class="snackbar snackbar--success"
          color="success"
          outlined
          v-model="snackbarSuccess"
          top
        >
          <div class="snackbar__wrapper">
            <v-icon class="snackbar__icon" color="green"
              >mdi-check-circle</v-icon
            >
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

        <v-snackbar
          class="snackbar snackbar--error"
          color="error"
          outlined
          v-model="snackbarError"
          top
        >
          <div class="snackbar__wrapper">
            <v-icon class="snackbar__icon" color="red">mdi-check-circle</v-icon>
            <span class="snackbar__text">{{ errorMessage }}</span>
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
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください。",
      (v) => /.+@.+\..+/.test(v) || "メールアドレスが不正です。",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "パスワードを半角英数字で入力してください。",
      (v) =>
        (v && v.length >= 6) ||
        "パスワードは半角英数字6文字以上で入力してください。",
    ],
    successMessage: "",
    errorMessage: "",
    snackbarSuccess: false,
    snackbarError: false,
  }),
  mounted() {
    //  localStorage.message = "ユーザーの新規作成に成功しました。";

    if (localStorage.message) {
      this.successMessage = localStorage.message;
      localStorage.message = "";
      this.snackbarSuccess = true;
    }
  },
  computed: {
    isValid() {
      console.log("isValid", this.valid);

      if (this.email != null && this.password != null) {
        return !this.valid;
      } else {
        return this.valid;
      }
    },
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
      console.log("submit call");
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log("success");
          console.log("user", result.user);

          // session は localstoraage と違い、ブラウザを閉じるとリセットされる

          const auth = {
            displayName: result.user.displayName,
            email: result.user.email,
            uid: result.user.uid,
            refreshToken: result.user.refreshToken,
            photoURL: result.user.photoURL,
          };

          // sessionに保存するにはstring型にしないといけないのでJSON.stringfyで、文字列型のJSONに変換
          sessionStorage.setItem("user", JSON.stringify(auth));

          // TOPページにリダイレクトする処理
          this.$router.push("/");
        })
        .catch((error) => {
          console.log("fail", error);
          console.log(this.errorMessage);
          this.errorMessage = "ログインに失敗しました。";
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
  //   margin-right: 20px;
}
.success-message {
  margin-top: 20px;
}
.error-message {
  margin-top: 20px;
}

.snackbar__wrapper {
  display: flex;
  align-items: center;
}

.snackbar__icon {
  margin-right: 1rem;
}

.snackbar__text {
  color: #4caf50;
  font-weight: bold;
}
.snackbar__btn {
  font-size: 0.85em;
}

.snackbar--error {
  .snackbar__text {
    color: #f44336;
    font-weight: bold;
  }
}
</style>