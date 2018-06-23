<template>
  <div class="columns is-mobile">
    <div class="column">
      <b-field>
        <a href="/"><img src="http://intempio.com/wp-content/uploads/2018/05/INTEMPIO_FINAL_Tag1.png" class="site-logo" /></a>
      </b-field>
    </div>
    <div class="column is-half is-offset-one-quarter">
      <div class="columns">
        <div class="column is-four-fifths is-offset-one-fifth s-field">
          <div>
            <b-field>
              <b-input placeholder="Search..." type="search" size="is-large" icon="magnify" id="search" v-model="$store.state.searchString">
              </b-input>
            </b-field>
          </div>
        </div>
        <div class="column">
          <b-field>
            <a @click="clearSearchString">
              <b-icon icon="home" size="is-medium"></b-icon>
            </a>
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    clearSearchString() {
      this.$store.commit('set_search_string', '')
    },
  },
}
</script>
