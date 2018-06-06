<template>
  <div>
    <section class="section">
      <div class="columns is-mobile">
        <div class="column">
          <h4 class="title">{{full_name}} - {{email}}</h4>
          <b-table :data="event_attendee" :columns="columns"></b-table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    async asyncData({app, params}) {
      const {
        email,
        full_name,
        event_attendee
      } = await app.$axios.$get(`attendees/${params.id}/`);
      return {
        email,
        full_name,
        event_attendee
      }
    },
    data() {
      return {
        columns: [
          {
            field: 'event.event_name',
            label: 'Event Name',
          },
          {
            field: 'event.date',
            label: 'Event Date',
          },
          {
            field: 'pre_registered',
            label: 'Pre Registered',
          },
          {
            field: 'call_complete',
            label: 'Call Complete'
          }
        ]
      }
    }
  }
</script>

<style scoped>
</style>
