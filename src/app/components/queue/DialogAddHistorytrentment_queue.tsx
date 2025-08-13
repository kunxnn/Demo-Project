'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import * as React from 'react';

// ui shadcn 
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

//mui
import Textarea from '@mui/joy/Textarea';
import { Box, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// icons 
import { AlertTriangle, User } from "lucide-react"

//api fetch
import { fetchWard, fetchrespiration, fetchprocedure, fetchvascular, handleAddhistorytreatment } from "../../api/api_historytreatment"

//alert toast
import toast from 'react-hot-toast';

interface Ward {
    ward_id: number;
    ward_name: string;
}

interface respiration {
    id: number;
    name_respiration: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void
    queue_id: number
    bedNumber: number
}

interface procedure {
    id: number;
    name_procedure: string;
    status_bleed: number;
    status_LR: number;
    status_internalijulavein: number;
    status_doublelumen: number;
}

interface vascular {
    vascular_id: number;
    name_vascular: string;
    status_LR: number;
    status_doublelumen: number;
}


const statuses = ["CKD", "ESRD", "DM", "HT", "AKI"];
const hiddenWardNames = [
    "รพ สูงเม่น",
    "รพ เด่นชัย",
    "เมดแคร์",
    "รพแพร่ ไต 3",
    "รพ ร้องกวาง",
    "รพ คริสเตียน",
    "รพ แพร่ราม",
    "คลินิก พ.วุฒิกร"
];

export default function DialogAddHistorytreatment({ open, onClose, onSuccess, queue_id, bedNumber }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const [patient_id, setPatientId] = useState<number | null>(null);

    // State  ward 
    const [wardList, setWard] = useState<Ward[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>("");
    const [ipdopd, setIpdopd] = useState<string>("");

    //state respiration
    const [respirationList, setrespiration] = useState<respiration[]>([]);
    const [selectedrespiration, setSelectedrespiration] = useState<string>("");

    //state procedure
    const [procedureList, setrespirationprocedure] = useState<procedure[]>([]);
    const [selectedprocedure, setSelectedprocedure] = useState<string>("");

    //state vascular
    const [vascularList, setvascular] = useState<vascular[]>([]);
    const [selectedvascular, setSelectedvascular] = useState<string>("");

    // State สำหรับประเภทผู้ป่วย
    const [patient_type, setpatient_type] = useState<string[]>([]);



    // 🔁 Fetch ข้อมูลใหม่ทุกครั้งที่ modal เปิด
    useEffect(() => {
        if (open) {
            const patient_id = localStorage.getItem('patient_id');
            setPatientId(Number(patient_id));
            const loadward = async () => {
                try {
                    const data = await fetchWard();
                    setWard(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadrespiration = async () => {
                try {
                    const data = await fetchrespiration();
                    setrespiration(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadprocedure = async () => {
                try {
                    const data = await fetchprocedure();
                    setrespirationprocedure(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadvascular = async () => {
                try {
                    const data = await fetchvascular();
                    setvascular(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };

            loadward();
            loadrespiration();
            loadprocedure();
            loadvascular();
        }
    }, [open]);

    useEffect(() => {
        const wardName = wardList.find(w => String(w.ward_id) === selectedWard)?.ward_name;
        if (!wardName) return;
        if (hiddenWardNames.includes(wardName)) {
            setIpdopd("OPD");
        } else {
            setIpdopd("IPD");
        }
    }, [selectedWard]);

    // ค้นหาชื่อ ward ที่เลือกจาก wardList โดยใช้ ward_id
    const selectedWardName = wardList.find(w => String(w.ward_id) === selectedWard)?.ward_name;
    // ตรวจสอบว่าควรซ่อนหรือไม่
    const CheckwardwhenwardOPD = hiddenWardNames.includes(selectedWardName ?? "");

    //ดึงobject procedure ที่เลือกจาก procedureList
    const selected_object_procedure = procedureList.find(
        (p) => String(p.id) === selectedprocedure
    );

    //ดึงobject procedure ที่เลือกจาก vascularList
    const selected_object_vasculer = vascularList.find(
        (v) => String(v.vascular_id) === selectedvascular
    );



    {/*Reset radio เมื่อ select หัตการ เปลี่ยน */ }
    const [bleed, setBleed] = useState("");
    const [leftRight, setLeftRight] = useState("");
    const [internalVein, setInternalVein] = useState("");
    const [dblPerm, setDblPerm] = useState("");

    const [VascularBleed, setVascularBleed] = useState("");
    const [Vasculardoublelumen, setVasculardoublelumen] = useState("");

    const handleProcedureChange = (value: string) => {
        setSelectedprocedure(value);
        // Reset radio
        setBleed("");
        setLeftRight("");
        setInternalVein("");
        setDblPerm("");
    };

    const handlevascularchange = (value: string) => {
        setSelectedvascular(value);
        setVascularBleed(""); // Reset radio
        setVasculardoublelumen("");// Reset radio
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        if (!patient_id) {
            toast.error("ไม่พบผู้ใช้งาน"); //แก้ไม่ให้โค้ดแดงเฉยๆ
            return;
        }

        e.preventDefault();
        const result = await handleAddhistorytreatment(e, patient_id, queue_id);
        // console.log(result)
        if (result?.success) {
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset();
            onClose();
            setpatient_type([]);
            setBleed("");
            setLeftRight("");
            setInternalVein("");
            setDblPerm("");
            setIpdopd("");
            setSelectedWard("");
            setSelectedprocedure("");
            setSelectedrespiration("");
            setSelectedvascular("");
            onSuccess();
        } else {
            toast.error(result?.message);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" >
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">เพิ่มข้อมูลการรักษา</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* ข้อมูลพื้นฐาน */}
                    <Card>
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ประวัติการรักษา</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">

                                    {!CheckwardwhenwardOPD && (
                                        <>
                                            <Label htmlFor="AN" className="text-sm font-medium">
                                                หมายเลข AN<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="AN"
                                                name="AN"
                                                type="number"
                                                placeholder="กรอกหมายเลข AN"
                                                className="w-full"
                                            />
                                        </>
                                    )}


                                    <Label htmlFor="HN" className="text-sm font-medium">
                                        Bed<span className="text-red-500">*</span>
                                    </Label>
                                    <Input name="Bed" type="number" value={bedNumber} placeholder="กรอกหมายเลข Bed" className="w-full" readOnly />

                                    <Label className="text-sm font-medium">Ward</Label>
                                    <Select value={selectedWard.toString()} onValueChange={(value) => setSelectedWard(value)} name='Ward'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือก Ward" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            {wardList.map((ward) => (
                                                <SelectItem key={ward.ward_id} value={String(ward.ward_id)}>
                                                    {ward.ward_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Label className="text-sm font-medium">แพทย์</Label>
                                    <Select name='doctor'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือกแพทย์ที่ดูแล" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="นพ. วุฒิกร ศิริพลับพลา">นพ. วุฒิกร ศิริพลับพลา</SelectItem>
                                            <SelectItem value="พญ. ตติพร ทัศนาพิทักษ์">พญ. ตติพร ทัศนาพิทักษ์</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/*โรค*/}
                                <Card>
                                    <CardContent>
                                        <h3 className="font-medium text-sm text-gray-700 mb-4">ประเภทผู้ป่วย</h3>
                                        <div className="grid grid-cols-4 gap-4">
                                            {statuses.map((status) => (
                                                <div key={status} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`patient_type-${status}`}
                                                        name="ChronicDisease"
                                                        value={status}
                                                        checked={patient_type.includes(status)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setpatient_type((prev) => [...prev, status]);
                                                            } else {
                                                                setpatient_type((prev) => prev.filter((s) => s !== status));
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`patient_type-${status}`} className="text-sm font-medium">
                                                        {status}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/*วินิจฉัย*/}
                                <Label className="text-sm font-medium">วินิจฉัย</Label>
                                <Textarea color="neutral"
                                    disabled={false}
                                    minRows={2}
                                    placeholder="วินิจฉัย"
                                    size="sm"
                                    variant="outlined"
                                    name='diangnosis'
                                />

                                {/*Respiration*/}
                                <Label className="text-sm font-medium">Respiration</Label>
                                <Select value={selectedrespiration.toString()} onValueChange={(value) => setSelectedrespiration(value)} name='respiration'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือก Respiration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {respirationList.map((respiration) => (
                                            <SelectItem key={respiration.id} value={String(respiration.id)}>
                                                {respiration.name_respiration}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* หัตการ */}
                                <Box>
                                    <Label className="text-sm font-medium">หัตการ</Label>
                                    <Select value={selectedprocedure.toString()} onValueChange={handleProcedureChange} name='procedure_id'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือกหัตการ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {procedureList.map((procedure) => (
                                                <SelectItem key={procedure.id} value={String(procedure.id)}>
                                                    {procedure.name_procedure}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Box Bleed */}
                                    {selected_object_procedure?.status_bleed === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel>Bleed</FormLabel>
                                                <RadioGroup row name="bleed" onChange={(e) => setBleed(e.target.value)} value={bleed}>
                                                    <FormControlLabel value="Bleed" control={<Radio />} label="Bleed" />
                                                    <FormControlLabel value="Nobleed" control={<Radio />} label="Nobleed" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}

                                    {/* Box Left/Right */}
                                    {selected_object_procedure?.status_LR === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel>Left/Right</FormLabel>
                                                <RadioGroup row name="LeftRight" onChange={(e) => setLeftRight(e.target.value)} value={leftRight}>
                                                    <FormControlLabel value="Left" control={<Radio />} label="Left" />
                                                    <FormControlLabel value="Right" control={<Radio />} label="Right" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}

                                    {/* Box IJFemeral */}
                                    {selected_object_procedure?.status_internalijulavein === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel>internalijulavein</FormLabel>
                                                <RadioGroup row name="internalijulavein" onChange={(e) => setInternalVein(e.target.value)} value={internalVein}>
                                                    <FormControlLabel value="IJ" control={<Radio />} label="IJ" />
                                                    <FormControlLabel value="Femeral" control={<Radio />} label="Femeral" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}

                                    {/* Box doublelumen */}
                                    {selected_object_procedure?.status_doublelumen === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel id="demo-row-radio-buttons-group-label">doublelumen</FormLabel>
                                                <RadioGroup row name="DBLPerm" onChange={(e) => setDblPerm(e.target.value)} value={dblPerm}>
                                                    <FormControlLabel value="DBL" control={<Radio />} label="DBL" />
                                                    <FormControlLabel value="Perm" control={<Radio />} label="Perm" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}
                                </Box>

                                {/*vascular*/}
                                <Box>
                                    <Label className="text-sm font-medium">Vascular</Label>
                                    <Select value={selectedvascular.toString()} onValueChange={handlevascularchange} name='vascular_id_sides' >
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือก Vascular" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vascularList.map((procedure) => (
                                                <SelectItem key={procedure.vascular_id} value={String(procedure.vascular_id)}>
                                                    {procedure.name_vascular}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selected_object_vasculer?.status_LR === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel>Left/Right</FormLabel>
                                                <RadioGroup row name="side_name" onChange={(e) => setVascularBleed(e.target.value)} value={VascularBleed}>
                                                    <FormControlLabel value="Left" control={<Radio />} label="Left" />
                                                    <FormControlLabel value="Right" control={<Radio />} label="Right" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}

                                    {/* Box doublelumen */}
                                    {selected_object_vasculer?.status_doublelumen === 1 && (
                                        <Box>
                                            <FormControl>
                                                <FormLabel>doublelumen</FormLabel>
                                                <RadioGroup row name="suboption_name" onChange={(e) => setVasculardoublelumen(e.target.value)} value={Vasculardoublelumen}>
                                                    <FormControlLabel value="DBL" control={<Radio />} label="DBL" />
                                                    <FormControlLabel value="Perm" control={<Radio />} label="Perm" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    )}
                                </Box>

                                <RadioGroup
                                    row
                                    name="typehistorytreatment"
                                    value={ipdopd}
                                    onChange={(e) => setIpdopd(e.target.value)}

                                >
                                    <FormControlLabel value="IPD" control={<Radio />} label="IPD" />
                                    <FormControlLabel value="OPD" control={<Radio />} label="OPD" />
                                </RadioGroup>

                                <Label className="text-sm font-medium">วันที่ลงทะเบียน</Label>
                                <Input name="registerdate" type="date" className="w-full" />
                                {/* <TextField  variant="standard" name="registerdate" type='date'/> */}
                            </div>
                        </CardContent>
                    </Card>

                    <DialogFooter className="gap-2">
                        <Button type="submit" variant="outline">
                            บันทึกข้อมูล
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
