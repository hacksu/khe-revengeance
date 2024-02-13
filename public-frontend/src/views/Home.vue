<template>
  <div class="home">
    <Landing></Landing>
    <About></About>
    <FAQ></FAQ>
    <div id="sponsors-container">
      <h3><router-link to="/sponsors">Our Sponsors:</router-link></h3>
      <Sponsors :row="true" :item-width="200" :item-height="50" />
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

#sponsors-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  margin: 0px 10vw;
  @media only screen and (max-width: $md-bp) {
    margin: 10px 5vw;
  }
}

</style>
