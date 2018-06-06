import Vuex from 'vuex';
import {uniqBy} from 'lodash';

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      events: [],
      currentAttendee: {
        id: '',
        full_name: ''
      },
      loading: false,
    },
    mutations: {
      set_attendees(state, attendees) {
        state.attendees = attendees;
      },
      set_events(state, events) {
        state.events = events;
      },
      set_attendee(state, {id, full_name}) {
        state.currentAttendee.id = id;
        state.currentAttendee.full_name = full_name;
      },
      set_loading(state) {
        state.loading = !state.loading
      }
    },
    actions: {
      async GET_ATTENDEES({commit}, searchString = '') {
        commit('set_loading');
        const response = await this.$axios.$get('attendees/recent/', {
          params: {search: searchString},
        });
        commit('set_attendees', response.results);
        commit('set_loading');
      },
      async GET_EVENTS({commit}) {
        commit('set_loading');
        const response = await this.$axios.$get('events/');
        commit('set_events', response.results);
        commit('set_loading');
      },
      async CREATE_EVENT_ATTENDEE({state, commit}, eventId) {
        commit('set_loading');
        await this.$axios
          .post('event-attendees/', {
            event: eventId,
            attendee: state.currentAttendee.id,
          });
        commit('set_loading');
        this.$router.push({
          name: 'attendees-id',
          params: {id: state.currentAttendee.id},
        });
      },
    },
    getters: {
      eventAttendees: state => {
        let results = [];
        if (state.attendees.length !== 0) {
          for (const attendee of state.attendees) {
            if (attendee.event_attendee.length === 0) {
              results.push({
                id: attendee.id,
                full_name: attendee.full_name,
              });
            }
            for (const event_attendee of attendee.event_attendee) {
              results.push(
                Object.assign(event_attendee, {
                  full_name: attendee.full_name,
                })
              );
            }
          }
          results = uniqBy(results, 'id');
        }
        return results;
      },
    },
  });
};

export default createStore;
