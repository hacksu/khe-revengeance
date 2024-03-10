<template>
  <div class="home">
    <Landing></Landing>
    <About></About>
    <FAQ></FAQ>
    <div class="sponsors">
      <div class="container" id="sponsors-container">
        <h3><router-link to="/sponsor">Our Sponsors:</router-link></h3>
        <Sponsors :row="true" :item-width="200" :item-height="50" />
      </div>
    </div>
    <Map></Map>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Landing from '@/components/landing.vue';
import About from '@/components/about.vue';
import FAQ from '@/components/faq.vue';
import Map from '@/components/map.vue';
import Footer from '@/components/footer.vue';
import Sponsors from '@/components/sponsors.vue';

export default {
  name: 'home',
  components: {
    Landing,
    About,
    FAQ,
    Map,
    Footer,
    Sponsors,
  }
}
</script>

<style scoped lang="scss">
@import '@/globalVars.scss';

.sponsors {  
  margin: 0px 10vw; 
  @media only screen and (max-width: $md-bp) {
    margin: 10px 5vw;
  }
}

.sponsors .container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}

</style>