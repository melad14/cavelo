
import textflow from  "textflow.js"

import * as dotenv from 'dotenv';
dotenv.config();

textflow.useKey(process.env.TEXTFLOW_API);

export async function sendSMSTest(phoneNumber, message) {
    try {
        await textflow.sendSMS(phoneNumber, message);
    } catch (error) {
        console.error("Failed to send SMS:", error);
    }
}



