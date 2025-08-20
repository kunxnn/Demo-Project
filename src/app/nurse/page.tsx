'use client';
import React, { useEffect, useState } from 'react';

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
import DialogAddNurse from "../components/DialogAddNurse"
import EditDialogNurse from "../components/EditDialogNurse"


//api
import { fetchGetdataNurse, handleDelete } from "../api/api_dialog_nurse"


export default function HomePage() {

    interface Nurse {
        nurse_id: number;
        nurse_code: number;
        nurse_title: string;
        nurse_fname: string;
        nurse_lname: string;
        nurse_username: string;
        type: string;
    }

    const [open, setOpen] = useState(false)
    const [DataNurse, setDataNurse] = useState<Nurse[]>([]);

    const [selectedNurseid, setSelectedNurseid] = useState<number | null>(null);

    useEffect(() => {
        const getNurse = async () => {
            try {
                const data = await fetchGetdataNurse();
                setDataNurse(data);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลพยาบาล", error);
            }
        };
        getNurse();
        const intervalId = setInterval(getNurse, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //         const { name, value } = e.target;
    //         setdatapatient((prev: any) => ({ ...prev, [name]: value }));
    // };

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader
                title=""
                breadcrumbs={[
                    { label: "หน้าหลัก", href: "/patient" },
                    { label: "จัดการข้อมูลพยาบาล" }
                ]}
            />
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card className="col-span-4">

                    <CardHeader>
                        <CardTitle className="text-center text-4xl font-bold">
                            การจัดการพยาบาล
                        </CardTitle>
                        <div>
                            <Button variant="outlined" onClick={() => setOpen(true)}>เพิ่มข้อมูลพยาบาล </Button>
                            <DialogAddNurse open={open} onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
                        </div>

                    </CardHeader>
                    <CardContent>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>รหัสประตัว</TableCell>
                                    <TableCell>ชื่อ-นาสกุล</TableCell>
                                    <TableCell>ผู้ใช้งาน</TableCell>
                                    <TableCell>สิทธิ์</TableCell>
                                    <TableCell>การจัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {DataNurse.map((n, index) => (
                                    <TableRow key={n.nurse_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{n.nurse_code}</TableCell>
                                        <TableCell>{n.nurse_title + " " + n.nurse_fname + " " + n.nurse_lname}</TableCell>
                                        <TableCell>{n.nurse_username}</TableCell>
                                        <TableCell>{n.type}</TableCell>

                                        <TableCell>
                                            <IconButton
                                                color="warning"
                                                onClick={() => {
                                                    setSelectedNurseid(n.nurse_id);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(n.nurse_id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {selectedNurseid && (
                    <EditDialogNurse
                        open={true}
                        onClose={() => setSelectedNurseid(null)}
                        onSuccess={() => setSelectedNurseid(null)}
                        nurseID={selectedNurseid}
                    />
                )}

            </div>
        </div>
    )
}



