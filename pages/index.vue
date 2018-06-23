<template>
  <section class="section">
    <search-component />
    <div v-if="$store.getters.searchData.length !== 0">
      <EventsTable />
      <AssignEventsTable v-if="this.$store.state.selected" class="section" :attendee="this.$store.state.selected" />
    </div>

    <div class="columns is-mobile" v-if="$store.state.searchString && $store.getters.searchData.length === 0" style="margin-top: 200px">
      <div class="column is-half is-offset-one-quarter has-text-centered">
        <div class="title">No attendees found ...</div>
        <button class="button field is-primary is-large" @click="$router.push('/create/')">
          Add attendee
        </button>
      </div>
    </div>

    <b-modal :active.sync="$store.state.isCommentModalActive" has-modal-card width="500">
      <add-component-modal v-bind="$store.state.commentFormProps" />
    </b-modal>

    <b-modal :active.sync="$store.state.isEditAttendeeModalActive" has-modal-card width="500">
      <edit-attendee-modal v-bind="$store.state.attendeeFormProps" />
    </b-modal>

  </section>
</template>

<script>
import AssignEventsTable from '../components/AssignEventsTable'
import AddComponentModal from '../components/AddComponentModal'
import EditAttendeeModal from '../components/EditAttendeeModal'
import SearchComponent from '../components/SearchComponent'
import EventsTable from '../components/EventsTable'

export default {
  components: {
    AssignEventsTable,
    AddComponentModal,
    EditAttendeeModal,
    SearchComponent,
    EventsTable,
  },
  watchQuery: ['search'],
  key: to => to.fullPath,
  async asyncData({ query, store }) {
    if (query.search) {
      store.commit('set_search_string', query.search)
    }
    return { query }
  },
  watch: {
    searchString() {
      this.$store.commit('set_selected', row)
      this.$store.commit('set_search_string', this.searchString)
    },
  },
  data() {
    return {
      searchString: (this.query && this.query.search) || '',
    }
  },
}
</script>
