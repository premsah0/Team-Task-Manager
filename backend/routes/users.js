import express from "express";
const router = express.Router();
import User from "../models/User.js";
import { protect } from '../middleware/auth.js';

import Project from "../models/Project.js";

// Get all users (for assigning tasks and adding to projects)
router.get('/', protect, async (req, res) => {
    try {
        const { projectId } = req.query;
        if (projectId) {
            const project = await Project.findById(projectId);
            if (project && project.members && project.members.length > 0) {
                const users = await User.find({ _id: { $in: project.members } }).select('-password');
                return res.json(users);
            }
        }
        
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
