<template>
  <section class="section">
    <div class="title">Assign Event {{$store.state.currentAttendee.full_name}}</div>
    <div class="columns">
      <b-table html
               :data="$store.state.events"
               :loading="$store.state.loading"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               style="width: 100%"
      >

        <template scope="props">
          <b-table-column field="event_name" label="Event Name">
            {{ props.row.event_name }}
          </b-table-column>

          <b-table-column field="date" label="Event Date">
            {{ props.row.date}}
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
      if (store.state.events.length === 0) {
        await store.dispatch('GET_EVENTS');
      }
    },
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      createEventAttendee(row) {
        this.$store.dispatch('CREATE_EVENT_ATTENDEE', row.id);
      },
    },
  };
</script>

<style scoped>
</style>
