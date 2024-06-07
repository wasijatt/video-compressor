// googleApi.js
export function loadGoogleApi(callback) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client:auth2', callback);
    };
    document.body.appendChild(script);
  }
  