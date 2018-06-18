<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Attendee</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Role">
        <b-select placeholder="Select a role" v-model="formData.attendeeRole">
          <option value="Attendee">Attendee</option>
          <option value="Doctor">Doctor</option>
          <option value="Rep">Rep</option>
        </b-select>
      </b-field>

      <b-field label="First Name">
        <b-input v-model="formData.attendeeFirstName"></b-input>
      </b-field>

      <b-field label="last Name">
        <b-input v-model="formData.attendeeLastName"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input type="email" v-model="formData.attendeeEmail" placeholder="Your email"></b-input>
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click="updateAttendee()">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'EditAttendeeModal',
  props: [
    'attendeeId',
    'attendeeFirstName',
    'attendeeLastName',
    'attendeeRole',
    'attendeeEmail',
  ],
  methods: {
    async updateAttendee() {
      const loadingComponent = this.$loading.open();
      const {
        attendeeFirstName,
        attendeeLastName,
        attendeeEmail,
        attendeeRole,
      } = this.formData;
      await this.$store.dispatch('UPDATE_ATTENDEE', {
        attendeeId: this.attendeeId,
        attendeeFirstName,
        attendeeLastName,
        attendeeEmail,
        attendeeRole,
      });
      loadingComponent.close();
      this.$store.commit('set_edit_attendee_modal_active');
      await this.$store.dispatch('nuxtClientInit');
    },
  },
  data() {
    return {
      formData: {
        attendeeFirstName: this.attendeeFirstName,
        attendeeLastName: this.attendeeLastName,
        attendeeEmail: this.attendeeEmail,
        attendeeRole: this.attendeeRole,
      },
    };
  },
};
</script>
