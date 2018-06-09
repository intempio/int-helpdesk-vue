<template>
  <section>
    <div class="title" id="assign-event">
      <template v-if="selected.attendee">
        Assign Event for {{selected.full_name}}
      </template>
      <template v-else>
        Select Attendee
      </template>
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
            <a class="button is-small is-link" @click="confirm(props.row)" v-if="selected.attendee">
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
      selected: Object
    },
    name: "AssignEventsTable",
    methods: {
      confirm(row) {
        this.$dialog.confirm({
          message: `Assign <strong>${this.selected.full_name}</strong> to <strong>${row.event_name}</strong>?`,
          onConfirm: () => this.createEventAttendee(row),
          confirmText: 'Confirm'
        })
      },
      async createEventAttendee(row) {
        console.log(this.selected);
        console.log(row);
        await this.$store.dispatch('CREATE_EVENT_ATTENDEE', {
          eventId: row.id,
          attendeeId: this.selected.attendee
        });

        this.$toast.open(`Assigned ${this.selected.full_name} to ${row.event_name}.`);
        this.$scrollTo('#search');
      },
    },
  }
</script>

