import mongoose from "mongoose";

export const dbConnect = mongoose

dbConnect.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,

});
//
// const Task = mongoose.model('task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed : {
//         type: Boolean,
//         default: false
//     }
// })
// const task = new Task({
//     // description: ' This is the se cond  task i created with mongooseDB '
// })

// const user = new User({
//     name: ' Samuel   ',
//     email: 'NSJJJNf@djfd.com',
//     password: 'tobyson'
// });
//
// await user.save().then(result=> {
//     console.log(result)
// }).catch(err => console.log(err))
// task.save().then(result => console.log(result)).catch(err => console.log(err))