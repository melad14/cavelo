import axios from 'axios';


// Function to send notification to all users
const sendNotificationToAll = async (title, message) => {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${process.env.ONE_SIGNAL_API_KEY}`, // Your OneSignal API Key
    };

    const data = {
        app_id: process.env.ONE_SIGNAL_APP_ID, // Your OneSignal App ID
        headings: { ["en"]: title }, // The title of the notification
        contents: { ["en"]: message }, // The message content of the notification
        included_segments: ['All'], // Sends to all users
        // small_icon: process.env.LOGO_URL, // This should match the name of the drawable resource for small icons
    };

    try {
        const response = await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
    } catch (error) {
        console.error('Error sending notification to all users:', error.response ? error.response.data : error.message);
    }
};

// Function to send notification to a specific user
const sendNotificationToSpecificUser = async (playerId, title, message) => {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${process.env.ONE_SIGNAL_API_KEY}`, // Your OneSignal API Key
    };

    const data = {
        app_id: process.env.ONE_SIGNAL_APP_ID, // Your OneSignal App ID
        headings: { ["en"]: title }, // The title of the notification
        contents: { ["en"]: message }, // The message content of the notification
        include_player_ids: [playerId], // Target specific user by their OneSignal player ID
        //small_icon: process.env.LOGO_URL, // This should match the name of the drawable resource for small icons
    };

    try {
     await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
    } catch (error) {
        console.log(`Error sending notification to user ${playerId}:`, error.response ? error.response.data : error.message);
    }
};
export { sendNotificationToAll, sendNotificationToSpecificUser }

