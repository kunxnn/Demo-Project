'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//mui
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Tooltip, Typography } from '@mui/material';

//ui shadcn components
import { PageHeader } from "../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//icon
import { Activity, Users, FileText, Calendar } from "lucide-react"
import Button from '@mui/material/Button';
import { Delete, Edit, Folder, MedicalServices, WarningOutlined } from "@mui/icons-material"

//components
import DialogAddpatient from "../components/DialogAddpatient"
import EditDialogpatient from "../components/EditDialogpatient"

//api
import { fetchGetdataPetient, handleDelete } from "../api/api_patient"

import { encryptStorage } from '@/util/encryptStorage';

export default function HomePage() {
  
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

  interface patients {
    patient_id: number;
    patient_HN: string;
    patient_title: string;
    patient_firstname: string;
    patient_lastname: string;
    patient_age: string;
    patient_address: string;
    subdistrict_name: string;
    district_name: string;
    province_name: string;
    zipcode: number;
    name_sis: string;
    patient_type: string;
    patient_health: string;
  }


  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [patients, setPatients] = useState<patients[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchGetdataPetient();
        setPatients(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", error);
      }
    };

    getPatients();

    const intervalId = setInterval(getPatients, 1000);
    return () => clearInterval(intervalId);
  }, []);


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

        <Card className="col-span-4">

          <CardHeader>
            <CardTitle>ผู้ป่วยทั้งหมด</CardTitle>
            <div>
              <Button variant="outlined" onClick={() => setOpen(true)}>เพิ่มผู้ป่วย </Button>
              <DialogAddpatient open={open} onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
            </div>
          </CardHeader>
          <CardContent>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>HN</TableCell>
                  <TableCell>ชื่อ-นาสกุล</TableCell>
                  <TableCell>อายุ</TableCell>
                  <TableCell>ที่อยู่</TableCell>
                  <TableCell>สิทธิ์</TableCell>
                  <TableCell>ประเภท</TableCell>
                  <TableCell>การจัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((p, index) => (
                  <TableRow key={p.patient_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.patient_HN}</TableCell>
                    {p.patient_health === "Alert pre Arrest" ? (
                      <TableCell >
                        <Typography sx={{ color: 'red' }}>
                          {p.patient_title + " " + p.patient_firstname + " " + p.patient_lastname}
                          <Tooltip title={p.patient_health} arrow>
                            < WarningOutlined />
                          </Tooltip>
                        </Typography>

                      </TableCell>

                    ) : (
                      <TableCell>
                        {p.patient_title} {p.patient_firstname} {p.patient_lastname}
                      </TableCell>
                    )}
                    <TableCell>{p.patient_age}</TableCell>
                    <TableCell>{p.patient_address} ต.{p.subdistrict_name} อ.{p.district_name} จ.{p.province_name} {p.zipcode} </TableCell>
                    <TableCell>{p.name_sis}</TableCell>
                    <TableCell>{p.patient_type}</TableCell>
                    <TableCell>
                      <IconButton color='primary'>
                        <Folder />
                      </IconButton>

                        <IconButton
                          color='primary'
                          onClick={() => {
                            localStorage.setItem('patient_id', p.patient_id.toString());
                            router.push('/patient/historytreatment');
                          }}
                        >
                          <MedicalServices />
                        </IconButton>

                      <IconButton
                        color="warning"
                        onClick={() => {
                          setSelectedPatientId(p.patient_id);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(p.patient_id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedPatientId && (
          <EditDialogpatient
            open={true}
            onClose={() => setSelectedPatientId(null)}
            onSuccess={() => setSelectedPatientId(null)}
            patientId={selectedPatientId}
          />
        )}

      </div>
    </div>
  )
}



