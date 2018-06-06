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
                     v-on:input="debounceInput"
            >
            </b-input>
          </b-field>
        </div>
      </div>
    </div>

    <div class="columns">
      <b-table html
               :data="$store.getters.eventAttendees"
               :loading="$store.state.loading"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               style="width: 100%"
      >

        <template scope="props">
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
            <a :href="'http://i17r.com/' + props.row.redirect_lookup_id + '/'">
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
      </b-table>
    </div>
  </section>
</template>

<script>
  import {debounce} from 'lodash';

  export default {
    watchQuery: ['search'],
    key: to => to.fullPath,
    async fetch({store, params, query}) {
      await store.dispatch('GET_ATTENDEES', query.search);
    },
    methods: {
      assignEvent(row) {
        this.$store.commit('set_attendee', {id: row.id, full_name: row.full_name});
        this.$router.push({name: 'attendees-assign'});
      },
      debounceInput: _.debounce(async function () {
        await this.$store.dispatch('GET_ATTENDEES', this.searchString);
        if (this.$store.getters.eventAttendees.length === 0) {
          this.$router.push({name: 'attendees-create'});
        }
      }, 500),
    },
    data() {
      return {
        searchString: '',
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
