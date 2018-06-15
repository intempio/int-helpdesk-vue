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

    <div v-if="eventAttendees.length !== 0">
      <b-table html
               :data="eventAttendees"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               @select="selectRow"
               :selected="selected"
               :paginated="true"
               :per-page="15"
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column field="role" label="Role">
            {{ props.row.role.charAt(0).toUpperCase() + props.row.role.slice(1) }}
          </b-table-column>


          <b-table-column field="full_name" label="Full Name">
            {{ props.row.full_name }}
          </b-table-column>

          <b-table-column field="event.event_name" label="Event Name">
            <div v-if="!props.row.event">
              not assigned to any current or future events
              <a class="button is-small is-link" @click="assignEvent(props.row)">
                Assign Event
              </a>
            </div>
            <span v-else>{{ props.row.event.event_name }}  </span>
          </b-table-column>

          <b-table-column field="event.date" label="Event Date">
            {{ props.row.event && props.row.event.date}}
          </b-table-column>

          <b-table-column field="redirect_lookup_id" label="Ac Link">
            <a :href="'http://1call1.com/' + props.row.redirect_lookup_id"
               v-if="props.row.redirect_lookup_id">
              http://1call1.com/{{ props.row.redirect_lookup_id }}
            </a>

          </b-table-column>


          <b-table-column field="" label="Actions">
            <button class="button field is-small" @click="addComment(props.row)" style="margin-right: 10px;">
              Comment
            </button>
            <button class="button field is-small" @click="editAttendee(props.row)">
              Edit
            </button>
          </b-table-column>
        </template>

        <template slot="bottom-left">
          <button class="button field is-primary is-small" @click="selected = {id: '', fullName: ''}"
                  v-show="selected && selected.attendee">
            <b-icon icon="close"></b-icon>
            <span>Clear selected</span>
          </button>
        </template>
      </b-table>

      <AssignEventsTable v-if="selected && selected.attendee" class="section" :selected="selected"/>
    </div>


    <div class="columns is-mobile" v-if="searchString && eventAttendees.length === 0"
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
  import {uniqBy, sortBy} from 'lodash';
  import AssignEventsTable from '../components/AssignEventsTable'
  import AddComponentModal from '../components/AddComponentModal'
  import EditAttendeeModal from '../components/EditAttendeeModal'

  export default {
    components: {AssignEventsTable, AddComponentModal, EditAttendeeModal},
    watchQuery: ['search'],
    key: to => to.fullPath,
    async asyncData({query}) {
      return {query};
    },
    computed: {
      eventAttendees() {
        const filteredAttendee = this.$store.state.attendees.filter(attendee => {
          return attendee.full_name.toLowerCase().includes(this.searchString.toLowerCase());
        });

        let results = [];
        for (const attendee of filteredAttendee) {
          if (attendee.event_attendee.length === 0) {
            results.push({
              attendee: attendee.id,
              full_name: attendee.full_name,
              firstName: attendee.first_name,
              lastName: attendee.last_name,
              email: attendee.email,
              role: attendee.role
            });
          }
          for (const event_attendee of attendee.event_attendee) {
            results.push(
              Object.assign(event_attendee, {
                full_name: attendee.full_name,
                firstName: attendee.first_name,
                lastName: attendee.last_name,
                email: attendee.email,
                role: attendee.role
              })
            );
          }

          results = uniqBy(results, 'id');
          results = sortBy(results, [function (o) {
            return o.event && o.event.date;
          }])
        }

        return results.filter(result => result.event.is_today);
      }
    },
    methods: {
      addComment(row) {
        this.selected = row;
        const {comment, id} = this.selected;
        Object.assign(this.commentFormProps, {id, comment});
        this.$store.commit('set_comment_modal_active');
      },
      editAttendee(row) {
        this.selected = row;
        const {attendee, firstName, lastName, email, role} = this.selected;
        Object.assign(this.attendeeFormProps, {id: attendee, firstName, lastName, email, role});
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
        this.selected = {id: '', fullName: ''};
      }
    },
    data() {
      return {
        selected: null,
        searchString: this.query && this.query.search || '',
        commentFormProps: {comment: '', id: ''},
        attendeeFormProps: {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          role: ''
        }
      };
    },
  };
</script>
