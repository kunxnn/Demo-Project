'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//mui
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Tooltip, Typography, Box, TableContainer , Stack } from '@mui/material';

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
      value: "1,234", // จำนวนผู้ป่วยทั้งหมดในระบบ
      description: "เพิ่มขึ้น 12% จากเดือนที่แล้ว",
      icon: Users,
      color: "#42a5f5",
    },
    {
      title: "ผู้ป่วยที่นัดหมายวันนี้",
      value: "23", // จำนวนผู้ป่วยที่มีคิววันนี้
      description: "รวมผู้ป่วยใหม่และเดิม",
      icon: Calendar,
      color: "#66bb6a",
    },
    {
      title: "ผู้ป่วยใหม่เดือนนี้",
      value: "89", // ผู้ป่วยที่เพิ่มใหม่ในเดือนนี้
      description: "ลงทะเบียนในระบบเดือนนี้",
      icon: FileText,
      color: "#ffa726",
    },
    {
      title: "ผู้ป่วย IPD / OPD วันนี้",
      value: "IPD: 12 | OPD: 45", // แยกประเภทผู้ป่วยในวันนี้
      description: "จำนวนผู้ป่วยแยกตาม IPD และ OPD",
      icon: Activity,
      color: "#ef5350",
    },
  ];


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

      <PageHeader
        title=""
        breadcrumbs={[
          { label: "หน้าหลัก", href: "/patient" },
          { label: "จัดการข้อมูลผู้ป่วย" }
        ]}
      />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Box
                  sx={{
                    bgcolor: stat.color,
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  <stat.icon size={16} />
                </Box>
              </CardHeader>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
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

            <TableContainer sx={{ overflowX: 'auto' }}>
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
                      <TableCell>
                        {p.patient_health === "Alert pre Arrest" ? (
                          <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {p.patient_title} {p.patient_firstname} {p.patient_lastname}
                            <Tooltip title={p.patient_health} arrow>
                              <WarningOutlined fontSize="small" />
                            </Tooltip>
                          </Typography>
                        ) : (
                          `${p.patient_title} ${p.patient_firstname} ${p.patient_lastname}`
                        )}
                      </TableCell>
                      <TableCell>{p.patient_age}</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {p.patient_address} ต.{p.subdistrict_name} อ.{p.district_name} จ.{p.province_name} {p.zipcode}
                      </TableCell>
                      <TableCell>{p.name_sis}</TableCell>
                      <TableCell>{p.patient_type}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="แฟ้มข้อมูล">
                            <IconButton color='primary'><Folder /></IconButton>
                          </Tooltip>
                          <Tooltip title="ประวัติการรักษา">
                            <IconButton
                              color='primary'
                              onClick={() => {
                                localStorage.setItem('patient_id', p.patient_id.toString());
                                router.push('/patient/historytreatment');
                              }}
                            >
                              <MedicalServices />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="แก้ไขข้อมูลผู้ป่วย">
                            <IconButton color="warning" onClick={() => setSelectedPatientId(p.patient_id)}><Edit /></IconButton>
                          </Tooltip>
                          <Tooltip title="ลบผู้ป่วย">
                            <IconButton color="error" onClick={() => handleDelete(p.patient_id)}><Delete /></IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
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



