<template>
  <div id="schedule" style="min-height: calc(100vh - 80px - 50px);">
    <div class="back">

    </div>
    <br>
    <h1 style="font-size: 7.5vmin!important;">
      SCHEDULE
    </h1>
    <div class="flex-schedule">
      <div class="day" v-for="day in days" v-bind:id="day.name" v-bind:key="day.name">
        <h2>{{ day.relative }}</h2>
        <h3>{{ day.humanDate }}</h3>
        <span class="event-holder">
          <div class="event" v-for="event in day.events" v-bind:key="event.id">
            <div v-if="event.nextEvent" class="next holder">
              <h2 style="margin-bottom: 10px; transform: scale(0.8); font-weight: normal"><b>{{ (event.type ? event.type :
                  '')
              }}</b>{{ (event.type ? ' - ' : '') + event.title }}</h2>
              <h3 class="time">{{
                (event.start && event.end && event.start.getTime() === event.end.getTime()) ? (
                  (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                ) : (
                  (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                  + ' ' + 
                  ((event.end) ? ('- ' + event.end.toLocaleTimeString('en-US', { timeStyle: 'short' })) : '')
                )
              }}</h3>
              <span class="description" style="font-size: 20px; opacity: 0.9;"
                v-if="event.description && event.description.length > 0">{{ event.description }}</span>
              <br v-if="event.location">
              <a class="location" v-if="event.location && event.location.startsWith('http')" style="text-align: center;" v-bind:href="event.location">{{
                  event.icon || event.location
              }}</a>
              <span class="location" v-if="event.location && !event.location.startsWith('http')" style="text-align: center;">
                {{event.icon || event.location}}
              </span>
            </div>
            <div v-else class="holder">
              <div style="min-height: 24px" hidden>
                <!--<span class="time">{{ event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }) }} - {{ event.end.toLocaleTimeString('en-US', { timeStyle: 'short' }) }}</span>
              -->
                <span class="time">{{ 
                  (event.start && event.end && event.start.getTime() === event.end.getTime()) ? (
                    (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                  ) : (
                    (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                    + ' ' + 
                    ((event.end) ? ('-' + event.end.toLocaleTimeString('en-US', { timeStyle: 'short' })) : '')
                  )
                }}</span>

                <span class="type" v-bind:style="{ 'opacity': (event.type ? 1 : 0), }">{{ event.type || '_' }}</span>
                <h3 class="name">{{ event.title }}</h3>

              </div>

              <div style="min-height: 24px; display: flex; justify-content: space-between;">
                
                <span class="time">{{ 
                  (event.start && event.end && event.start.getTime() === event.end.getTime()) ? (
                    (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                  ) : (
                    (event.start.toLocaleTimeString('en-US', { timeStyle: 'short' }))
                    + ' ' + 
                    ((event.end) ? ('- ' + event.end.toLocaleTimeString('en-US', { timeStyle: 'short' })) : '')
                  )
                }}</span>

                <h3 class="name">{{ event.title }}</h3>

                <span class="type" v-bind:style="{ 'opacity': (event.type ? 1 : 0), }">{{ event.type || '_' }}</span>
                
              </div>

              <br>
              <p class="description" v-if="event.description" style="text-align: center;">{{ event.description }}</p>
              <br v-if="event.location">
              <span v-if="event.location" style="padding-right: 10px;">Location:</span>
              <a class="location" v-if="event.location && event.location.startsWith('http')" style="text-align: center;" v-bind:href="event.location">{{
                  event.icon || event.location
              }}</a>
              <span class="location" v-if="event.location && !event.location.startsWith('http')" style="text-align: center;">{{
                  event.icon || event.location
              }}</span>
            </div>

          </div>
        </span>
      </div>

      <!--
     <div class="day" id="friday">
       <h2>Friday, September 27th</h2>
         <div class="event" v-for="event in schedule.fridayEvents" v-bind:key="event.id">
           <span class="name">{{ event.title }}</span><br>
           <span class="time">{{ event.start }}</span>
           <span v-if="event.location != ''"> | </span>
           <span class="location">{{ event.location }}</span>
           <span class="description">{{ event.description }}</span>
         </div>
     </div>

     <div class="day" id="saturday">
       <h2>Saturday, September 28th</h2>
         <div class="event" v-for="event in schedule.saturdayEvents" v-bind:key="event.id">
           <span class="name">{{ event.title }}</span><br>
           <span class="time">{{ event.startTime }}</span>
           <span v-if="event.location != ''"> | </span>
           <span class="location">{{ event.location }}</span>
           <span class="description">{{ event.description }}</span>
         </div>
     </div>

     <div class="day" id="sunday">
       <h2>Sunday, September 29th</h2>
         <div class="event" v-for="event in schedule.sundayEvents" v-bind:key="event.id">
           <span class="name">{{ event.title }}</span><br>
           <span class="time">{{ event.startTime }}</span>
           <span v-if="event.location != ''"> | </span>
           <span class="location">{{ event.location }}</span>
           <span class="description">{{ event.description }}</span>
         </div>
     </div>
   -->


    </div>
  </div>
</template>

<script>
//import schedule from '../schedule.json';

var weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

let month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

let relativeDays = [
  'Today',
  'Tomorrow',
];

function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

function getNow() {
  let now = new Date();
  if (window.thingy && window.thingy.$route.query.add) {
    now = new Date(now.getTime() + Number(window.thingy.$route.query.add) * 1000);
  }
  //console.log(now);
  return now;
}

function getDayOfYear(dateObject = false) {
  var now = dateObject || getNow();
  var start = new Date(now.getFullYear(), 0, 0);
  var oneDay = 1000 * 60 * 60 * 24;
  var diff = now - (now % oneDay) - start;
  var day = Math.ceil(diff / oneDay);
  return day;
}

let dayTemplate = function (day) {
  let name = weekday[day.getDay()];
  let humanDate = `${month[day.getMonth()]} ${getOrdinalNum(day.getDate())}`;
  return {
    name: name,
    date: day,
    readable: `${name}, ${humanDate}`,
    humanDate: humanDate,
    events: [],
  }
}

export default {
  main: 'Main',
  data() {
    return {
      //schedule
      daysold: [],
      showPast: true,
      data: {},
    }
  },
  computed: {
    days() {
      return this.getDays();
    },
  },
  methods: {
    getDays(changed = false) {
      if (changed) {
        //this.data = changed;
      }
      if (!this.data.events) {
        return;
      }
      window.thingy = this;
      let now = getNow();
      let dayOfYear = getDayOfYear();
      let showPast = this.showPast || false;
      let days = this._days || {};
      let first = true;
      let resets = {};
      for (let x of this.data.events.filter(o => showPast || o.end >= now)) {
        if (!days[x.dayIndex]) {
          let day = x.start;
          let indx = x.dayIndex
          let day2 = dayTemplate(x.dayDate);
          day2.ofYear = getDayOfYear(day2.date);
          //console.log(day2);
          let diff = day2.ofYear - dayOfYear;
          if (diff >= relativeDays.length || diff < 0) {
            day2.relative = day2.name;
          } else {
            day2.relative = relativeDays[diff];
          }
          days[x.dayIndex] = day2;
        }
        let day = days[x.dayIndex];
        if (changed) {
          if (!resets[x.dayIndex]) {
            resets[x.dayIndex] = true;
            day.events = [];
          }
          day.events.push(x);
        }
      }
      for (let i in days) {
        days[i].events = days[i].events.filter(o => showPast || o.end >= now);
        for (let x of days[i].events) {
          if (first) {
            first = false;
            this.nextEvent = x;
            x.nextEvent = true;
          }
        }
      }
      this._days = days;
      console.log(this._days);
      return this._days;
    },
    async fetchEvents() {
      if (this.loadingData) {
        //this.parseEvents();
        return;
      }
      this.loadingData = true;
      let data = await (await fetch('https://api.khe.io/v1.0/events')).json();
      for (let x of data.events) {
        x.start = new Date(x.start);
        if (x.end) {
          x.end = new Date(x.end);
        }
        let day = x.start;
        let indx = ([day.getMonth() + 1, day.getDate(), day.getFullYear()]).join('-');
        x.dayDate = day;
        x.dayIndex = indx;
      }
      this.data = data;
      //this._computedWatchers.days.getter(true);
      this.getDays(true);
      //this.$forceUpdate();
      //this.$computed.days(true);
      //this.parseEvents();
      let _this = this;
      setTimeout(function () {
        _this.loadingData = false;
      }, 2000)
    },
    parseEvents(past = true) {
      if (true) {
        return this.$forceUpdate();
      }
      let days = {};
      let data = this._data;
      //console.log(data);
      let dayTemplate = function (day) {
        let name = weekday[day.getDay()];
        let humanDate = `${month[day.getMonth()]} ${getOrdinalNum(day.getDate())}`;
        return {
          name: name,
          date: day,
          readable: `${name}, ${humanDate}`,
          humanDate: humanDate,
          events: [],
        }
      }
      let now = getNow().getTime(); //new Date().getTime();
      let dayOfYear = getDayOfYear();
      let first = true;
      for (let x of data.events.filter(o =>
        past || new Date(o.end).getTime() >= now
      )) {
        x.start = new Date(x.start);
        x.end = new Date(x.end);
        if (first) {
          first = false;
          this.nextEvent = x;
          x.nextEvent = true;
        }
        let day = x.start;
        let indx = ([day.getMonth() + 1, day.getDate(), day.getFullYear()]).join('-');
        if (!days[indx]) {
          let day2 = dayTemplate(day);
          day2.ofYear = getDayOfYear(day2.date);
          let diff = day2.ofYear - dayOfYear;
          //console.log("diff =", diff)
          if (diff > relativeDays.length || diff < 0) {
            day2.relative = day2.name;
          } else {
            day2.relative = relativeDays[diff];
          }
          days[indx] = day2;
        }
        days[indx].events.push(x);
        //if (!days[day.get])
      }
      //console.log(days);
      //this.days = Object.values(days);
      //this.loop();
      //console.log(this);
      //console.log(this.days);
      this.$forceUpdate();
    },
    getNextMessage() {
      if (this.nextEvent) {
        let evt = this.nextEvent;
        let now = getNow(); //new Date();
        let remainingStart = now - evt.start;
        let remainingEnd = now - (evt.end | evt.start);
        //console.log(evt);
        //console.log(remainingStart);
        //evt.nextMessage = String(remainingStart);
      } else {
        //evt.nextMessage = '';
      }

    },
    loop() {
      //this.getNextMessage();
      let now = new Date();
      if (now - (this.lastFetch || 0) >= 60000) {
        this.lastFetch = now;
        this.fetchEvents();
      }
    },
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchEvents'
  },
  created() {
    this.fetchEvents();

  },
  mounted() {
    let _this = this;
    this.autoUpdate = setInterval(_this.loop, 1000);
  },
  beforeUnmount() {
    if (this.autoUpdate) {
      clearInterval(this.autoUpdate);
      delete this.autoUpdate;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/global.scss';

$small: 500px;

#schedule {
  padding: 100px 5vw 80px 5vw;
  padding-top: 50px;
  margin: 0px;
  text-align: left;
  text-align: center;
  justify-items: center;
}

.back {
  @include bg-flashy;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
}

.back .squiggly {
  margin-top: 8vh;
  height: 84vh;
  width: 100vw;
  position: absolute;
  top: 0px;
  left: 0px;
  background-image: url(../assets/squiggly-back.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: -2;
}

p {
  margin: 0;
}

h1,
h2,
h3 {
  text-align: center;
}

h2 {
  font-size: 5vmin;
}

h3 {
  font-size: 3vmin;
  font-weight: normal;
}

.day {
  max-width: 1000px;
  width: calc(98vw - 8vh);
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  // background-color: white;
  @include bg-secondary;
  border-radius: 2vh;

  padding: 2vh;
  margin-bottom: 4vh;

  h2 {
    margin-bottom: 0px;
    color: black;
  }

  h3 {
    margin-top: 0px;
    color: black;
  }


  .event:first-child {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .event:last-child {
    border-bottom: none;
  }

  .event {
    // border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .holder {
      //background-color: white;
      //border-radius: 2vh;
      padding: 2vh;
      margin-bottom: 1vh;

      p {
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .next {
      display: inline-block;
      border-radius: 2vh;
      padding: 2vh;
      margin-bottom: 2vh;
    }

    .holder:not(.next) {
      div {
        @media screen and (max-width: $small) {
          margin-bottom: -30px;
        }
      }

      .time {
        // float: left;
        padding-left: 1vh;
        padding-right: 1vh;
        // width: 136px;
        width: 160px;
      }

      .type {
        font-weight: bold;
        // float: left;
        //padding-right: 2vh;
        // width: 120px;
        width: 160px;
        padding-left: 1vh;
        padding-right: 1vh;

      }

      .name {
        // text-align: left;
        // float: left;
        color: black;
        font-size: 18px;

        @media screen and (max-width: $small) {
          display: block;
          text-align: center;
          float: none;
        }
      }

      .description {
        opacity: 0.9;
        display: block;
      }
    }
  }
}

/*
  #schedule {
    padding: 10px 15vw;
    background-color: $sand;
    text-align: left;
  }

  .event {
    margin-bottom: 1.5em;
  }

  div.day {
    width: 100%;
    padding-bottom: 1em;
  }

  div span {
    font-size: 1.2em;
    font-weight: bold;
  }

  h2 {
    font-size: 1.5em;
    font-weight: bold;
  }

  body {
    padding: 0;
    margin: 0;
    margin-bottom: 200px;
  }

  @media only screen and (min-width: 900px) {
    schedule {
      padding: 2rem 6rem;
      background-color: $sand;
    }

    .flex-schedule {
      display: flex;
      flex-wrap: wrap;
    }

    .day + .day {
      padding-left: 2%;
    }

    div.day {
      text-align: left;
      width: 32%;
      font-size: 1.2em;
    }

    h2 {
      font-size: 1.8em;
      font-weight: bold;
    }
  }*/
</style>
