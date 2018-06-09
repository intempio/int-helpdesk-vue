<template>
  <div>
    <section class="section">
      <div class="columns is-mobile">
        <div class="column">
          <h4 class="title">{{full_name}} - {{email}}</h4>
          <b-table :data="event_attendee">
            <template slot-scope="props">
              <b-table-column field="event_name" label="Event Name">
                {{ props.row.event.event_name }}
              </b-table-column>

              <b-table-column field="date" label="Event Date">
                {{ props.row.event.date}}
              </b-table-column>

              <b-table-column field="redirect_lookup_id" label="Ac Link">
                <a :href="'http://i17r.com/' + props.row.redirect_lookup_id"
                   v-if="props.row.redirect_lookup_id">
                  http://i17r.com/{{ props.row.redirect_lookup_id }}
                </a>
              </b-table-column>

              <b-table-column field="pre_registered" label="Pre Registered">
                {{ props.row.pre_registered}}
              </b-table-column>


              <b-table-column field="call_complete" label="Call Complete">
                {{ props.row.call_complete}}
              </b-table-column>
            </template>
          </b-table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    async asyncData({app, params}) {
      const {
        email,
        full_name,
        event_attendee
      } = await app.$axios.$get(`attendees/${params.id}/`);
      return {
        email,
        full_name,
        event_attendee
      }
    }
  }
</script>

<style scoped>
</style>
