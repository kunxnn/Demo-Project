import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const YearSelect = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <TextField
      select
      label="เลือกปี"
      value={value}
      onChange={onChange}
      variant="standard"
    >
      <MenuItem value="เลือกปี">เลือกปี</MenuItem>
      {years.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default YearSelect;
