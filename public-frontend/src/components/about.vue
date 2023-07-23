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
      <img id="ascii-rocket" style="max-width: 80vh;" src="@/assets/text_rocket.png">
      <div class="text-container">
        <div id="about-text-container">
          Kent Hack Enough is <span class="highlight">rocketing off</span> to the unknown! Come join us at this
          space-faring event as we work together to make outstanding projects!
        </div>
        <div id="smaller-text-container">
          This is our 12th KHE! Whether you're <b>totally new</b> to tech & design or a <b>seasoned pro</b>, come spend a
          weekend making something great with us!
        </div>
      </div>
    </div>
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

  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;

  img {
    height: 8vw;
    margin-right: 1vw;
  }
}

#ascii-rocket {
  @media only screen and (max-width: $lg-bp2) {
    margin-top: -125px;
    margin-left: 100px;
  }
}

#about-container {
  min-height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  padding-bottom: 20px;
  position: relative;

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
  justify-content: space-between;
  align-items: flex-start;

  @media only screen and (max-width: $md-bp) {
    flex-flow: column;
    margin: 60px 5vw;
  }

  // height: 100%;
  img {
    width: 60vw;
    align-self: center;
  }

  z-index: 1;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-align: right;
}

#about-text-container {
  font-size: 30px;
  // text-align: justify;
  text-align: right;
  line-height: 50px;
  margin-left: 5vw;

  // color: $light-blue;
  .highlight {
    // color: $gold;
    color: #FF0000;
  }

  @media only screen and (max-width: $md-bp) {
    margin-left: 0vw;
    font-size: 20px;
    line-height: 30px;
  }

  @include dark-bg;
}

#smaller-text-container {
  font-size: 24px;
  margin-top: 100px;

  @media only screen and (max-width: $md-bp) {
    font-size: 18px;
    margin-top: 20px;
  }

  @include dark-bg;
}
</style>
