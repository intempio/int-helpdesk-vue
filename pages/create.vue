<template>
  <section class="section">
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <b-field label="First Name">
          <b-input v-model="attendee.firstName"></b-input>
        </b-field>

        <b-field label="Last Name">
          <b-input v-model="attendee.lastName"></b-input>
        </b-field>

        <b-field label="Email">
          <b-input type="email"
                   v-model="attendee.email">
          </b-input>
        </b-field>
      </div>
    </div>

    <div class="title" id="assign-event">
      Assign Event for {{fullName}}
    </div>

    <div class="columns">
      <b-table html
               :data="$store.state.events"
               :paginated="true"
               :per-page="15"
               :row-class="(row) => row.event && row.event.is_today && 'is-info'"
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column field="event_name" label="Event Name">
            {{ props.row.event_name }}
          </b-table-column>

          <b-table-column field="date" label="Event Date">
            {{ props.row.date}}
          </b-table-column>


          <b-table-column label="Assign">
            <a class="button is-small is-link" @click="confirm(props.row)" v-show="readyToSubmit">
              Assign Event
            </a>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
  export default {
    computed: {
      readyToSubmit() {
        const {firstName, lastName, email} = this.attendee;
        return firstName && lastName && email;
      },
      fullName() {
        return this.attendee.firstName + ' ' + this.attendee.lastName;
      }
    },
    name: "create",
    data() {
      return {
        attendee: {
          firstName: '',
          lastName: '',
          email: '',
        }
      }
    },
    methods: {
      confirm(row) {
        this.$dialog.confirm({
          message: `Assign <strong>${this.fullName}</strong> to <strong>${row.event_name}</strong>?`,
          onConfirm: () => this.createEventAttendee(row),
          confirmText: 'Confirm'
        })
      },
       createEventAttendee(row) {
        this.$axios.$post('/attendees/', {
          first_name: this.attendee.firstName,
          last_name: this.attendee.lastName,
          email: this.attendee.email
        }).then(created_attendee => {
          return this.$axios.$post('/event-attendees/', {
            attendee: created_attendee.id,
            event: row.id
          });
        }).then(async () => {
          this.$toast.open(`Assigned ${this.attendee.firstName} ${this.attendee.lastName} to ${row.event_name}.`);
          await this.$store.dispatch('nuxtClientInit');
          this.$router.push({name: 'index', query: {search: `${this.attendee.firstName} ${this.attendee.lastName}`}});
        }).catch((error) => {
          // Error
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const {data, status} = error.response;
            if (status === 400) {
              if (data['email']) {
                this.$toast.open(`${data['email'][0]}`);
              }
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
      },
    },
  }
</script>

