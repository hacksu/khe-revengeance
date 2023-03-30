<template>
  <div id="sponsors" style="margin-top: -53px; min-height: calc(100vh - 80px - 50px)">
    <div class="back" style="">
    </div>

    <img src="/Logo.svg" style="margin-top: 4vh" />
    <h1 class="sponsorship-title">SPONSORSHIP</h1>

    <div v-if="sponsors.length > 0">
      <!-- <h2 class="sponsor-thanks" style="margin-left: auto; margin-right: auto">Thanks to these amazing companies for sponsoring Kent Hack Enough 2021!</h2> -->
      <br />
      <div id="sponsors-container">
        <h2 class="sponsor-thanks" style="margin-left: auto; margin-right: auto">
          Thanks to these amazing companies for sponsoring Kent Hack Enough
          2022!
        </h2>
        <div v-for="(sponsorGroup, groupIndex) in sponsors" v-bind:key="groupIndex">
          <a class="sponsor" v-for="sponsor in sponsorGroup instanceof Array
            ? sponsorGroup
            : [sponsorGroup]" v-bind:href="sponsor.link" v-bind:key="sponsor.name">
            <!-- <img class="logo" v-bind:src="sponsor.logo" v-bind:alt="sponsor.name" v-bind:style="sponsor.style"> -->
            <span class="logo" v-bind:src="sponsor.logo" v-bind:id="'sponsorlogo-' + sponsor.id" v-bind:alt="sponsor.name"
              v-bind:style="sponsor.style"></span>
          </a>
        </div>
      </div>

      <br /><br />
    </div>

    <div v-if="allowSponsorship">
      <p style="
                      font-size: 5vmin;
                      max-width: 1200px;
                      margin-left: auto;
                      margin-right: auto;
                    ">
        Looking to sponsor Kent Hack Enough?
      </p>
      <br />
      <p style="
                      font-size: 3vmin;
                      max-width: 1200px;
                      margin-left: auto;
                      margin-right: auto;
                    ">
        We look forward to working with you for the 9th year of KHE! Below are
        the following three tiers for Kent Hack Enough 2020! We will issue an
        itemized invoice once tier is confirmed. Please reach out to us if you
        are interested in sponsoring with an amount that is not posted below.
      </p>
      <div class="center">
        <button class="contact" style="cursor: pointer; width: 250px; max-width: 60vw">
          <a style="text-decoration: none" href="mailto:joshua@khe.io?subject=KHE Sponsorship Interest">Contact Us</a>
        </button>
      </div>
      <span style="display: block; margin-top: -4%; color: white">joshua@khe.io, katie@khe.io</span>

      <div class="center">
        <button class="paypal" style="cursor: pointer; width: 250px; max-width: 60vw">
          <a style="text-decoration: none" href="https://www.paypal.com/myaccount/transfer/homepage">Pay via PayPal</a>
        </button>
      </div>

      <span style="display: block; margin-top: -4%; color: white">
        If campus closes during the fall due to COVID-19, access to our campus
        organization mailbox is not guaranteed. Due to this, we are moving to
        paperless payment. If there are issues, please reach out via the
        "Contact Us" button.
      </span>
      <span style="display: block; margin-top: 0%; color: white">
        PayPal Instructions: Payment should be addressed to "staff@khe.io".
        Selecting "Sending to a friend" keeps your contribution free of PayPal
        service fees.</span>

      <div id="container">
        <div id="tier1" class="tier" v-on:click="tier1()">
          <div id="colorTier1">
            <!--<img src="@/assets/images/cassetteTape.png">-->
            <div style="
                            transform: scale(0.5);
                            height: 160px;
                            width: calc(100% - 40px);
                            padding: 20px;
                            background-size: contain;
                            background-position: center;
                            background-repeat: no-repeat;
                          " id="cassette-img"></div>
          </div>
          <h2>Cassette Tape</h2>
          <p class="specialText2">$250</p>
          <div class="center">
            <button class="open">Learn more!</button>
          </div>
        </div>

        <div id="tier2" class="tier" v-on:click="tier2()">
          <div id="colorTier2">
            <!--<img src="@/assets/images/sunglasses.png">-->
            <div style="
                            transform: scale(0.6);
                            height: 160px;
                            width: calc(100% - 40px);
                            padding: 20px;
                            background-size: contain;
                            background-position: center;
                            background-repeat: no-repeat;
                          " id="sunglasses-img"></div>
          </div>

          <h2>Sunglasses</h2>
          <p class="specialText2">$500</p>
          <div class="center">
            <button class="open">Learn more!</button>
          </div>
        </div>

        <div id="tier3" class="tier" v-on:click="tier3()">
          <div id="colorTier3">
            <!--<img src="@/assets/images/keyboard.png">-->
            <div style="
                            transform: scale(0.85);
                            height: 160px;
                            width: calc(100% - 40px);
                            padding: 20px;
                            background-size: contain;
                            background-position: center;
                            background-repeat: no-repeat;
                          " id="keyboard-img"></div>
          </div>

          <h2>Keyboard</h2>
          <p class="specialText2">$1000</p>
          <div class="center">
            <button class="open">Learn more!</button>
          </div>
        </div>

        <div id="detailsTier1" style="display: none" v-on:click="buttonClose1($event)">
          <div id="contextTier1" class="contextTier">
            <div class="center">
              <h2>Cassette Tape</h2>
            </div>
            <p class="specialText">Logo on website</p>
            <p>Plus the following perks!</p>
            <ul>
              <li>Ability to send virtual mentors</li>
              <li>Thanked at opening ceremonies</li>
              <li>Judge at final hacks</li>
              <li>Resume book after event</li>
            </ul>
            <div class="center">
              <button class="close" v-on:click="buttonClose1()">Close</button>
            </div>
          </div>
        </div>

        <div id="detailsTier2" style="display: none" v-on:click="buttonClose2($event)">
          <div id="contextTier2" class="contextTier">
            <div class="center">
              <h2>Sunglasses</h2>
            </div>
            <p class="specialText">Run a workshop</p>
            <p>Plus the following perks!</p>
            <ul>
              <li>Ability to send virtual mentors</li>
              <li>Thanked at opening ceremonies</li>
              <li>Judge at final hacks</li>
              <li>Logo on website</li>
              <li>Resume book after event</li>
              <li>Resume book before event</li>
              <li>Brand mention in post before the event</li>
              <li>Company dedicated chat room</li>
            </ul>
            <div class="center">
              <button class="close" v-on:click="buttonClose2()">Close</button>
            </div>
          </div>
        </div>

        <div id="detailsTier3" style="display: none" v-on:click="buttonClose3($event)">
          <div id="contextTier3" class="contextTier">
            <div class="center">
              <h2>Keyboard</h2>
            </div>
            <p class="specialText">Keynote speaker & One-on-one recruitment</p>
            <p>Plus the following perks!</p>
            <ul>
              <li>Ability to send virtual mentors</li>
              <li>Thanked at opening ceremonies</li>
              <li>Judge at final hacks</li>
              <li>Logo on website</li>
              <li>Run a workshop</li>
              <li>Resume book after event</li>
              <li>Resume book before event</li>
              <li>Brand mention in post before the event</li>
              <li>Company dedicated chat room</li>
              <li>
                Brand promo video during opening ceremonies provided by company
              </li>
              <li>Brand challenge</li>
            </ul>
            <div class="center">
              <button class="close" v-on:click="buttonClose3()">Close</button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  </div>
