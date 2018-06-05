<template>
    <section class="section">
        <div class="columns is-mobile">
          <div v-show="isAssign" class="title">Assign Event</div>
          <div class="column is-half is-offset-one-quarter">
              <div v-show="!isAdd && !isAssign">
                <b-field>
                  <b-input placeholder="Search..."
                    type="search"
                    size="is-large"
                    icon="magnify"
                    v-model="searchString"
                    v-on:input="debounceInput"
                    >
                  </b-input>
                </b-field>
              </div>
              <section v-show="isAdd && !isAssign">
                <b-field label="First Name">
                    <b-input v-model="firstName"></b-input>
                </b-field>

                <b-field label="Last Name">
                    <b-input v-model="lastName"></b-input>
                </b-field>

                <b-field label="Email">
                    <b-input type="email"
                        v-model="email">
                    </b-input>
                </b-field>

            </section>
          </div>
        </div>

        <div class="columns">
             <b-table html
                :data="tableData"
                :loading="loading"
                :row-class="(row, index) => row.event && row.event.is_today && 'is-info'"
                style="width: 100%"
                >

                <template scope="props">
                  <b-table-column field="full_name" label="Full Name">
                    {{ props.row.full_name }}
                  </b-table-column>

                  <b-table-column field="event.event_name" label="Event Name" >
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

                  <b-table-column field="event.ac_link" label="Ac Link">
                    {{ props.row.event && props.row.event.ac_link }}
                  </b-table-column>

                  <b-table-column field="pre_registered" label="Pre Registered">
                    {{ props.row.pre_registered ? 'Yes' : 'No'}}
                  </b-table-column>

                  <b-table-column field="call_complete" label="Call Complete">
                    {{ props.row.call_complete ? 'Yes': 'No'}}
                  </b-table-column>

                  <b-table-column label="Assign Event" field="assign" v-if="isAssign">
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
import { debounce, uniqBy } from 'lodash';
export default {
  created() {
    this.fetchAttendees();
  },
  computed: {
    eventAttendees: function() {
      let results = [];
      for (const attendee of this.attendees) {
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
      }
      return uniqBy(results, 'id');
    },

    searchResults: function() {
      let results = [];
      for (const attendee of this.searchData) {
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
      }
      return uniqBy(results, 'id');
    },
  },
  methods: {
    assignEvent(row) {
        this.isAssign = true;
        this.tableData = this.eventAttendees;
        this.currentAttendee = row.id;
        this.currentFullName = row.full_name;
    },
    async fetchAttendees() {
      const response = await this.$axios.$get('attendees/recent/');
      this.attendees = response.results;
      this.loading = false;
      this.tableData = this.eventAttendees;
    },
    async searchAttendees() {
      this.loading = true;
      const response = await this.$axios.$get('attendees/recent/', {
        params: { search: this.searchString },
      });
      this.loading = false;
      this.searchData = response.results;
      if (response.count === 0) {
        this.isAdd = true;
        this.tableData = this.eventAttendees;
      } else {
        this.tableData = this.searchResults;
      }
    },
    debounceInput: _.debounce(function() {
      this.searchAttendees();
    }, 1000),
    createEventAttendee(row) {
      this.$axios.post('event-attendees/', {
        event: row.event.id,
        attendee: this.currentAttendee
      }).then(response => {
        this.$router.push({name: 'attendees-id', params: { id: this.currentAttendee}});
      }).catch((err) => {

      });
    },
  },
  data() {
    return {
      loading: true,
      attendees: [],
      searchString: '',
      searchData: [],
      tableData: [],
      count: 1,
      isAdd: false,
      isAssign: false,
      firstName: '',
      lastName: '',
      email: '',
      currentAttendee: null,
      currentFullName: '',
    };
  },
};
</script>

<style>
tr.is-info {
  background: #167df0;
}

tr.is-info td {
  color: #fff;
}
</style>