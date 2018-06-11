import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      events: [],
      attendees_without_events: [],
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
      async CREATE_EVENT_ATTENDEE({state, commit, dispatch}, {eventId, attendeeId}) {
        await this.$axios
          .$post('event-attendees/', {
            event: eventId,
            attendee: attendeeId,
          });
        dispatch('GET_ATTENDEES');
        dispatch('GET_EVENTS');
      },
      async nuxtClientInit({dispatch}) {
        dispatch('GET_ATTENDEES');
        dispatch('GET_EVENTS');
      }
    }
  });
};

export default createStore;
