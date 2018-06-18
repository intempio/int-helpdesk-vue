<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"></p>
    </header>
    <section class="modal-card-body">
      <b-field label="Comment">
        <b-input maxlength="300" type="textarea" v-model="formComment" size=""></b-input>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click="updateComment()">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  props: ['comment', 'eventAttendeeId'],
  name: 'AddComponentModal',
  methods: {
    async updateComment() {
      const loadingComponent = this.$loading.open()
      await this.$store.dispatch('UPDATE_EVENT_ATTENDEE', {
        eventAttendeeId: this.eventAttendeeId,
        comment: this.formComment,
      })

      loadingComponent.close()
      this.$store.commit('set_comment_modal_active')
      await this.$store.dispatch('nuxtClientInit')
    },
  },
  data() {
    return {
      formComment: this.comment,
    }
  },
}
</script>
