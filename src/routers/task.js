import express from "express";
import {Task} from "../Models/task.js";
import {auth} from "../Middleware/auth.js";

const router = new express.Router();


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req,res) => {
    //helps to filter data that are sent.
    let match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    try {
        const tasks =  await Task.find({owner: req.user._id}).limit(limit).skip(skip).where(match).sort(sort);
        res.send(tasks);
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth,  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isAllowed = updates.every(update => allowedUpdates.includes(update));
    if(!isAllowed){
        return res.status(400).send({error : 'Invalid updates'})
    }
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id });
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        // const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const {id} = req.params;
    try {
        const task = await Task.findOneAndDelete({_id: id, owner : req.user._id});
        if(!task) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (e) {
        res.status(400).send()
    }
})
export default router;