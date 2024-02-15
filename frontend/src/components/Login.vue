<template>
    <div class="column">
      <h3>Login</h3>
      <button class="q-mb-sm" @click="loginWithGoogle">Login with Google</button>
      <button class="q-mb-sm text-blue" @click="loginWithFacebook">Login with Facebook</button>
      <button class="q-mb-sm text-red" @click="loginWithLinkedIn">Login with LinkedIn</button>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  export default {
    mounted() {
        window.fbAsyncInit = function() {
      FB.init({
        appId: '923605945832759',
        cookie: true,
        xfbml: true,
        version: 'v13.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_GB/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
      },
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
          FB.login(function (response) {
            let fbName
            let fbEmail
            let facebookId
            if (response.authResponse) {
              const accessToken = response.authResponse.accessToken;
              FB.api('/me', { fields: 'name, email, id' }, function (response) {
                fbName = response.fbName
                fbEmail = response.email
                facebookId = response.id
              })
              /*Pass fbName, fbEmail and accessToken to the backend by Calling  
                the api to create the user and authenticate the user */
              axios.post('/api/auth/facebook/callback', {
                name: fbName,
                email: fbEmail,
                facebookId,
                accessToken
              })
                .then(response => {
                  // After successful authentication redirect the user to the homepage
                  window.location.href = response.data
                })
                .catch(error => {
                  console.error('Error authenticating user with Facebook on the backend:', error);
                });
            } else {
              // User canceled login or did not authorize your app
              console.error('Error logging in with Facebook');
            }
          }, { scope: 'public_profile,email' });
        } catch (error) {
          console.error('Error logging in with Facebook:', error);
          // Handle error (e.g., show error message)
        }
      },
        async loginWithLinkedIn() {
            try {
                // Make API call to your backend to initiate LinkedIn login
                const response = await axios.get('/auth/linkedin');
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
  