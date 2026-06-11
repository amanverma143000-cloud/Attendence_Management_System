import Overtime from '../models/Overtime.js';

export const requestOvertime = async (req, res) => {
  const { date, hours, reason, attendance } = req.body;
  const record = await Overtime.create({ user: req.user._id, date, hours, reason, attendance });
  res.status(201).json(record);
};

export const getMyOvertime = async (req, res) => {
  const records = await Overtime.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(records);
};

export const getAllOvertime = async (req, res) => {
  const records = await Overtime.find().populate('user', 'name email department').sort({ createdAt: -1 });
  res.json(records);
};

export const reviewOvertime = async (req, res) => {
  const { id } = req.params;
  const { status, reviewRemarks } = req.body;
  const record = await Overtime.findByIdAndUpdate(
    id,
    { status, reviewRemarks, reviewedBy: req.user._id },
    { new: true }
  );
  if (!record) return res.status(404).json({ message: 'Overtime record not found' });
  res.json(record);
};
