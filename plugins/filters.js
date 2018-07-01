import Vue from 'vue'
const spacetime = require('spacetime')

Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('formatDate', function(value) {
  if (!value) return ''
  return spacetime(value, 'America/New_York').format('MM.dd h:mm a')
})
