import express from 'express';
const router = express.Router();
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';

// Create a project (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, members } = req.body; 
    
        const project = new Project({
            name,
            members,
            createdBy: req.user.id
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all projects user is part of or created
router.get('/', protect, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.find({ createdBy: req.user.id }).populate('members', 'name email');
        } else {
            projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
        }
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
