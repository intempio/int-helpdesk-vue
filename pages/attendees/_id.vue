<template>
  <div>
      <section class="section">
        <div class="columns is-mobile">
          <div class="column">
            <h4 class="title">{{full_name}} - {{email}}</h4>
            <b-table :data="event_attendees" :columns="columns"></b-table>
          </div>
        </div>
      </section>
  </div>
</template>

<script>
  export default {
    created() {
      this.fetchAttendee()
    },
    methods: {
      fetchAttendee() {
        this.$axios.$get(`attendees/${this.$route.params.id}/`).then(({email, full_name, event_attendee}) => {
          this.email = email;
          this.full_name = full_name;
          this.event_attendees = event_attendee;
        })
      }
    },
    data() {
      return {
          email: '',
          full_name: '',
          event_attendees: [],
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
                field: 'event.ac_link',
                label: 'Ac Link',
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