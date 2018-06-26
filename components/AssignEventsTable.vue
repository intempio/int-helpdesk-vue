<template>
  <section>
    <div class="title" id="assign-event">
      <template v-if="$store.state.selected">
        Assign Event for {{$store.state.selected.attendeeFullName}}
      </template>
      <template v-else>
        Select Attendee
      </template>
    </div>
    <div class="columns">
      <b-table html :data="$store.getters.eventsToday" :paginated="true" :per-page="10" style="width: 100%">

        <template slot-scope="props">
          <b-table-column label="Event Name">
            {{ props.row.fields.topic }}
          </b-table-column>

          <b-table-column label="Event Date">
            {{ props.row.fields.meeting_date | formatDate }}
          </b-table-column>

          <b-table-column label="Assign">
            <a class="button is-small is-link" @click="confirm(props.row)" v-if="$store.state.selected">
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
  name: 'AssignEventsTable',
  methods: {
    confirm(row) {
      this.$dialog.confirm({
        message: `Assign <strong>${
          this.$store.state.selected.attendeeFullName
        }</strong> to <strong>${row.fields.topic}</strong>?`,
        onConfirm: () => this.createEventAttendee(row),
        confirmText: 'Confirm',
      })
    },
    async createEventAttendee(row) {
      const loadingComponent = this.$loading.open()
      await this.$store.dispatch('CREATE_EVENT_ATTENDEE', {
        event: row.id,
        attendee: this.$store.state.selected.attendeeId,
      })
      loadingComponent.close()
      this.$toast.open(
        `Assigned ${this.$store.state.selected.attendeeFullName} to ${
          row.fields.topic
        }.`
      )
      this.$scrollTo('#search')
    },
  },
}
</script>
