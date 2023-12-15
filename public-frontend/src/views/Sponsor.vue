<template>
  <div id="sponsors" style="margin-top: -53px; min-height: calc(100vh - 80px - 50px)">

    <img src="/Logo.svg" style="margin-top: 4vh; height: 150px" />
    <h1 class="sponsorship-title">SPONSORSHIP</h1>

    <!-- TODO: "looking for sponsors" message -->

  </div>
</template>

<script>
export default {
  name: "Sponsor",
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/global.scss';

.sponsorship-title {
  margin-top: -0.5vh;
  font-size: 5vmax;
  border: none;
  background: none;

  @media only screen and (min-width: 560px) {
    font-size: 7vh;
  }
}

#sponsors {
  padding: 100px 5vw 80px 5vw;
  padding-top: 100px;
  padding-bottom: 0px;
  margin: 0px;
  text-align: left;
  // background-image: linear-gradient(to right,#D75DDE , #F47732);
  text-align: center;
  justify-items: center;
  overflow-x: hidden;
}
</style>
