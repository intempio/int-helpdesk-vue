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
               focusable
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column field="full_name" label="Full Name">
            {{ props.row.full_name }}
          </b-table-column>

          <b-table-column field="event.event_name" label="Event Name">
            <div v-if="!props.row.event">
              not assigned to any current or future events
              <a class="button is-small is-link" @click="assignEvent">
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
        </template>

        <template slot="bottom-left">
          <button class="button field is-primary is-small" @click="selected = {id: '', fullName: ''}"
                  v-show="selected">
            <b-icon icon="close"></b-icon>
            <span>Clear selected</span>
          </button>
        </template>
      </b-table>

      <AssignEventsTable v-show="showAssign" class="section" :selected="selected"/>
    </div>

    <div v-if="searchString && eventAttendees.length === 0">No Results</div>
  </section>
</template>

<script>
  import {uniqBy} from 'lodash';
  import AssignEventsTable from '../components/AssignEventsTable'

  export default {
    components: {AssignEventsTable},
    computed: {
      eventAttendees() {
        const filteredAttendee = this.$store.state.attendees.filter(attendee => {
          const lowerCaseFullName = attendee.full_name.toLowerCase();
          return lowerCaseFullName.includes(this.searchString);
        });

        let results = [];
        for (const attendee of filteredAttendee) {
          if (attendee.event_attendee.length === 0) {
            results.push({
              id: attendee.id,
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
    methods: {
      assignEvent(row) {
        // this.$store.commit('set_attendee', {id: row.id, full_name: row.full_name,});
        // this.$router.push({name: 'attendees-assign'});
        this.showAssign = true;
        this.$scrollTo('#assign-event');

      },
      selectRow(row) {
        this.selected = row;
        // this.$scrollTo('#assign-event');
      }
    },
    watch: {
      searchString() {
        this.selected = {id: '', fullName: ''};
        this.showAssign = !!this.searchString;
      }
    },
    data() {
      return {
        selected: {id: ''},
        searchString: '',
        showAssign: false,
      };
    },
  };
</script>