</template>

<script>
import Sponsors from "@/sponsors.js";
export default {
  name: "Sponsor",
  computed: {},
  methods: {
    tier1: function () {
      var x = document.getElementById("detailsTier1");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },
    // buttonClose1: function (evt) {
    //   if (evt && evt.target.id.indexOf("detailsTier") >= 0) {
    //   } else if (evt) {
    //     return false;
    //   }
    //   var x = document.getElementById("detailsTier1");
    //   x.style.display = "none";
    // },
    // tier2: function () {
    //   var x = document.getElementById("detailsTier2");
    //   if (x.style.display === "none") {
    //     x.style.display = "block";
    //   } else {
    //     x.style.display = "none";
    //   }
    // },
    // buttonClose2: function (evt) {
    //   if (evt && evt.target.id.indexOf("detailsTier") >= 0) {
    //   } else if (evt) {
    //     return false;
    //   }
    //   var x = document.getElementById("detailsTier2");
    //   x.style.display = "none";
    // },
    // tier3: function () {
    //   var x = document.getElementById("detailsTier3");
    //   if (x.style.display === "none") {
    //     x.style.display = "block";
    //   } else {
    //     x.style.display = "none";
    //   }
    // },
    // buttonClose3: function (evt) {
    //   if (evt && evt.target.id.indexOf("detailsTier") >= 0) {
    //   } else if (evt) {
    //     return false;
    //   }
    //   var x = document.getElementById("detailsTier3");
    //   x.style.display = "none";
    // },
    nothing: function () {
      // do nothing. ignore clicks
    },
  },
  mounted() {
    //this.sponsors = Sponsors;
    //console.log(this.sponsors);
    // document.getElementById(
    //   "cassette-img"
    // ).style.backgroundImage = `url(${cassette})`;
    // document.getElementById(
    //   "sunglasses-img"
    // ).style.backgroundImage = `url(${sunglasses})`;
    // document.getElementById(
    //   "keyboard-img"
    // ).style.backgroundImage = `url(${keyboard})`;
    // this.$parent.wrapper.sponsorSource
    //   .getSponsors()
    //   .then((data) => {
    //     //this.sponsors = data;
    //     console.log("SPONSORS", this.sponsors);
    //   })
    //   .catch(console.error);
  },
  data() {
    return {
      allowSponsorship: false,
      sponsors: Sponsors,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/global.scss';

//   #sponsor {
//   text-align: center;
//   margin-left: auto;
//   margin-right: auto;
//   height: 100vh;
//   width: 100vw;
// }
#sponsors .back {
  @include bg-flashy;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
}

.sponsor-thanks {
  color: color('text-secondary');
  width: 600px;
  max-width: 80vw;
}

#sponsors-container {
  @include bg-secondary;
  max-width: 80vw;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2vh;
  padding: 3.5vh;
}

// .sponsor-thanks {
// //   width: 400px;
// //   max-width: 80vw;
//   width: 80vw;
//   font-family: "Buba-Shadow";
//   color: #8AE87B;
//   font-size: 2vmax;
//   border: none;
//   background: none;
//   cursor: pointer;
//   letter-spacing: inherit;
//   margin: 0px!important;
//   &:after {
//     content: "Thanks to these amazing companies for sponsoring Kent Hack Enough 2021!";
//     left: calc(5vw);
//     // left: 0px;
//     width: 80vw;
//     // max-width: 80vw;
//     position: absolute;
//     font-family: 'Buba-Outline';
//     color: #36355E;
//   }
//   @media only screen and (min-width: 560px) {
//     font-size: 3vh;
//   }
// }

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

#container {
  //display: flex;
  //flex-direction: row;
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
  overflow: clip;
  text-align: center;
}

