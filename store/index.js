import Vuex from 'vuex';
import {uniqBy} from 'lodash';

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      currentAttendee: {
        id: '',
        full_name: ''
      }
    },
    mutations: {
      set_attendees(state, attendees) {
        state.attendees = attendees;
      },

      set_attendee(state, {id, full_name}) {
        state.currentAttendee.id = id;
        state.currentAttendee.full_name = full_name;
      }
    },
    actions: {
      async GET_ATTENDEES({commit}, searchString = '') {
        const response = await this.$axios.$get('attendees/recent/', {
          params: {search: searchString},
        });
        commit('set_attendees', response.results);
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
