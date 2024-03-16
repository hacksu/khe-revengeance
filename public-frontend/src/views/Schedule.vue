<template>
  <div id="schedule-container">
      <h1>{{ schedule.name }}</h1>
      <div id="schedule-cards">
        <div v-for="item of schedule.items">
        <Card class="schedule-card">
          <template #title>{{ item.name }}</template>
          <template #subtitle>{{ dateToString(item.date) }}</template>
          <template #content>{{ item.description }}</template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { Schedule } from "../../../global-includes/schedule";
import Card from "primevue/card";

const schedule = ref({});

onMounted(async () => {
  const selected = await Schedule.getSelectedSchedule();
  selected.items = selected.items.map(item => {
    item.date = new Date(item.date);
    return item;
  })
  schedule.value = selected;
});

const dateToString = (date) => {
  return date.toLocaleString('en-US', 
    { 
      year: "numeric", 
      month: "numeric", 
      day: "numeric", 
      hour: 'numeric', 
      hour12: true 
    }
  );
}

</script>

<style lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#schedule-container {
  margin: 150px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

#schedule-cards {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 75%;

  .schedule-card {
    border-radius: 5px;
    padding: 10px 15px;
    border: 1px solid white;
  }
}

</style>