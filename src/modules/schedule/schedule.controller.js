import { Schedule } from "../../../databases/models/schedule.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";



export const addSchedule = catchAsyncErr(async (req, res, next) => {
    const { day, startTime, endTime } = req.body;
    const schedule = new Schedule({ day, startTime, endTime });
    await schedule.save();
    return res.status(201).json({ "message": " success", schedule })

});

export const getSchedules = catchAsyncErr(async (req, res, next) => {
    const schedules = await Schedule.find();
    return res.status(201).json({ "message": " success", schedules })

});

export const editSchedule = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const {startTime, endTime} = req.body;

    const schedule = await Schedule.findByIdAndUpdate(id,{startTime, endTime},{new:true});
    if (!schedule) {
        return next(new AppErr('not found', 404))
    }
    
    return res.status(201).json({ "message": " success", schedule })

});
