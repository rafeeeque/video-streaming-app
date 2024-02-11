<template>
    <div class="column">
      <h3>Login</h3>
      <button class="q-mb-sm" @click="loginWithGoogle">Login with Google</button>
      <button class="q-mb-sm text-blue" disabled @click="loginWithFacebook">Login with Facebook</button>
      <button class="q-mb-sm text-red" disabled @click="loginWithLinkedIn">Login with LinkedIn</button>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  export default {
    methods: {
        async loginWithGoogle() {
            try {
                // Make API call to your backend to initiate Google login
                const response = await axios.get('/auth/google');
                // Handle the response (e.g., redirect to the returned authentication URL)
                console.log('response.data', response.data)
                window.location.href = response.data.authUrl;
            } catch (error) {
                console.error('Error logging in with Google:', error);
                // Handle error (e.g., show error message)
            }
        },
        async loginWithFacebook() {
            try {
                // Make API call to your backend to initiate Facebook login
                const response = await axios.post('/auth/facebook');
                // Handle the response (e.g., redirect to the returned authentication URL)
                window.location.href = response.data.authUrl;
            } catch (error) {
                console.error('Error logging in with Facebook:', error);
                // Handle error (e.g., show error message)
            }
        },
        async loginWithLinkedIn() {
            try {
                // Make API call to your backend to initiate LinkedIn login
                const response = await axios.post('/auth/linkedin');
                // Handle the response (e.g., redirect to the returned authentication URL)
                window.location.href = response.data.authUrl;
            } catch (error) {
                console.error('Error logging in with LinkedIn:', error);
                // Handle error (e.g., show error message)
            }
        }
    }
  };
  </script>
  