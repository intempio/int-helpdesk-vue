import Vuex from 'vuex';
import {uniqBy} from 'lodash';

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      events: [],
      event_attendees: [],
      attendees_without_events: [],
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
      set_attendees_without_events(state, attendees) {
        state.attendees_without_events = attendees;
      },
      set_events(state, events) {
        state.events = events;
      },
      set_event_attendees(state, event_attendees) {
        state.event_attendees = event_attendees
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
      async GET_ATTENDEES({commit}) {
        const response = await this.$axios.$get('attendees/recent/');
        commit('set_attendees', response.results);
      },
      async GET_EVENTS({commit}) {
        const response = await this.$axios.$get('events/');
        commit('set_events', response.results);
      },
      async GET_ATTENDEES_WITHOUT_EVENTS({commit}) {
        const response = await this.$axios.$get('attendees/no_events/');
        commit('set_attendees_without_events', response.results);
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
      nuxtClientInit({commit, dispatch}) {
        dispatch('GET_ATTENDEES');
        dispatch('GET_EVENTS');
        dispatch('GET_ATTENDEES_WITHOUT_EVENTS');
      }
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
