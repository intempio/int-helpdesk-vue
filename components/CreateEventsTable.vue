<template>
  <section>
    <div class="title" id="assign-event">
      Assign Event for {{attendee.firstName}} {{attendee.lastName}}
    </div>
    <div class="columns">
      <b-table html
               :data="$store.state.events"
               :paginated="true"
               :per-page="15"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column field="event_name" label="Event Name">
            {{ props.row.event_name }}
          </b-table-column>

          <b-table-column field="date" label="Event Date">
            {{ props.row.date}}
          </b-table-column>


          <b-table-column label="Assign">
            <a class="button is-small is-link" @click="confirm(props.row)">
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
    props: {
      attendee: Object
    },
    name: "CreateEventsTable",
    methods: {

    },
  }
</script>

