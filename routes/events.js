const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

// Create new event (authenticated users only)
router.post('/', auth, async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            creator: req.user._id
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all upcoming events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ date: { $gt: new Date() } })
            .populate('creator', 'name email')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register for an event
router.post('/:eventId/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.date < new Date()) {
            return res.status(400).json({ message: 'Cannot register for past events' });
        }

        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        event.registeredUsers.push(req.user._id);
        await event.save();

        // Add event to user's registered events
        req.user.registeredEvents.push(event._id);
        await req.user.save();

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cancel event registration
router.delete('/:eventId/cancel/:userId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is registered
        if (!event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Not registered for this event' });
        }

        // Remove user from event's registered users
        event.registeredUsers = event.registeredUsers.filter(
            userId => userId.toString() !== req.user._id.toString()
        );
        await event.save();

        // Remove event from user's registered events
        req.user.registeredEvents = req.user.registeredEvents.filter(
            eventId => eventId.toString() !== event._id.toString()
        );
        await req.user.save();

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 