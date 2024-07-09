import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
       
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    specialRequests: {
        type: String
    }
});

const Reservation = mongoose.model('reservation', reservationSchema);

export default Reservation;
