'use client';
import React, { useEffect, useState } from 'react';

//mui
import { Box, Grid, Typography, TextField, MenuItem, Stack, Button, CircularProgress, Backdrop } from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts/';

//ui shadcn components
import { PageHeader } from "../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//icon
import { Activity, Users, FileText, Calendar } from "lucide-react"

//componet
import ReportExportBox from "../components/report/header_report"

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

  const [month, setMonth] = useState('เลือกเดือน');
  const [year, setYear] = useState('เลือกปี');
  const [DataCountAll, setDataCountAll] = useState<GenderData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenderCount = async () => {
      try {
        const res = await fetch('http://localhost:3333/report/yearmonth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ month, year }),
        });
        const result = await res.json();
        console.log(result)
        setDataCountAll(result);
      } catch (error) {
        console.error('Error fetching gender data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchGenderCount();
  }, [month, year]);


  if (loading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!DataCountAll) return <div>ไม่พบข้อมูล</div>;



  const pieDataCountIPDOPD = [
    { id: 0, value: DataCountAll.IPD, label: 'IPD', color: '#42a5f5' },
    { id: 1, value: DataCountAll.OPD, label: 'OPD', color: '#ef5350' },
  ];

  const getRandomColor = () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

  const pieDataCountClinicandhospital = [
    { value: DataCountAll.OPDMedcare, label: "เมดแคร์", },
    { value: DataCountAll.IPDclinic, label: "คลินิก พ.วุฒิกร", },
    { value: DataCountAll.hospital_sungmen, label: "รพ สูงเม่น", },
    { value: DataCountAll.hospital_denchai, label: "รพ เด่นชัย", },
    { value: DataCountAll.hospital_RongKwang, label: "รพ ร้องกวาง", },
    { value: DataCountAll.hospital_phrae, label: "รพแพร่ ไต 3", },
    { value: DataCountAll.hospital_christan, label: "รพ คริสเตียน", },
    { value: DataCountAll.hospital_phraeram, label: "รพ แพร่ราม", },
  ].map((item) => ({
    ...item,
    color: getRandomColor(), // เพิ่มสีสุ่ม
  }));

  const barDataCountGender = [
    { value: DataCountAll.male, label: 'ชาย', color: '#42a5f5' },
    { value: DataCountAll.female, label: 'หญิง', color: '#ef5350' }
  ];

  const xLabels_gender = barDataCountGender.map(item => item.label);
  const seriesData_gender = barDataCountGender.map(item => item.value);
  const barColors_gender = barDataCountGender.map(item => item.color);


  const pieDataCountProduceVascular = [
    { value: DataCountAll.procedure_permcath, label: 'ใส่สาย perm cath' },
    { value: DataCountAll.procedure_offpermcath, label: 'OFF Perm cath' },
    { value: DataCountAll.procedure_offdlc, label: 'OFF DLC' },
    { value: DataCountAll.vascularDLC, label: 'ใส่ DLC' }
  ].map((item) => ({
    ...item,
    color: getRandomColor(),
  }));

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="หน้าหลัก" breadcrumbs={[{ label: "หน้าหลัก" }]} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Box sx={{ border: "2px solid", borderRadius: 4 }}>

          <ReportExportBox
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
          />

          <Grid container spacing={2}>
            {/**กราฟแท่งข้อมูลเฟศ*/}
            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                กราฟแท่ง ข้อมูลเพศชายและหญิง
              </Typography>
              <Box sx={{}}>
                <BarChart
                  height={300}
                  xAxis={[{ scaleType: 'band', data: xLabels_gender }]}
                  yAxis={[{ width: 50 }]}
                  series={[
                    {
                      data: seriesData_gender,
                      label: 'จำนวนผู้เข้ารับการรักษา',
                    }
                  ]}
                  colors={barColors_gender}
                />
              </Box>
            </Grid>

            {/**กราฟข้อมูลIPD OPD*/}
            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                กราฟวงกลม ข้อมูล IPD/OPD
              </Typography>
              <Box>
                <PieChart
                  series={[

                    {
                      data: pieDataCountIPDOPD,
                    },
                  ]}
                  width={200}
                  height={200}
                />
              </Box>
            </Grid>

            {/**กราฟวงกลมโดนัทข้อมูลคลินิกและโรงพยาบาล*/}
            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                กราฟวงกลม ข้อมูลคลินิกและโรงพยาบาล
              </Typography>
              <Box>
                <PieChart
                  series={[{
                    innerRadius: 50,
                    outerRadius: 100,
                    data: pieDataCountClinicandhospital
                  }]}
                  width={200}
                  height={200}
                />
              </Box>
            </Grid>

            {/**กราฟวงกลมโดนัทข้อมูลหัตการและ Vascular*/}
            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                กราฟแท่งข้อมูลหัตการและ Vascular
              </Typography>
              <Box>
                <PieChart
                  series={[{
                    innerRadius: 50,
                    outerRadius: 100,
                    data: pieDataCountProduceVascular
                  }]}
                  width={200}
                  height={200}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  )
}



