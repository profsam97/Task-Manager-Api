import express from 'express'
import {dbConnect} from './db/mongoose.db.js'
import userRouter from './routers/user.js';
import taskRouter from  './routers/task.js'

const app = express();
dbConnect;


app.use(express.json()) //allows use to  parse incoming json to object so that we can use it in req
const port = process.env.PORT;


app.use(userRouter)
app.use(taskRouter);
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})