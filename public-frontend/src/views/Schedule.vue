<template>
  <div id="schedule-container">
    <h1>{{ scheduleName }}</h1>
    <div id="schedule-cards">
      <div v-for="section of Object.keys(sections).sort(dateSort)">
        <div class="section">
          <h2>{{ section }}</h2>
          <div class="cards">
            <div v-for="item of sections[section]">
              <Card class="card">
                <template #title>{{ item.name }}</template>
                <template #subtitle>{{ item.description }}</template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { Schedule } from "../../../global-includes/schedule";
import Card from "primevue/card";

const name = ref("");
const sections = ref({});

onMounted(async () => {
  const selected = await Schedule.getSelectedSchedule();
  name.value = selected.name;

  const sectionsMap = {};
  selected.items.forEach(({ name, date, description })=> {
    const dateString = dateToString(new Date(date));
    const section = sectionsMap[dateString];
    const item = { name, description };
    if (section) sectionsMap[dateString].push(item);
    else sectionsMap[dateString] = [ item ];
  })
  sections.value = sectionsMap;
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

const dateSort = (d, d1) => new Date(d).getTime() - new Date(d1).getTime();

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
  flex-direction: column;
  gap: 10px;

  .section {
    display: flex;
    flex-direction: column;

    .cards {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 10px;
      min-width: 100%;

      .card {
        border-radius: 5px;
        padding: 10px 15px;
        min-width: 100%;
        border: 1px solid white;
      }
    }
  }


}

</style>