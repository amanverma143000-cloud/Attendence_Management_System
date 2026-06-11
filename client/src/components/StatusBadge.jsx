const colors = {
  Completed: 'bg-green-100 text-green-800',
  Incomplete: 'bg-yellow-100 text-yellow-800',
  Absent: 'bg-red-100 text-red-800',
  Pending: 'bg-gray-100 text-gray-700',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Valid: 'bg-green-100 text-green-800',
  Invalid: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}
