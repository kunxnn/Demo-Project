import React, { useState } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import MonthSelect from './MonthSelect';
import YearSelect from './YearSelect';

type ReportExportBoxProps = {
    month: string;
    year: string;
    setMonth: (value: string) => void;
    setYear: (value: string) => void;
};

const ReportExportBox = ({ month, year, setMonth, setYear }: ReportExportBoxProps) => {


    const months = [
        { label: 'เลือกเดือน', value: 'เลือกเดือน' },
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

    const handleExport = async () => {

        if ((month === 'เลือกเดือน' || month === '') && (year === 'เลือกปี' || year === '')) {
            alert('กรุณาเลือกเดือนและปี');
            return;
        } else if (month !== 'all' && (year === 'เลือกปี' || year === '')) {
            alert('กรุณาเลือกปีด้วยเมื่อต้องการค้นหาตามรายเดือน');
            return;
        } else if ((month === '' || month === 'เลือกเดือน') && year !== '' && year !== 'เลือกปี') {
            alert('กรุณาเลือกเดือนด้วย');
            return;
        }
        else if (month === 'all' && (year === '' || year === 'เลือกปี')) {
            alert('กรุณาเลือกปีด้วย');
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/report/export-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ month, year }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${month}_${year}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const selectedMonthLabel = months.find((m) => m.value === month)?.label || '-';


    return (
        <Box
            sx={{
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                รายงานข้อมูลประจำเดือน
            </Typography>

            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: 'text.secondary', mb: 2 }}
            >
                เลือกเดือนและปีเพื่อส่งออกข้อมูลในรูปแบบ Excel
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ justifyContent: 'center', alignItems: 'center', mb: 1 }}
            >
                <MonthSelect
                    value={month}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMonth(e.target.value)}
                />
                <YearSelect
                    value={year}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYear(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleExport}
                    sx={{ minWidth: 140 }}
                >
                    Export Excel
                </Button>
            </Stack>

            <Typography
                variant="subtitle1"
                sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}
            >
                เดือนที่เลือก: <strong>{selectedMonthLabel}</strong>  ปีที่เลือก: <strong>{year}</strong>
            </Typography>
        </Box>

    );
};

export default ReportExportBox;
