<template>
  <section class="section">
    <div class="title">Assign Event {{$store.state.currentAttendee.full_name}}</div>
    <div class="columns">
      <b-table html
               :data="$store.getters.eventAttendees"
               :loading="loading"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               style="width: 100%"
      >

        <template scope="props">
          <b-table-column field="event.event_name" label="Event Name">
            {{ props.row.event.event_name }}
          </b-table-column>

          <b-table-column field="event.date" label="Event Date">
            {{ props.row.event && props.row.event.date}}
          </b-table-column>

          <b-table-column field="event.ac_link" label="Ac Link">
            {{ props.row.event && props.row.event.ac_link }}
          </b-table-column>

          <b-table-column field="pre_registered" label="Pre Registered">
            {{ props.row.pre_registered ? 'Yes' : 'No'}}
          </b-table-column>

          <b-table-column field="call_complete" label="Call Complete">
            {{ props.row.call_complete ? 'Yes': 'No'}}
          </b-table-column>

          <b-table-column label="Assign">
            <a class="button is-small is-link" @click="createEventAttendee(props.row)">
              Assign Event
            </a>
          </b-table-column>
        </template>
      </b-table>
    </div>

  </section>
</template>

<script>
  export default {
    async fetch({store}) {
      await store.dispatch('GET_ATTENDEES');
    },
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      createEventAttendee(row) {
        this.$axios
          .post('event-attendees/', {
            event: row.event.id,
            attendee: this.$store.state.currentAttendee.id,
          })
          .then(response => {
            this.$router.push({
              name: 'attendees-id',
              params: {id: this.$store.state.currentAttendee.id},
            });
          })
          .catch(err => {
          });
      },
    },
  };
</script>

<style scoped>
</style>
