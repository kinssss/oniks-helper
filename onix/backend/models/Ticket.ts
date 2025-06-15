import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  cabinet: { type: String, required: true },
  problem: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'in_progress', 'pending', 'completed'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema);