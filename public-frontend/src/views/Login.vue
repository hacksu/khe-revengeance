<template>
  <div id="login">

    <div class="back" style="">
    </div>

    <div style="display: block; height: 100px; margin: 0px; margin-bottom: -70px; padding-top: 10vh;"></div>
    <h6 id="auth-subtitle"><img style="height: 10vh;" src="/Logo.svg" /></h6>
    <div class="auth-container">
      <h2 id="auth-title">Login</h2>
      <!--<h6 id="auth-subtitle">I've seen you 'round these parts.</h6>-->
      <div id="error-message"> {{ error }}</div>
      Email:<br>
      <input id="login-username" class="simple-text-input" type="text" placeholder="jane@doe.com" v-model="email" />
      <br>
      Password:<br>
      <input id="login-password" class="simple-text-input" type="password" placeholder="" v-model="password" />
      <br>
      <br>

      <button class="gold-clear-button" style="font-size: 2vmin !important;" @click="login()">
        Login!
      </button>
      <br>
      <br>

      <router-link tag="span" to="/register" class="buttonInput">
        No account? Register!
      </router-link>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      password: '',
      email: '',
      error: ''
    };
  },
  methods: {
    login() {
      // Verify that both
      this.err = '';
      this.$parent.wrapper.userManager.login(this.email, this.password)
        .then((data) => {
          this.$parent.user._id = data.key;
          this.$parent.user.email = data.email;
          this.$parent.user.role = data.role;
          this.$parent.showLogin = false;
          this.$router.push('/');
        })
        .catch((err) => {
          this.error = 'Your email or password is incorrect!';
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/global.scss';

#login .back {
  @include bg-flashy;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
}

#error-message {
  font-size: 15px;
  color: red;
  padding-bottom: 15px;
}

#login {
  height: calc(100vh - 53px);
  width: 100vw;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  opacity: .8;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  opacity: .8
}

.buttonInput {
  transition-duration: .5s;
  height: 30px;

  padding-right: 10px;
  padding-left: 10px;
  outline: none;
  border: none;
  cursor: pointer;
}

#dialog {
  padding-bottom: 25px;
}
</style>
