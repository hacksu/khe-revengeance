<template>
  <div id="about-container">
    <div id="header-container">
      <span id="title">KENT HACK ENOUGH</span>
      <br>
      <span id="subtitle">2023</span>
    </div>
    <!-- <div class="image-box2 desktop-only">

    </div> -->
    <div id="about-content-container">
      <img style="max-width: 80vh;" src="@/assets/text_rocket.png">
      <div id="about-text-container">
        Kent Hack Enough is <span class="highlight">rocketing off</span> to the unknown! Come join us at this
        space-fairing event as we work together to make outstanding projects!<br><br>
      </div>
    </div>
    <div id="colored-text-container">
      This is our 12th KHE! Whether you're <b>totally new</b> to tech & design or a <b>seasoned pro</b>, come spend a
      weekend making something great with us!
    </div>
    <div class="back"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
@import '@/styles/global.scss';
@import '@/styles/space.scss';

.image-box2 {
  background-position: 0vw 0vh;
  right: 5vw;
  position: absolute;
  // background-image: url("../assets/SunglassesPink.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 25vh;
  max-width: 35vmax;
  height: 40vh;
  max-height: 50vw;
  z-index: -1;
  margin-top: -15vh;
  transform: rotate(-5deg);

  @media only screen and (max-width: $lg-bp3) {
    display: none;
  }
}

#header-container {
  width: 70%;
  margin-top: 100px;
  margin-left: 5vw;
  padding-left: 5vw;
  text-align: left;

  img {
    height: 8vw;
    margin-right: 1vw;
  }
}

#about-container {
  @include bg-flashy;
  min-height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  padding-bottom: 20px;
  position: relative;

  // color: $black-overwrite;
  // font-family: Commando;
  #title {
    font-size: 7vmin;
    font-weight: bold;
  }

  #subtitle {
    font-size: 5vmin;
  }
}

#about-content-container {
  margin: 60px 10vw;
  margin-top: 15px;
  display: flex;

  @media only screen and (max-width: $lg-bp2) {
    flex-flow: column;
  }

  // height: 100%;
  img {
    width: 60vw;
    align-self: center;
  }

  z-index: 1;
  justify-content: space-between;
}

#about-text-container {
  min-height: 200px;
  font-size: 30px;
  // text-align: justify;
  text-align: right;
  padding: 2.5vw;
  line-height: 50px;
  margin-left: 5vw;

  // color: $light-blue;
  .highlight {
    // color: $gold;
    color: #FF0000;
  }

  @media only screen and (max-width: $lg-bp) {
    margin-left: 0vw;
    font-size: 20px;
    line-height: 30px;
  }
}

#colored-text-container {
  // background: $gold;
  // box-shadow: 10px 10px 0px $blue;
  font-size: 24px;
  text-align: left;
  // color: $dark-blue;
  padding: 20px 5vw;
  margin: 0px 15vw 100px;

  @media only screen and (max-width: $lg-bp) {
    font-size: 18px;
  }
}
</style>
