import mongoose from 'mongoose';

const overtimeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' },
    date: { type: String, required: true },
    hours: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Overtime', overtimeSchema);
