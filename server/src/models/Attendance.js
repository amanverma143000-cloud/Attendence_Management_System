import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    punchIn: { type: Date },
    punchOut: { type: Date },
    punchInImage: { type: String }, // base64
    punchOutImage: { type: String }, // base64
    punchInLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    punchOutLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Completed', 'Incomplete', 'Absent', 'Pending'],
      default: 'Pending',
    },
    validationStatus: {
      type: String,
      enum: ['Pending', 'Valid', 'Invalid'],
      default: 'Pending',
    },
    remarks: { type: String, default: '' },
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Compound unique index: one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
