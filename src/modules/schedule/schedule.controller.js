import { Schedule } from "../../../databases/models/schedule.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";



export const addSchedule = catchAsyncErr(async (req, res, next) => {
  
    const schedule = new Schedule(req.body);
    await schedule.save();
    return res.status(200).json({ "message": " success","statusCode":200, schedule })

});


export const getSchedules = catchAsyncErr(async (req, res, next) => {
    const schedules = await Schedule.find();
    return res.status(200).json({ "message": " success", "statusCode":200,schedules })

});


export const editSchedule = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
   

    const schedule = await Schedule.findByIdAndUpdate(id,req.body,{new:true});
    if (!schedule) {
        return next(new AppErr('not found', 404))
    }
    return res.status(200).json({ "message": " success","statusCode":200, schedule })

});
