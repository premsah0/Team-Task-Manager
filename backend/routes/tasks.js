import express from "express";
const router = express.Router();
import Task from "../models/Task.js";
import { protect, admin } from '../middleware/auth.js';

// Create a task (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, assignedTo, projectId, dueDate } = req.body;

        const task = new Task({
            title,
            description,
            assignedTo,
            projectId,
            dueDate
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get tasks for a user or admin
router.get('/', protect, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            // Admin sees all tasks for their projects (simplification: sees all tasks)
            tasks = await Task.find({}).populate('assignedTo', 'name email').populate('projectId', 'name');
        } else {
            // Member sees their assigned tasks
            tasks = await Task.find({ assignedTo: req.user.id }).populate('projectId', 'name');
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update task status (Member or Admin)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Simplification: both Admin and assigned Member can update status
        task.status = status;
        const updatedTask = await task.save();

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;