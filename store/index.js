import Vuex from 'vuex'
import { sortBy } from 'lodash'
const spacetime = require('spacetime')

const NOW = spacetime.now().goto('America/New_York')
const API_KEY_STRING = '&api_key=keyF5RqI6oSraQNK7'

const createStore = () => {
  return new Vuex.Store({
    state: {
      attendees: [],
      events: [],
      event_attendees: [],
      loading: false,
      isCommentModalActive: false,
      isEditAttendeeModalActive: false,
      searchString: '',
      selected: null,
      commentFormProps: { comment: '', eventAttendeeId: '' },
      attendeeFormProps: {
        attendeeId: '',
        attendeeFirstName: '',
        attendeeLastName: '',
        attendeeRole: '',
        attendeeEmail: '',
      },
    },
    mutations: {
      set_attendees(state, attendees) {
        state.attendees = attendees
      },
      set_events(state, events) {
        state.events = events
      },
      set_event_attendees(state, event_attendees) {
        state.event_attendees = event_attendees
      },
      set_loading(state) {
        state.loading = !state.loading
      },
      set_comment_modal_active(state) {
        state.isCommentModalActive = !state.isCommentModalActive
      },
      set_edit_attendee_modal_active(state) {
        state.isEditAttendeeModalActive = !state.isEditAttendeeModalActive
      },
      set_search_string(state, searchString) {
        state.searchString = searchString
      },
      set_selected(state, obj) {
        state.selected = Object.assign({}, obj)
      },
      set_comment_form_props(state) {
        const { comment, eventAttendeeId } = state.selected
        state.commentFormProps = Object.assign({}, { comment, eventAttendeeId })
      },
      set_attendee_form_props(state) {
        const {
          attendeeId,
          attendeeFirstName,
          attendeeLastName,
          attendeeFullName,
          attendeeRole,
          attendeeEmail,
        } = state.selected
        state.attendeeFormProps = Object.assign(
          {},
          {
            attendeeId,
            attendeeFirstName,
            attendeeLastName,
            attendeeRole,
            attendeeEmail,
            attendeeFullName,
          }
        )
      },
    },
    getters: {
      searchData: state => {
        const data = []
        state.attendees.forEach(attendee => {
          const {
            first_name,
            last_name,
            full_name,
            email,
            role,
          } = attendee.fields
          if (attendee.fields.Event_Attendee) {
            attendee.fields.Event_Attendee.forEach(id => {
              const foundObj = state.event_attendees.find(obj => obj.id === id)
              if (foundObj) {
                data.push({
                  attendeeId: attendee.id,
                  attendeeFullName: full_name,
                  attendeeFirstName: first_name,
                  attendeeLastName: last_name,
                  attendeeRole: role,
                  attendeeEmail: email,
                  eventAttendeeId: foundObj.id,
                  eventId: foundObj.fields.event[0],
                  eventDate: foundObj.fields.event_date[0],
                  eventDateSpaceTime: spacetime(
                    foundObj.fields.event_date[0],
                    'America/New_York'
                  ),
                  eventName: foundObj.fields.event_name[0],
                  eventDone: foundObj.fields.done || false,
                  eventProgramId: foundObj.fields.program_id
                    ? foundObj.fields.program_id[0]
                    : '',
                  redirectLookupId: foundObj.fields.redirect_lookup_id,
                  comment: foundObj.fields.comment || '',
                })
              }
            })
          } else {
            data.push({
              attendeeId: attendee.id,
              attendeeFullName: full_name,
              attendeeFirstName: first_name,
              attendeeLastName: last_name,
              attendeeRole: role,
              attendeeEmail: email,
            })
          }
        })
        const output = data.filter(obj => {
          return obj.attendeeFullName
            .toLowerCase()
            .includes(state.searchString.toLowerCase())
        })

        return sortBy(
          output.filter(data => {
            if ('eventDateSpaceTime' in data)
              return data.eventDateSpaceTime.isAfter(NOW)
            return true
          }),
          [o => new Date(o.eventDate), 'eventDateSpaceTime']
        )
      },
      eventsToday: state => {
        return sortBy(
          state.events.filter(event =>
            spacetime(event.fields.meeting_date, 'America/New_York').isAfter(
              NOW
            )
          ),
          [o => new Date(o.fields.meeting_date)]
        )
      },
    },
    actions: {
      async GET_ATTENDEES({ commit }) {
        const response = await this.$axios.$get(
          '/Attendees?maxRecords=100&view=Grid%20view' + API_KEY_STRING
        )
        commit('set_attendees', response.records)
      },
      async GET_EVENTS({ commit }) {
        const response = await this.$axios.$get(
          '/Events?maxRecords=100&view=Today' + API_KEY_STRING
        )
        commit('set_events', response.records)
      },
      async GET_EVENT_ATTENDEES({ commit }) {
        const response = await this.$axios.$get(
          '/Event_Attendee?maxRecords=100&view=Today' + API_KEY_STRING
        )
        commit('set_event_attendees', response.records)
      },
      async UPDATE_COMMENT_EVENT_ATTENDEE(
        { dispatch },
        { eventAttendeeId, comment }
      ) {
        await this.$axios.$patch(
          `/Event_Attendee/${eventAttendeeId}?` + API_KEY_STRING,
          {
            fields: { comment },
          }
        )

        dispatch('GET_EVENT_ATTENDEES')
      },
      async UPDATE_DONE_EVENT_ATTENDEE(
        { dispatch },
        { eventAttendeeId, done }
      ) {
        await this.$axios.$patch(
          `/Event_Attendee/${eventAttendeeId}?` + API_KEY_STRING,
          {
            fields: { done },
          }
        )

        dispatch('GET_EVENT_ATTENDEES')
      },
      async CREATE_ATTENDEE(
        { dispatch },
        { attendeeFirstName, attendeeLastName, attendeeEmail, attendeeRole }
      ) {
        const response = this.$axios.$post('/Attendees?' + API_KEY_STRING, {
          fields: {
            first_name: attendeeFirstName,
            last_name: attendeeLastName,
            email: attendeeEmail,
            role: attendeeRole,
          },
        })

        dispatch('nuxtClientInit')
        return response
      },
      async UPDATE_ATTENDEE(
        { dispatch },
        {
          attendeeId,
          attendeeFirstName,
          attendeeLastName,
          attendeeEmail,
          attendeeRole,
        }
      ) {
        await this.$axios.$patch(`/Attendees/${attendeeId}?` + API_KEY_STRING, {
          fields: {
            first_name: attendeeFirstName,
            last_name: attendeeLastName,
            email: attendeeEmail,
            role: attendeeRole,
          },
        })

        dispatch('GET_ATTENDEES')
      },
      async CREATE_EVENT_ATTENDEE(
        { state, commit, dispatch },
        { event, attendee }
      ) {
        await this.$axios.$post('/Event_Attendee?' + API_KEY_STRING, {
          fields: { event: [event], attendee: [attendee] },
        })

        dispatch('nuxtClientInit')
      },
      async nuxtClientInit({ dispatch }) {
        await Promise.all([
          dispatch('GET_ATTENDEES'),
          dispatch('GET_EVENTS'),
          dispatch('GET_EVENT_ATTENDEES'),
        ])
      },
    },
  })
}

export default createStore
