<template>
  <div id="schedule-container">
    <h1>{{ name }}</h1>
    <template v-for="section in sections">
      <h2>{{section.section}}</h2>
      <DataTable :value="section.items">
        <Column field="name" header="Event" />
        <Column header="Time">
          <template #body="slotProps">
            {{ new Date(slotProps.data.date).toLocaleTimeString() }}
          </template>
        </Column>
      </DataTable>
    </template>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { Schedule } from "../../../global-includes/schedule";

const name = ref("");
const sections = ref([]);

onMounted(async () => {
  const selected = await Schedule.getSelectedSchedule();
  name.value = selected.name;

  const sectionsMap = {};
  selected.items.forEach(({ name, date, description })=> {
    const dateString = dateToString(new Date(date));
    const section = sectionsMap[dateString];
    const item = { name, date, description };
    if (section) sectionsMap[dateString].push(item);
    else sectionsMap[dateString] = [ item ];
  });

  const sectionsArray = [];
  for (const section of Object.keys(sectionsMap)) {
    sectionsArray.push({
      section,
      items: sectionsMap[section].sort((i1, i2) => dateSort(i1.date, i2.date))
    });
  }
  sectionsArray.sort(
    (s1, s2) => dateSort(s1.items[0].date, s2.items[0].date)
  );
  sections.value = sectionsArray;
});

const dateToString = (date) => {
  return date.toLocaleString('en-US', 
    {
      weekday: "long", 
      month: "long", 
      day: "numeric"
    }
  );
}

const dateSort = (d, d1) => new Date(d).getTime() - new Date(d1).getTime();

</script>

<style lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#schedule-container {
  margin: 100px auto;
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