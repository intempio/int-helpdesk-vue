<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <b-field label="Comment">
        <b-input maxlength="200" type="textarea" v-model="formComment"></b-input>
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
    props: ['comment', 'id'],
    name: "AddComponentModal",
    methods: {
      async updateComment() {
        const loadingComponent = this.$loading.open();
        await this.$axios.$patch(`/event-attendees/${this.id}/`, {comment: this.formComment});
        loadingComponent.close();
        this.$store.commit('set_comment_modal_active');
      }
    },
    data() {
      return {
        formComment: this.comment
      }
    }
  }
</script>
