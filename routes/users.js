const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's registered events
router.get('/:userId/events', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: 'registeredEvents',
                match: { date: { $gt: new Date() } }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.registeredEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 