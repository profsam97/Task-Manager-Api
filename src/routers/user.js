import express from "express";
import {User} from "../Models/user.js";
import {auth} from "../Middleware/auth.js";
import multer from 'multer'
import sharp from 'sharp'
import {sendCancelEmail, sendWelcomeEmail} from "../email/index.js";
const router = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Only jpg, jpeg and png are supported'))
        }
        cb(undefined, true)
    }
})
router.post('/users', async (req, res)=> {
    const user = new User(req.body);
    try {
        await user.save()
        await  sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    }catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/logout', auth, async (req,  res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
       await req.user.save();
        res.send()
    }catch (e) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = [];
      await  req.user.save()
        res.send();
    }catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
            res.send(req.user);
})
// router.get('/users/:id', async (req, res) => {
//     const {id} = req.params;
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }
//     catch (e) {
//         res.status(500).send();
//     }
// })
router.patch('/users/me', auth,
    async (req, res) => {
        const updates = Object.keys(req.body);

        const allowedUpdates = ['name', 'age', 'password', 'email'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) {
            return res.status(400).send('Invalid updates!')
        }
        try {
            updates.forEach(update => req.user[update] = req.body[update]);
            req.user.save();
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }
    })
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
     await   sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 300, height: 300}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
   res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = null;
  await  req.user.save();
    res.send();
})
router.get('/users/:id/avatar', async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch (e) {
        res.status(404).send()
    }
})
export default router;