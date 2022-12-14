import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description : {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner : {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

export const Task = mongoose.model('Task', taskSchema )