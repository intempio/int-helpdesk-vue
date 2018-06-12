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
            <a :href="'http://i17r.com/' + props.row.redirect_lookup_id"
               v-if="props.row.redirect_lookup_id">
              http://i17r.com/{{ props.row.redirect_lookup_id }}
            </a>

          </b-table-column>

          <b-table-column field="pre_registered" label="Pre Registered">
            {{ props.row.pre_registered ? 'Yes' : 'No'}}
          </b-table-column>

          <b-table-column field="call_complete" label="Call Complete">
            {{ props.row.call_complete ? 'Yes': 'No'}}
          </b-table-column>

          <b-table-column field="" label="Actions">
            <button class="button field is-small" @click="addComment(props.row)">
              {{props.row.comment ? 'Update': 'Add'}} comment
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
        <div class="title">No results ...</div>
        <button class="button field is-primary is-large" @click="$router.push('/create/')">
          Create and assign event
        </button>
      </div>
    </div>

    <b-modal :active.sync="$store.state.isCommentModalActive" has-modal-card width="500">
      <add-component-modal v-bind="formProps"></add-component-modal>
    </b-modal>
  </section>
</template>

<script>
  import {uniqBy} from 'lodash';
  import AssignEventsTable from '../components/AssignEventsTable'
  import AddComponentModal from '../components/AddComponentModal'

  export default {
    components: {AssignEventsTable, AddComponentModal},
    watchQuery: ['search'],
    key: to => to.fullPath,
    async asyncData({query}) {
      return {query};
    },
    computed: {
      eventAttendees() {
        const filteredAttendee = this.$store.state.attendees.filter(attendee => {
          const lowerCaseFullName = attendee.full_name.toLowerCase();
          return lowerCaseFullName.includes(this.searchString.toLowerCase());
        });

        let results = [];
        for (const attendee of filteredAttendee) {
          if (attendee.event_attendee.length === 0) {
            results.push({
              attendee: attendee.id,
              full_name: attendee.full_name,
            });
          }
          for (const event_attendee of attendee.event_attendee) {
            results.push(
              Object.assign(event_attendee, {
                full_name: attendee.full_name,
              })
            );
          }
          results = uniqBy(results, 'id');
        }
        return results;
      }
    },
    created() {
      this.searchString = this.query.search || '';
    },
    methods: {
      addComment(row) {
        this.selected = row;
        this.formProps.comment = this.selected.comment;
        this.formProps.id = this.selected.id;
        this.$store.commit('set_comment_modal_active');
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
        searchString: '',
        formProps: {
          comment: '',
          id: ''
        }
      };
    },
  };
</script>
