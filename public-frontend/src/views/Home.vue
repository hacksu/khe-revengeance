<template>
  <div class="home">
    <Landing></Landing>
    <About></About>
    <FAQ></FAQ>
    <Map></Map>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Landing from '@/components/landing.vue';
import About from '@/components/about.vue';
import FAQ from '@/components/faq-virtual.vue';
import Map from '@/components/map.vue';
import Footer from '@/components/footer.vue';

export default {
  name: 'home',
  components: {
    Landing,
    About,
    FAQ,
    Map,
    Footer,
  }
}
</script>

<style scoped lang="scss">

</style>
