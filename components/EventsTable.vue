<template>
  <b-table :data="$store.getters.searchData" @select="selectRow" :selected="$store.state.selected" :paginated="true" :per-page="10" style="width: 100%">

    <template slot-scope="props">
      <b-table-column label="Program ID">
        {{ props.row.eventProgramId }}
      </b-table-column>

      <b-table-column label="Attendee" width="175">
        {{ props.row.attendeeFullName }}
      </b-table-column>

      <b-table-column label="Email" width="150">
        {{ props.row.attendeeEmail }}
      </b-table-column>

      <b-table-column label="Event Name" width="260" class="eventtd">
        <div v-if="!props.row.eventId">
          not assigned to any current or future events
          <a class="button is-small is-link" @click="assignEvent(props.row)">
            Assign Event
          </a>
        </div>
        <span class="eventname" v-else>
          {{ props.row.eventName }}
          <span class="etooltip">{{ props.row.eventName }} </span>
        </span>
      </b-table-column>

      <b-table-column label="Event Date" width="200">
        {{ props.row.eventDate| formatDate }}
      </b-table-column>

      <b-table-column label="Ac Link" width="150" centered>
        <a :href="'http://1call1.com/' + props.row.redirectLookupId" v-if="props.row.redirectLookupId">
          http://1call1.com/{{ props.row.redirectLookupId }}
        </a>
      </b-table-column>

      <b-table-column field="" label="Actions" width="165" centered>
        <button class="button field is-small" @click="addComment(props.row)" style="margin-right: 10px;">
          Comment
        </button>
        <button class="button field is-small" @click="editAttendee(props.row)">
          Edit
        </button>
      </b-table-column>

      <b-table-column label="Done" width="50" class="done-action" centered>
        <b-checkbox v-model="props.row.eventDone" />
      </b-table-column>
    </template>

    <template slot="bottom-left">
      <button class="button field is-primary is-small clear-btn" @click="$store.state.selected = null" v-show="$store.state.selected">
        <b-icon icon="close"></b-icon>
        <span>Clear selected</span>
      </button>
    </template>
  </b-table>
</template>

<script>
export default {
  methods: {
    addComment(row) {
      this.$store.commit('set_selected', row)
      this.$store.commit('set_comment_form_props')
      this.$store.commit('set_comment_modal_active')
    },
    editAttendee(row) {
      this.$store.commit('set_selected', row)
      this.$store.commit('set_attendee_form_props')
      this.$store.commit('set_edit_attendee_modal_active')
    },
    assignEvent(row) {
      this.$store.commit('set_selected', row)
      this.$scrollTo('#assign-event')
    },
    selectRow(row) {
      this.$store.commit('set_selected', row)
    },
  },
}
</script>