.tier {
  @include bg-secondary;
  //display: flex;
  display: inline-block !important;
  //flex-direction: column;
  //flex: 1;
  margin: 20px;
  text-align: center;
  color: black;
  height: 420px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s, filter 0.25s, -webkit-transform 0.25s,
    -webkit-filter 0.25s;
  cursor: pointer;
  max-width: 300px;
  min-width: 300px;
  width: 20%;
}

#tier1 {
  display: block;
  border-radius: 0.25rem;
  margin-top: 5%;
  background-color: #92d4e7;
}

#tier1:hover {
  transform: scale(1.1);
  filter: brightness(120%);
}

#tier2 {
  display: block;
  border-radius: 0.25rem;
  margin-top: 5%;
}

#tier2:hover {
  transform: scale(1.1);
  filter: brightness(120%);
}

#tier3 {
  display: block;
  border-radius: 0.25rem;
  background-color: #70c86b;
  margin-top: 5%;
}

#tier3:hover {
  transform: scale(1.1);
  filter: brightness(120%);
}

p.specialText {
  color: rgb(79, 27, 223);
  font-style: italic;
  font-family: "Dagger Square";
}

p.specialText2 {
  color: rgb(79, 27, 223);
  font-family: "Dagger Square";
  font-size: 45px;
}

