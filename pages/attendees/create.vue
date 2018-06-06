<template>
  <div class="section">
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

    <b-table html
             :data="$store.getters.eventAttendees"
             :loading="loading"
             :row-class="(row) => row.event && row.event.is_today && 'is-info'"
             style="width: 100%"
    >

      <template scope="props">
        <b-table-column field="event.event_name" label="Event Name">
          {{ props.row.event.event_name }}
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

        <b-table-column label="Assign">
          <a class="button is-small is-link" @click="createEventAttendee(props.row)">
            Assign Event
          </a>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    async fetch({store}) {
      if (store.state.attendees.length === 0) {
        await store.dispatch('GET_ATTENDEES');
      }
    },
    methods: {
      async createEventAttendee(row) {
        this.loading = true;
        const data = await this.$axios.$post('attendees/', {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email
        });
        await this.$axios.post('event-attendees/', {
          event: row.event.id,
          attendee: data.id,
        });
        this.$router.push({
          name: 'attendees-id',
          params: {id: data.id},
        });
      },
    },
    data() {
      return {
        loading: false,
        firstName: '',
        lastName: '',
        email: '',
      };
    },
  };
</script>

<style scoped>
</style>
