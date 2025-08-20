import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connnectDB from './Config/mongodb.js';
import router from './Routes/userRoutes.js';
import imageRouter from './Routes/imageRoutes.js';

const Port = process.env.PORT || 4000
const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors())
await connnectDB()



app.use('/api/user', router)

app.use('/api/image',imageRouter)
app.get('/',(req, res) =>{
    res.send('Hello World! Hit enter')
})

app.listen(Port, () => console.log(`Server running on port ${Port}`))
