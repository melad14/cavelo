import express from "express";

import { getNotifications, getOneNotification, updateNotification } from "./notification.controller.js";
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";
import { validation } from './../../middleware/validation.js';
import { getNotSchema } from './notification.validation.js';

const notificationRouter = express.Router();

notificationRouter.get("/get-all-notifications", protectedRoutes, allowTo('user','admin'), getNotifications);
notificationRouter.put("/update-notification/:id", protectedRoutes, allowTo('user','admin'),  validation(getNotSchema), updateNotification);
notificationRouter.get("/get-notification/:id", protectedRoutes, allowTo('user','admin'), validation(getNotSchema), getOneNotification);

export default notificationRouter;
