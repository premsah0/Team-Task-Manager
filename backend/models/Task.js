import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
    dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
