import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const MonthSelect = ({ value, onChange }) => {
  const months = [
    { label: 'ทุกเดือน', value: 'all' },
    { label: 'มกราคม', value: '01' },
    { label: 'กุมภาพันธ์', value: '02' },
    { label: 'มีนาคม', value: '03' },
    { label: 'เมษายน', value: '04' },
    { label: 'พฤษภาคม', value: '05' },
    { label: 'มิถุนายน', value: '06' },
    { label: 'กรกฎาคม', value: '07' },
    { label: 'สิงหาคม', value: '08' },
    { label: 'กันยายน', value: '09' },
    { label: 'ตุลาคม', value: '10' },
    { label: 'พฤศจิกายน', value: '11' },
    { label: 'ธันวาคม', value: '12' }
  ];

  return (
    <TextField
      select
      label="เลือกเดือน"
      value={value}
      onChange={onChange}
      variant="standard"
    >
      <MenuItem value="เลือกเดือน">เลือกเดือน</MenuItem>
      {months.map((month) => (
        <MenuItem key={month.value} value={month.value}>
          {month.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default MonthSelect;
