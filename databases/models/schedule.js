import mongoose from "mongoose";

const scheduleSchema  = mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
}, { timestamps: true })


export const Schedule  = mongoose.model('Schedule ', scheduleSchema )




