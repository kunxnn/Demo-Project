'use client';
import React, { useEffect, useState } from 'react';

//mui
import { Box, Tab, Grid, Typography, Chip, TextField, MenuItem, Stack, Button, CircularProgress, Backdrop, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

//ui shadcn components
import { PageHeader } from "../../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




import { fetchhistorywithqueue } from "../../api/api_queue";

interface Patient {
  patient_id: number;
  patient_HN: string;
  patient_title: string;
  patient_firstname: string;
  patient_lastname: string;
}

interface Stage {
  stage_id: number;
  stage_name: string;
  description?: string;
}

interface Queue {
  queue_id: number;
  bed_number: number;
  patient: Patient;
  stage: Stage;
  status: string;
  hasHistory: boolean;
  history_treatment: HistoryTreatment;
  status_show_display: boolean;
}

interface HistoryTreatment {
  history_id: number;
}

export default function Detail_treatment() {


  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="รายละเอียดการรักษา" breadcrumbs={[{ label: "หน้าหลัก", href: "/" }, { label: "รายละเอียดการรักษา" }]} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card className="col-span-4 p-6 shadow-lg rounded-2xl bg-white">
          {/* หัวข้อใหญ่ */}
          
        </Card>

      </div>
    </div>
  )
}



