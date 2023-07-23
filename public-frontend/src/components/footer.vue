<template>
  <div id="powered-by">
    <p id="powered-by-text">
      POWERED BY
    </p>

    <a id="small-hacksu-logo" href="https://hacksu.com">
      <img style="opacity: 0.5" id="powered-by-hacksu" src="@/assets/2019-hacksu-color.svg" />
    </a>

    <!-- <a id="small-mlh-logo" href="https://mlh.io" v-if="mlh">
      <img style="opacity: 0.5" id="powered-by-mlh" src="@/assets/mlh-logo.svg" />
    </a> -->
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  computed: {
    mlh() {
      return this.$root.$children[0].showMLH;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";

#powered-by {
  @include bg-secondary;
  z-index: 100;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 30px
}

#powered-by-text {
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  margin-top: 0px;
  margin-bottom: 10px;
  opacity: 0.5;
}

#powered-by-hacksu {
  width: 50%;
  height: 90px;
}

#powered-by-mlh {
  float: right;
  width: 50%;
  height: 50px;
  margin-top: 17px;
}

.info-container {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  margin: 0 auto;
}

p {
  font-size: 20px;
}

h3 {
  font-size: 22px;
}

@media screen and (min-width: 768px) {

  #powered-by {
    display: flex;
    flex-direction: row;
    min-height: 50px;
    padding-left: 50px;
    // background-color: $sand2;
    // filter: brightness(90%);
  }

  #powered-by-text {
    font-size: 18px;
    margin: auto 0;
  }

  #powered-by-hacksu {
    width: 100%;
    height: 65px;
  }

  #powered-by-mlh {
    width: 100%;
    height: 65px;
    margin-top: 0;
  }

  #small-hacksu-logo {
    width: 150px;
  }

  #small-mlh-logo {
    width: 90px;
  }
}
</style>

