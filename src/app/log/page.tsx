'use client';
import React, { useEffect, useState } from 'react';

//mui
import { Box, Grid, Typography, TextField, MenuItem, Stack, Button, CircularProgress, Backdrop, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts/';

//ui shadcn components
import { PageHeader } from "../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//icon
import { Activity, Users, FileText, Calendar } from "lucide-react"
import { Icon } from '@iconify/react';

//componet
import ReportExportBox from "../components/report/header_report"

//api
import { fetchGetdataLog } from "../api/api_log"

import { formatDateTime } from '@/util/formatDateTime';

export default function reports() {

  const stats = [
    {
      title: "ผู้ป่วยทั้งหมด",
      value: "1,234",
      description: "เพิ่มขึ้น 12% จากเดือนที่แล้ว",
      icon: Users,
    },
    {
      title: "การนัดหมายวันนี้",
      value: "23",
      description: "มีการนัดหมาย 5 รายการใหม่",
      icon: Calendar,
    },
    {
      title: "เวชระเบียนใหม่",
      value: "89",
      description: "สร้างในสัปดาห์นี้",
      icon: FileText,
    },
    {
      title: "สถานะระบบ",
      value: "ปกติ",
      description: "ระบบทำงานได้ดี 99.9%",
      icon: Activity,
    },
  ]


  type GenderData = {
    male: number;
    female: number;
    IPD: number;
    OPD: number;
    OPDMedcare: number;
    IPDclinic: number;
    hospital_sungmen: number;
    hospital_denchai: number;
    hospital_RongKwang: number;
    hospital_phrae: number;
    hospital_christan: number;
    hospital_phraeram: number;
    procedure_permcath: number;
    procedure_offpermcath: number;
    procedure_offdlc: number;
    vascularDLC: number;
  };

  interface Log {
    log_id: number;
    nurse_id: number;
    status: string;
    date_log: string;
    browser: string;
    device: string;
    action: string;
  }


  const [DataLog, setDataLog] = useState<Log[]>([]);

  useEffect(() => {
    const GetLog = async () => {
      try {
        const data = await fetchGetdataLog();
        setDataLog(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการใช้งาน", error);
      }
    };
    GetLog();
  }, []);

  // const [loading, setLoading] = useState(true);


  // if (loading) {
  //   return (
  //     <Backdrop
  //       sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  //       open={loading}
  //     >
  //       <CircularProgress color="inherit" />
  //     </Backdrop>
  //   );
  // }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "หน้าหลัก", href: "/patient" },
          { label: "ประวัติการเข้าใช้งาน" }
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

        <Card className="col-span-4">

          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold">
              ประวัติการเข้าใช้งาน
            </CardTitle>

          </CardHeader>
          <CardContent>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>เวลาที่เข้าสู่ระบบ</TableCell>
                  <TableCell>ข้อมูลอุปกรณ์</TableCell>
                  <TableCell>เบราว์เซอร์</TableCell>
                  <TableCell>รูปแบบ</TableCell>
                  <TableCell>สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DataLog.map((l, index) => (
                  <TableRow key={l.log_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatDateTime(l.date_log)}</TableCell>
                    <TableCell>{l.device}</TableCell>
                    <TableCell>{l.browser}</TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell>
                      {l.status === "success" ? (
                        <Icon icon="solar:check-circle-bold" width={32} height={32} color="green" />
                      ) : (
                        l.status
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



