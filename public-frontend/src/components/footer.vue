<template>
  <div id="powered-by">
    <p id="powered-by-text">
      POWERED BY
    </p>

    <a id="small-hacksu-logo" href="https://hacksu.com">
      <img style="opacity: 0.5" id="powered-by-hacksu" src="@/assets/2019-hacksu-color.svg" />
    </a>

    <a id="small-mlh-logo" href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md" v-show="mlh">
      <img style="opacity: 0.5" id="powered-by-mlh" src="@/assets/mlh-logo.svg" />
      <span id="code-of-conduct-text">Code of Conduct</span>
    </a>

    <div class="glow">
      <picture>
        <source type="image/avif" srcset="/horizon.avif">
        <source type="image/webp" srcset="/horizon.webp">
        <img src="/horizon.png" id="horizon">
      </picture>
    </div>
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
  position: relative; // Add this line
  @include bg-secondary;
  z-index: 100;
  padding: 10px 20px;
  margin-top: 100px;
  margin-bottom: -15px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  @media screen and (max-width: $md-bp) {
    margin-top: 100px;
  }
}

#powered-by-text {
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  opacity: 0.5;
}

#powered-by-hacksu {
  height: 45px;
}

#powered-by-mlh {
  float: right;
  width: 50%;
  height: 50px;
  margin-top: 17px;
}

.glow {
  position: relative;
  overflow: hidden;

  #horizon {
    width: 100%;
    height: 225px;
    object-fit: cover;
    object-position: 50% top;
    margin-bottom: -20px;
    filter: brightness(1.5);

    @media screen and (max-width: $md-bp) {
      height: 175px;
    }
  }
}

p {
  font-size: 20px;
}

h3 {
  font-size: 22px;
}

@media screen and (min-width: 768px) {

  #powered-by {
    min-height: 50px;
    padding-left: 50px;
  }

  #powered-by-text {
    font-size: 18px;
    margin: auto 0;
  }

  #powered-by-hacksu {
    height: 45px;
  }

  #powered-by-mlh {
    width: 45px;
    height: auto;
    margin-top: 0;
  }

  #small-mlh-logo {
    width: 90px;
  }
}

//Testing Border Debug
#powered-by, #small-hacksu-logo, #small-mlh-logo, .glow {
  border: 1px solid red; // This will help identify layout issues
}

</style>