p {
  margin: 0;
}

h1 {
  text-align: center;
}

// h2 {
//   font-family: Lazer84;
//   letter-spacing: 0.5vmin;
// }

img:not(.logo) {
  //   height: 200px;
  width: 30vh;
  max-width: 50vw;
}

button {
  margin: 5%;
  background-color: rgb(207, 43, 194);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid rgb(207, 43, 194);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: 0.3s;
  font-family: abel;
}

a {
  text-decoration: none;
  color: white;
}

button:hover {
  opacity: 1;
}

#detailsTier1,
#detailsTier2,
#detailsTier3 {
  font-family: "Dagger Square";
  border-radius: 0.25rem;
  position: fixed;
  /* Stay in place */
  z-index: 1;
  /* Sit on top */
  left: 0px;
  top: 0px;
  width: 100vw;
  /* Full width */
  height: 100vh;
  /* Full height */
  overflow: auto;
  /* Enable scroll if needed */
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4);
  /* Black w/ opacity */
}

.contextTier {
  border: 1px solid #888;
  max-width: 80vh;
  /* Could be more or less, depending on screen size */
  max-width: 400px;
  width: 90vw;
  height: 60%;
  text-align: left;
  border-radius: 0.25em;
}

#contextTier1 {
  background-color: #92d4e7;
  margin: 20vh auto;
  /* 15% from the top and centered */
  padding: 20px;
}

#contextTier2 {
  background-color: #f3ea5f;
  margin: 20vh auto;
  /* 15% from the top and centered */
  padding: 20px;
}

#contextTier3 {
  background-color: #70c86b;
  margin: 20vh auto;
  /* 15% from the top and centered */
  padding: 20px;
}

.close {
  color: rgb(255, 255, 255);
  float: right;
  font-size: 2vh;
  font-weight: bold;
  max-width: 60vw;
  width: 200px;
}

.close:hover,
.close:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.open {
  color: rgb(255, 255, 255);
  float: right;
  font-size: 2.5vh;
  font-weight: bold;
  max-width: 60vw;
  width: 200px;
}

.open:hover,
.open:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.contact {
  color: rgb(255, 255, 255);
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-top: 3vh;
}

.paypal {
  color: rgb(255, 255, 255);
  background-color: rgb(1, 140, 219);
  border: 2px solid rgb(1, 140, 219);
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-top: 3vh;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sponsor {
  padding: 20px;
  text-decoration: none;

  .logo {
    transition: transform 0.25s;
    height: 15vmin;
    max-width: calc(23vmax - 60px);
    width: 100vw;
    padding: 20px;
  }

  /*:hover {
    transform: scale(1.1)!important;
  }*/
}

/*
@font-face {
    font-family: abel;
    src: url("./assests/fonts/abel-regular.ttf");
}

@font-face {
    font-family: Lazer84;
    src: url("./assests/fonts/Lazer84.ttf");
}

@font-face {
    font-family: 'Dagger Square';
    src: url("./assests/fonts/DAGGERSQUARE.otf");
}*/
</style>
