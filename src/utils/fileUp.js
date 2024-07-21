import cloudinarySdk from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
const { v2: cloudinary } = cloudinarySdk;
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.MY_CLOUD_NAME,
  api_key: process.env.MY_CLOUD_KEY,
  api_secret: process.env.MY_CLOUD_SECRETKEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'jpeg', 
    public_id: (req, file) => uuidv4() + "-" + file.originalname,
  },
});

export const upload = multer({ storage });

export {  cloudinary };