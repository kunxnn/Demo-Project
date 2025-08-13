'use client';
import React, { useEffect, useState } from 'react';

//mui
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';

//ui shadcn components
import { PageHeader } from "../../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//icon
import Button from '@mui/material/Button';
import { Delete, Edit, Folder, MedicalServices } from "@mui/icons-material"

//components
import DialogAddHistorytreatment from "../../components/DialogHistorytrentment"
import EditDialogHistorytreatment from "../../components/EditDialogHistorytreatment"

//api
import { fetchGetdatahistory, handleDelete } from "../../api/api_historytreatment"

interface histoytreatment {
  history_id: number;
  AN: number;
  ward_name: string;
  Bed: string;
  doctor: string;
  ChronicDisease: string;
  diangnosis: string;
  name_respiration: string;
  typehistorytreatment: string;
  registerdate: string;
  name_procedure: string;
  bleed: string;
  LeftRight: string;
  internalijulavein: string;
  name_vascular: string;
  DBLPerm: string;
  side_name: string;
  suboption_name: string;
}

export default function historytreatment() {

  const [patient_id, setPatientId] = useState<number | null>(null);
  const [Selectedhistorytreatment, setSelectedhistorytreatment] = useState<number | null>(null);
  const [open, setOpen] = useState(false)
  const [datahistoytreatment, setdatadatahistoytreatment] = useState<histoytreatment[]>([]);


  useEffect(() => {
    const patient_id = localStorage.getItem('patient_id');
    const patient_id_number = Number(patient_id);
    setPatientId(patient_id_number);

    const Getdatahistory = async () => {
      try {
        const data = await fetchGetdatahistory(patient_id_number);
        setdatadatahistoytreatment(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", error);
      }
    };
    Getdatahistory();
    const intervalId = setInterval(Getdatahistory, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="หน้าหลัก" breadcrumbs={[{ label: "หน้าหลัก" }]} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

        <Card className="col-span-4">

          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold">
              ประวัติการรักษา
            </CardTitle>

            <div>
              <Button variant="outlined" onClick={() => setOpen(true)}>เพิ่มประวัติการรักษา</Button>
              <DialogAddHistorytreatment open={open} onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
            </div>

          </CardHeader>
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>AN</TableCell>
                  <TableCell>Ward</TableCell>
                  <TableCell>Bed</TableCell>
                  <TableCell>แพทย์</TableCell>
                  <TableCell>โรคประจำตัว</TableCell>
                  <TableCell>การวินิจฉัย</TableCell>
                  <TableCell>Respiration</TableCell>
                  <TableCell>หัตการ</TableCell>
                  <TableCell>Bleed</TableCell>
                  <TableCell>LeftRight</TableCell>
                  <TableCell>Internalijulavein</TableCell>
                  <TableCell>DBLPerm</TableCell>
                  <TableCell>Vascular</TableCell>
                  <TableCell>ข้าง</TableCell>
                  <TableCell>ชนิด</TableCell>
                  <TableCell>วันที่ลงทะเบียน</TableCell>
                  <TableCell>การจัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datahistoytreatment.map((p, index) => (
                  <TableRow key={p.history_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.AN}</TableCell>
                    <TableCell>{p.ward_name}</TableCell>
                    <TableCell>{p.Bed}</TableCell>
                    <TableCell>{p.doctor}</TableCell>
                    <TableCell>{p.ChronicDisease}</TableCell>
                    <TableCell>{p.diangnosis}</TableCell>
                    <TableCell>{p.name_respiration}</TableCell>
                    <TableCell>{p.name_procedure}</TableCell>
                    <TableCell>{p.bleed}</TableCell>
                    <TableCell>{p.LeftRight}</TableCell>
                    <TableCell>{p.internalijulavein}</TableCell>
                    <TableCell>{p.DBLPerm}</TableCell>
                    <TableCell>{p.name_vascular}</TableCell>
                    <TableCell>{p.side_name}</TableCell>
                    <TableCell>{p.suboption_name}</TableCell>
                    <TableCell>{new Date(p.registerdate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setSelectedhistorytreatment(p.history_id);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(p.history_id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>


        {Selectedhistorytreatment && (
          <EditDialogHistorytreatment
            open={true}
            onClose={() => setSelectedhistorytreatment(null)}
            onSuccess={() => setSelectedhistorytreatment(null)}
            history_id={Selectedhistorytreatment}
          />
        )}

      </div>
    </div>
  )
}



