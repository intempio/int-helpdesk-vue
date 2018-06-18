export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    $axios.setHeader('Authorization', 'Bearer keyF5RqI6oSraQNK7');
  });
}
