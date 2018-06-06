<template>
  <div class="section">
    <section class="content"><h4>Attendee does not exist</h4></section>
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
             :data="$store.state.events"
             :loading="loading"
             :row-class="(row) => row.event && row.event.is_today && 'is-info'"
             style="width: 100%"
    >

      <template scope="props">
        <b-table-column field="event_name" label="Event Name">
          {{ props.row.event_name }}
        </b-table-column>

        <b-table-column field="date" label="Event Date">
          {{ props.row.date}}
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
      if (store.state.events.length === 0) {
        await store.dispatch('GET_EVENTS');
      }
    },
    methods: {
      async createEventAttendee(row) {
        if (this.firstName.trim() && this.lastName.trim() && this.email.trim()) {
          this.loading = true;
          const data = await this.$axios.$post('attendees/', {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email
          });
          await this.$axios.post('event-attendees/', {
            event: row.id,
            attendee: data.id,
          });
          this.$router.push({
            name: 'attendees-id',
            params: {id: data.id},
          });
        } else {
          alert('all fields are required');
        }

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
