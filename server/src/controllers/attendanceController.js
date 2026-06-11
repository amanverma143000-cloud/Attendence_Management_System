import Attendance from '../models/Attendance.js';

const todayDate = () => new Date().toISOString().split('T')[0];

// --- Geofencing config ---
// Set GEOFENCING_ENABLED=true in .env to enforce location restriction.
// Set OFFICE_LAT, OFFICE_LNG, OFFICE_RADIUS_KM in .env to configure the office boundary.
const GEOFENCING_ENABLED = process.env.GEOFENCING_ENABLED === 'true';
const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT || '28.6139');
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG || '77.2090');
const ALLOWED_RADIUS_KM = parseFloat(process.env.OFFICE_RADIUS_KM || '0.5');

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isWithinGeofence(location) {
  if (!GEOFENCING_ENABLED) return true;            // disabled in dev by default
  if (!location?.latitude || !location?.longitude) return true; // no location = allow
  const dist = haversineDistance(location.latitude, location.longitude, OFFICE_LAT, OFFICE_LNG);
  return dist <= ALLOWED_RADIUS_KM;
}

export const punchIn = async (req, res) => {
  const date = todayDate();
  const { image, location } = req.body;

  if (!isWithinGeofence(location)) {
    return res.status(403).json({ message: `You are outside the allowed office radius (${ALLOWED_RADIUS_KM} km). Punch-in denied.` });
  }

  const existing = await Attendance.findOne({ user: req.user._id, date });
  if (existing?.punchIn) return res.status(400).json({ message: 'Already punched in today' });

  const record = existing
    ? Object.assign(existing, { punchIn: new Date(), punchInImage: image, punchInLocation: location })
    : new Attendance({ user: req.user._id, date, punchIn: new Date(), punchInImage: image, punchInLocation: location });

  await record.save();
  res.status(201).json(record);
};

export const punchOut = async (req, res) => {
  const date = todayDate();
  const { image, location } = req.body;

  if (!isWithinGeofence(location)) {
    return res.status(403).json({ message: `You are outside the allowed office radius (${ALLOWED_RADIUS_KM} km). Punch-out denied.` });
  }

  const record = await Attendance.findOne({ user: req.user._id, date });
  if (!record?.punchIn) return res.status(400).json({ message: 'No punch-in found for today' });
  if (record.punchOut) return res.status(400).json({ message: 'Already punched out today' });

  record.punchOut = new Date();
  record.punchOutImage = image;
  record.punchOutLocation = location;
  record.totalHours = parseFloat(((record.punchOut - record.punchIn) / 3600000).toFixed(2));
  record.status = record.totalHours >= 8 ? 'Completed' : 'Incomplete';

  await record.save();
  res.json(record);
};

export const getMyAttendance = async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
  res.json(records);
};

export const getTodayAttendance = async (req, res) => {
  const record = await Attendance.findOne({ user: req.user._id, date: todayDate() });
  res.json(record || null);
};

export const getAllAttendance = async (req, res) => {
  const records = await Attendance.find()
    .populate('user', 'name email department')
    .sort({ date: -1 });
  res.json(records);
};

export const getAttendanceById = async (req, res) => {
  const record = await Attendance.findById(req.params.id)
    .populate('user', 'name email department');
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
};

export const validateAttendance = async (req, res) => {
  const { id } = req.params;
  const { validationStatus, remarks } = req.body;
  const record = await Attendance.findByIdAndUpdate(
    id,
    { validationStatus, remarks, validatedBy: req.user._id },
    { new: true }
  );
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
};
