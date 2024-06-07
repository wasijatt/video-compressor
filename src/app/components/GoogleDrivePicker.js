"use client"
import { useEffect } from 'react';

const GoogleDrivePicker = ({ onPick }) => {
  useEffect(() => {
    const onApiLoad = () => {
      gapi.load('auth', { 'callback': onAuthApiLoad });
      gapi.load('picker', { 'callback': onPickerApiLoad });
    };

    const onAuthApiLoad = () => {
      gapi.auth.authorize(
        {
          'client_id': YOUR_CLIENT_ID,
          'scope': ['https://www.googleapis.com/auth/drive.file'],
        },
        handleAuthResult
      );
    };

    const onPickerApiLoad = () => {
      createPicker();
    };

    const handleAuthResult = (authResult) => {
      if (authResult && !authResult.error) {
        createPicker();
      }
    };

    const createPicker = () => {
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(gapi.auth.getToken().access_token)
        .setDeveloperKey(YOUR_DEVELOPER_KEY)
        .setCallback((data) => {
          if (data.action === google.picker.Action.PICKED) {
            const fileId = data.docs[0].id;
            onPick(fileId);
          }
        })
        .build();
      picker.setVisible(true);
    };

    gapi.load('client:auth2', onApiLoad);
  }, [onPick]);

  return (
    <button onClick={createPicker} className="bg-green-500 text-white p-2 rounded">Pick from Google Drive</button>
  );
};

export default GoogleDrivePicker;
