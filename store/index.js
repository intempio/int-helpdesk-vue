import Vuex from 'vuex';

const API_KEY_STRING = '&api_key=keyF5RqI6oSraQNK7';

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      events: [],
      event_attendees: [],
      loading: false,
      isCommentModalActive: false,
      isEditAttendeeModalActive: false,
    },
    mutations: {
      set_attendees(state, attendees) {
        state.attendees = attendees;
      },
      set_events(state, events) {
        state.events = events;
      },
      set_event_attendees(state, event_attendees) {
        state.event_attendees = event_attendees;
      },
      set_loading(state) {
        state.loading = !state.loading
      },
      set_comment_modal_active(state) {
        state.isCommentModalActive = !state.isCommentModalActive;
      },
      set_edit_attendee_modal_active(state) {
        state.isEditAttendeeModalActive = !state.isEditAttendeeModalActive;
      }
    },
    actions: {
      async GET_ATTENDEES({commit}) {
        const response = await this.$axios.$get('/Attendees?maxRecords=100&view=Grid%20view' + API_KEY_STRING);
        commit('set_attendees', response.records);
      },
      async GET_EVENTS({commit}) {
        const response = await this.$axios.$get('/Events?maxRecords=100&view=Grid%20view' + API_KEY_STRING);
        commit('set_events', response.records);
      },
      async GET_EVENT_ATTENDEES({commit}) {
        const response = await this.$axios.$get('/Event_Attendee?maxRecords=100&view=Grid%20view' + API_KEY_STRING);
        commit('set_event_attendees', response.records);
      },
      async CREATE_EVENT_ATTENDEE({state, commit, dispatch}, {eventId, attendeeId}) {
        await this.$axios
          .$post('event-attendees/', {
            event: eventId,
            attendee: attendeeId,
          });

        dispatch('nuxtClientInit');
      },
      async nuxtClientInit({dispatch, commit, state}) {
        await Promise.all([
          dispatch('GET_ATTENDEES'),
          dispatch('GET_EVENTS'),
          dispatch('GET_EVENT_ATTENDEES')
        ]);

        console.log(state);
      }
    }
  });
};

export default createStore;
