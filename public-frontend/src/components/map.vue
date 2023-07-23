<template>
  <div id="mapframe">
    <div id="map" class="widget">
      <div class="info-container">
        <div class="split" style="">
          <span style="max-width: calc(100% - 20px); display: inline-block">
            <h1 style="font-size: 6.5vh !important">Where to Go</h1>
            <p>
              Kent Hack Enough is graciously hosted in the Kent State Design
              Innovation Hub:
            </p>
            <p id="address">
              <a target="_blank" href="https://goo.gl/maps/gNiw3U7YgymbPA1k6">
                Design Innovation Hub, Art Bldg, Kent, OH 44243
              </a>
            </p>
            <h3>Parking</h3>
            <p id="parking-info">
              The easiest parking space to use will be the Student Center Visitor Lot.
              After parking, walk towards the visitor center, and head left between the buildings.
              The DI Hub is located near the Honors College.
            </p>
            <!-- <p>
              KSU will not be ticketing over the weekend. The two parking lots
              closest to the library are the Visitor Lot right by the bus stop,
              and the R lot by Eastway.
            </p> -->
          </span>
        </div>

        <iframe class="split" id="mapIframe" src="https://map.concept3d.com/?id=568&tbh&sbh#!m/613809?lh/?ct/44418,5603"
          width="600" height="450" scrolling="no" frameborder="0" style="border: 0" @load="reset"></iframe>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Map",
  data() {
    return {
      scrollPos: 0,
      prevented: false,
    };
  },
  methods: {
    reset() {
      this.prevented = false;
    },
    preventScroll(event) {
      const pos = document.documentElement.scrollTop;
      const diff = pos - this.scrollPos;
      if (
        diff >= 100 &&
        !this.prevented &&
        event.target.activeElement.tagName === "IFRAME"
      ) {
        this.prevented = true;
        console.log("prevent scroll", pos, event);
        event.preventDefault();
        document.documentElement.scrollTop = this.scrollPos;
      } else {
        this.scrollPos = pos;
      }
    },
  },
  mounted() {
    // const iframe = this.$el.getElementsByTagName("iframe")[0];
    // iframe.addEventListener("load", console.log);
    document.addEventListener("scroll", this.preventScroll);
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.preventScroll);
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import "@/styles/space.scss";

#directions {
  text-align: left;
  flex: 1 1 500px;
  padding-right: 2rem;
}

#address {
  margin: 10px 0;
  text-decoration: underline;
}

#mapframe {
  background: linear-gradient(to bottom, #0000 0%, #000b 50px, #000b 100%);
}

.info-container {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  margin: 0 auto;
  @include dark-bg;
}

#mapIframe {
  flex: 1 1 500px;
  border-radius: 2%;
}

#parking-info {
  margin-bottom: 30px;
}

.widget {
  padding: 1rem;
}

p {
  font-size: 20px;
}

h1 {
  margin: 20px 0;
}

a,
a:visited {
  color: white;
}

h3 {
  font-size: 24px;
  margin: 20px 0 10px;
}

.widget {
  padding: 20px;
}

.info-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.split {
  width: 100%;
  z-index: 1;
  text-align: left;
}

@media screen and (min-width: 768px) {
  .widget {
    padding: 100px 100px 100px 100px;
  }

  .split {
    width: 50%;
  }
}

@media screen and (max-width: 1199px) {
  .split {
    width: 100%;
  }
}
</style>


