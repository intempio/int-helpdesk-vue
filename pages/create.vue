<template>
  <section class="section">
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <b-field label="Role">
          <b-select placeholder="Select a role" v-model="attendee.attendeeRole">
            <option value="Attendee">Attendee</option>
            <option value="Doctor">Doctor</option>
            <option value="Rep">Rep</option>
          </b-select>
        </b-field>

        <b-field label="First Name">
          <b-input v-model="attendee.attendeeFirstName"></b-input>
        </b-field>

        <b-field label="Last Name">
          <b-input v-model="attendee.attendeeLastName"></b-input>
        </b-field>

        <b-field label="Email">
          <b-input type="email"
                   v-model="attendee.attendeeEmail">
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
               :per-page="10"
               style="width: 100%"
      >

        <template slot-scope="props">
          <b-table-column label="Event Name">
            {{ props.row.fields.topic }}
          </b-table-column>

          <b-table-column label="Event Date">
            {{ props.row.fields.meeting_date | formatDate }}
          </b-table-column>

          <b-table-column label="Assign">
            <a class="button is-small is-link" @click="confirm(props.row)" v-if="readyToSubmit">
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
        const {
          attendeeFirstName,
          attendeeLastName,
          attendeeEmail,
          attendeeRole
        } = this.attendee;
        return attendeeFirstName && attendeeLastName && attendeeEmail && attendeeRole;
      },
      fullName() {
        return this.attendee.attendeeFirstName + ' ' + this.attendee.attendeeLastName;
      }
    },
    name: "create",
    data() {
      return {
        attendee: {
          attendeeFirstName: '',
          attendeeLastName: '',
          attendeeEmail: '',
          attendeeRole: '',
        }
      }
    },
    methods: {
      confirm(row) {
        this.$dialog.confirm({
          message: `Assign <strong>${this.fullName}</strong> to <strong>${row.fields.topic}</strong>?`,
          onConfirm: () => this.createEventAttendee(row),
          confirmText: 'Confirm'
        })
      },
      async createEventAttendee(row) {
        const loadingComponent = this.$loading.open();
        const {id} = await this.$store.dispatch('CREATE_ATTENDEE', this.attendee);
        await this.$store.dispatch('CREATE_EVENT_ATTENDEE', {
          event: row.id,
          attendee: id
        });
        loadingComponent.close();
        this.$toast.open(`Assigned ${this.fullName} to ${row.fields.topic}.`);
        this.$router.push({
          name: 'index',
          query: {search: `${this.fullName}`}
        });

      },
    },
  }
</script>

