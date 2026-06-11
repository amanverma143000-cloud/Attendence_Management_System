export function exportToCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function flattenAttendance(records) {
  return records.map((r) => ({
    Employee: r.user?.name || '',
    Email: r.user?.email || '',
    Department: r.user?.department || '',
    Date: r.date,
    'Punch In': r.punchIn ? new Date(r.punchIn).toLocaleTimeString() : '',
    'Punch Out': r.punchOut ? new Date(r.punchOut).toLocaleTimeString() : '',
    'Total Hours': r.totalHours,
    Status: r.status,
    Validation: r.validationStatus,
    Remarks: r.remarks || '',
    'Lat (In)': r.punchInLocation?.latitude || '',
    'Lng (In)': r.punchInLocation?.longitude || '',
    'Lat (Out)': r.punchOutLocation?.latitude || '',
    'Lng (Out)': r.punchOutLocation?.longitude || '',
  }));
}

export function flattenOvertime(records) {
  return records.map((o) => ({
    Employee: o.user?.name || '',
    Email: o.user?.email || '',
    Date: o.date,
    Hours: o.hours,
    Reason: o.reason,
    Status: o.status,
    'Review Remarks': o.reviewRemarks || '',
  }));
}
