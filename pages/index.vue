<template>
  <section class="section">
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <div>
          <b-field>
            <b-input placeholder="Search..."
                     type="search"
                     size="is-large"
                     icon="magnify"
                     id="search"
                     v-model="searchString"
            >
            </b-input>
          </b-field>
        </div>
      </div>
    </div>

    <div v-if="$store.getters.searchData.length !== 0">
      <b-table html
               :data="$store.getters.searchData"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               @select="selectRow"
               :selected="selected"
               :paginated="true"
               :per-page="10"
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column label="Role">
            {{ props.row.attendeeRole }}
          </b-table-column>

          <b-table-column label="Full Name" width="150">
            {{ props.row.attendeeFullName }}
          </b-table-column>


          <b-table-column label="Event Name">
            <div v-if="!props.row.eventId">
              not assigned to any current or future events
              <a class="button is-small is-link" @click="assignEvent(props.row)">
                Assign Event
              </a>
            </div>
            <span v-else>{{ props.row.eventName }}  </span>
          </b-table-column>

          <b-table-column label="Event Date" width="150">
            {{ props.row.eventDate| formatDate }}
          </b-table-column>

          <b-table-column label="Ac Link" width="150">
            <a :href="'http://1call1.com/' + props.row.redirectLookupId"
               v-if="props.row.redirectLookupId">
              http://1call1.com/{{ props.row.redirectLookupId }}
            </a>
          </b-table-column>


          <b-table-column field="" label="Actions" width="160">
            <button class="button field is-small" @click="addComment(props.row)" style="margin-right: 10px;">
              Comment
            </button>
            <button class="button field is-small" @click="editAttendee(props.row)">
              Edit
            </button>
          </b-table-column>
        </template>

        <template slot="bottom-left">
          <button class="button field is-primary is-small" @click="selected = null"
                  v-show="selected">
            <b-icon icon="close"></b-icon>
            <span>Clear selected</span>
          </button>
        </template>
      </b-table>

      <AssignEventsTable v-if="selected" class="section" :attendee="selected"/>
    </div>


    <div class="columns is-mobile" v-if="searchString && $store.getters.searchData.length === 0"
         style="margin-top: 200px">
      <div class="column is-half is-offset-one-quarter has-text-centered">
        <div class="title">No attendees found ...</div>
        <button class="button field is-primary is-large" @click="$router.push('/create/')">
          Add attendee
        </button>
      </div>
    </div>

    <b-modal :active.sync="$store.state.isCommentModalActive" has-modal-card width="500">
      <add-component-modal v-bind="commentFormProps"/>
    </b-modal>

    <b-modal :active.sync="$store.state.isEditAttendeeModalActive" has-modal-card width="500">
      <edit-attendee-modal v-bind="attendeeFormProps"/>
    </b-modal>

  </section>
</template>

<script>
  import AssignEventsTable from '../components/AssignEventsTable'
  import AddComponentModal from '../components/AddComponentModal'
  import EditAttendeeModal from '../components/EditAttendeeModal'

  export default {
    components: {AssignEventsTable, AddComponentModal, EditAttendeeModal},
    watchQuery: ['search'],
    key: to => to.fullPath,
    async asyncData({query, store}) {
      if (query.search) {
        store.commit('set_search_string', query.search)
      }
      return {query};
    },
    computed: {},
    methods: {
      addComment(row) {
        this.selected = row;
        const {comment, eventAttendeeId} = this.selected;
        Object.assign(this.commentFormProps, {comment, eventAttendeeId});
        this.$store.commit('set_comment_modal_active');
      },
      editAttendee(row) {
        this.selected = row;
        const {
          attendeeId,
          attendeeFirstName,
          attendeeLastName,
          attendeeFullName,
          attendeeRole,
          attendeeEmail
        } = this.selected;
        Object.assign(this.attendeeFormProps, {
          attendeeId,
          attendeeFirstName,
          attendeeLastName,
          attendeeFullName,
          attendeeRole,
          attendeeEmail
        });
        this.$store.commit('set_edit_attendee_modal_active');
      },
      assignEvent(row) {
        this.selected = row;
        this.$scrollTo('#assign-event');
      },
      selectRow(row) {
        this.selected = row;
      }
    },
    watch: {
      searchString() {
        this.selected = null;
        this.$store.commit('set_search_string', this.searchString)
      }
    },
    data() {
      return {
        selected: null,
        searchString: this.query && this.query.search || '',
        commentFormProps: {comment: '', eventAttendeeId: ''},
        attendeeFormProps: {
          attendeeId: '',
          attendeeFirstName: '',
          attendeeLastName: '',
          attendeeRole: '',
          attendeeEmail: ''
        }
      };
    },
  };
</script>
