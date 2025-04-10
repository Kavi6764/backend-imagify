import express from 'express';
import { GenerateImage } from '../Controller/imagecontroller.js';
import authtoken from "../MiddleWare/auth.js"

const imageRouter = express.Router();

imageRouter.post('/generate-images',authtoken,GenerateImage)

export default imageRouter;