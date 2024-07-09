import mongoose from "mongoose";

const scheduleSchema = mongoose.Schema({
  sunday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  monday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  tuesday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  wednesday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  thursday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  friday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  saturday: {

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

  },
  
}, { timestamps: true })


export const Schedule = mongoose.model('Schedule ', scheduleSchema)




