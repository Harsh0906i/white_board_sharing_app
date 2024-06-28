const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userSchema = require('../models/user')

router.post('/google', (req, res) => {
    const { name, email, photo } = req.body
    try {
        res.status(200).json({ name, email, photo })
    } catch (error) {
        console.log(error)
    }
})
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const roomId = id
        await userSchema.findOneAndDelete({ roomId });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
