const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userSchema = require('../models/user')

router.post('/host', async (req, res) => {
    const { name, roomid, presenter, host } = req.body;
    const newUser = new userSchema({
        name,
        roomId: roomid,
        presenter,
        host
    })
    try {
        await newUser.save()
        res.status(201).json({ msg: 'room created successfully', success: true })
    } catch (error) {
        res.status(404).json({ msg: 'Error occured', success: false });
    }
})

router.post('/student', async (req, res) => {
    const { joinname, joinid, presenter, host } = req.body;

    try {
        const roomId = joinid
        const id = await userSchema.findOne({ roomId });
        if (!id) {
            return res.status(404).json({ message: 'No room of such id!', success: false });
        }

        const newUser = new userSchema({
            name: joinname,
            presenter,
            host
        });

        await newUser.save();
        return res.status(201).json({ message: 'Room joined successfully', success: true });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: 'Error occurred', success: false });
    }
});

module.exports = router
