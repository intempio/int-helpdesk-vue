<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Attendee</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Role">
        <b-select placeholder="Select a role" v-model="formData.role">
          <option value="attendee">Attendee</option>
          <option value="doctor">Doctor</option>
          <option value="rep">Rep</option>
        </b-select>
      </b-field>

      <b-field label="First Name">
        <b-input v-model="formData.firstName"></b-input>
      </b-field>

      <b-field label="last Name">
        <b-input v-model="formData.lastName"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input type="email" v-model="formData.email" placeholder="Your email"></b-input>
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
    name: "EditAttendeeModal",
    props: ['firstName', 'lastName', 'email', 'role', 'id'],
    methods: {
      async updateAttendee() {
        const loadingComponent = this.$loading.open();
        const {firstName, lastName, email, role} = this.formData;
        await this.$axios.$patch(`/attendees/${this.id}/`, {
          first_name: firstName,
          last_name: lastName,
          email,
          role
        });
        loadingComponent.close();
        this.$store.commit('set_edit_attendee_modal_active');
        await this.$store.dispatch('nuxtClientInit');
      }
    },
    data() {
      return {
        formData: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          role: this.role
        }
      }
    }
  }
</script>

