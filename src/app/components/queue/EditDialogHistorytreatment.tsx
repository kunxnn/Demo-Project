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
import { Box } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// icons 
import { AlertTriangle, User } from "lucide-react"

//api fetch
import { fetchWard, fetchrespiration, fetchprocedure, fetchvascular, fetchhistoryById, handleupdatehistorytreatment, } from "../../api/api_historytreatment"


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
    history_id: number
    queue_id: number
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

export default function EditDialogHistorytreatment({ open, onClose, onSuccess, queue_id, history_id }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [datahistoytreatment, setdatahistoytreatment] = useState<any>(null); //datahistory from database

    const [AN, setAN] = useState(''); // State  AN
    const [Bed, setBed] = useState(''); // State  Bed
    const [doctor, setDoctor] = useState(''); //state doctor
    const [wardList, setWardList] = useState<Ward[]>([]); // State  wardList

    const [selectedWard, setSelectedWard] = useState<string | number>('');

    const [ipdopd, setIpdopd] = useState<string>("");

    const [respirationList, setrespirationList] = useState<respiration[]>([]);  //state respirationList
    const [selectedrespiration, setSelectedrespiration] = useState<string | number>('');

    const [procedureList, setprocedureList] = useState<procedure[]>([]); //state procedureList
    const [selectedprocedure, setSelectedprocedure] = useState<string>('');

    {/*Reset radio เมื่อ select หัตการ เปลี่ยน */ }
    const [bleed, setBleed] = useState("");
    const [leftRight, setLeftRight] = useState("");
    const [internalVein, setInternalVein] = useState("");
    const [dblPerm, setDblPerm] = useState("");

    const [vascularList, setvascularList] = useState<vascular[]>([]);  //state vascularList
    const [selectedvascular, setSelectedvascular] = useState<string>('');
    const [VascularBleed, setVascularBleed] = useState("");
    const [Vasculardoublelumen, setVasculardoublelumen] = useState("");

    const [diagnosis, setDiagnosis] = useState('');
    const [patient_type, setpatient_type] = useState<string[]>([]); // State สำหรับประเภทผู้ป่วย
    const [registerDate, setRegisterDate] = useState(''); //state regsiterdate



    useEffect(() => {
        if (open && history_id) {
            fetchhistoryById(history_id).then(async (data) => {
                if (data) {
                    setdatahistoytreatment(data);
                    setAN(data.AN || '');
                    setBed(data.Bed || '');
                    setDoctor(data.doctor || '');
                    setpatient_type(data.ChronicDisease?.split(',') || []);
                    setDiagnosis(data.diangnosis || '');
                    setBleed(data.bleed || '');
                    setLeftRight(data.LeftRight || '');
                    setInternalVein(data.internalijulavein || '');
                    setDblPerm(data.DBLPerm || '');
                    setSelectedvascular(data.vascular_id || '');
                    setIpdopd(data.typehistorytreatment || '');
                    setRegisterDate(data.registerdate?.split('T')[0] || '');
                }
            });

            const loadward = async () => {
                try {
                    const data = await fetchWard();
                    setWardList(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadrespiration = async () => {
                try {
                    const data = await fetchrespiration();
                    setrespirationList(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadprocedure = async () => {
                try {
                    const data = await fetchprocedure();
                    setprocedureList(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            const loadvascular = async () => {
                try {
                    const data = await fetchvascular();
                    setvascularList(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            loadward();
            loadrespiration();
            loadprocedure();
            loadvascular();
        }
    }, [open, history_id]);

    useEffect(() => {
        if (wardList.length > 0 && datahistoytreatment?.Ward) {
            setSelectedWard(String(datahistoytreatment.Ward));
        }

        if (respirationList.length > 0 && datahistoytreatment?.respiration) {
            setSelectedrespiration(String(datahistoytreatment.respiration))
        }

        if (procedureList.length > 0 && datahistoytreatment?.procedure_id) {
            setSelectedprocedure(String(datahistoytreatment.procedure_id))
        }

        if (vascularList.length > 0 && datahistoytreatment?.vascular_id) {
            setSelectedvascular(String(datahistoytreatment.vascular_id))
            setVascularBleed(datahistoytreatment.side_name);
            setVasculardoublelumen(datahistoytreatment.suboption_name);
        }
    }, [datahistoytreatment]);

    useEffect(() => {
        const wardName = wardList.find(w => String(w.ward_id) === selectedWard)?.ward_name;
        if (!wardName) return;
        if (hiddenWardNames.includes(wardName)) {
            setIpdopd("OPD");
        } else {
            setIpdopd("IPD");
        }
    }, [selectedWard]);


    const selectedWardName = wardList.find(w => String(w.ward_id) === selectedWard)?.ward_name; // ค้นหาชื่อ ward ที่เลือกจาก wardList โดยใช้ ward_id
    const CheckwardwhenwardOPD = hiddenWardNames.includes(selectedWardName ?? ""); // ตรวจสอบว่าควรซ่อนหรือไม่


    const selected_object_procedure = procedureList.find(  //ดึงobject procedure ที่เลือกจาก procedureList
        (p) => String(p.id) === selectedprocedure
    );
    const selected_object_vasculer = vascularList.find(  //ดึงobject procedure ที่เลือกจาก vascularList
        (v) => String(v.vascular_id) === selectedvascular
    );

    const handleProcedureChange = (value: string) => {
        setSelectedprocedure(value);
        setBleed(""); // Reset radio 
        setLeftRight(""); // Reset radio 
        setInternalVein(""); // Reset radio 
        setDblPerm(""); // Reset radio 
    };

    const handlevascularchange = (value: string) => {
        setSelectedvascular(value);
        setVascularBleed(""); // Reset radio
        setVasculardoublelumen("");// Reset radio
    };

    const handleupdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!history_id) {
            toast.error("ไม่พบผู้ใช้งาน"); //แก้ไม่ให้โค้ดแดงเฉยๆ
            return;
        }

        const result = await handleupdatehistorytreatment(e, history_id);
        if (result?.success) { //ถ้า result ไม่เป็น null หรือ undefined และ result.success เป็น true ให้เข้าบล็อกนี้
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset();
            onSuccess();
            onClose();
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
                    <DialogTitle className="text-xl font-semibold">แก้ไขการรักษาของผู้ป่วย</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleupdate}>

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
                                                value={AN}
                                                onChange={(e) => setAN(e.target.value)}
                                            />
                                        </>
                                    )}


                                    <Label htmlFor="HN" className="text-sm font-medium">
                                        Bed<span className="text-red-500">*</span>
                                    </Label>
                                    <Input name="Bed" type="number" placeholder="กรอกหมายเลข Bed" value={Bed} onChange={(e) => setBed(e.target.value)} className="w-full" />

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
                                    <Select name='doctor' value={doctor.toString()} onValueChange={(value) => setDoctor(value)}>
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
                                <Textarea
                                    color="neutral"
                                    disabled={false}
                                    minRows={2}
                                    placeholder="วินิจฉัย"
                                    size="sm"
                                    variant="outlined"
                                    name="diangnosis"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />

                                {/*Respiration*/}
                                <Label className="text-sm font-medium">Respiration</Label>
                                <Select name='respiration' value={selectedrespiration.toString()} onValueChange={(value) => setSelectedrespiration(value)}>
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
                                    <Select name='vascular_id_sides' value={selectedvascular.toString()} onValueChange={handlevascularchange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือก Vascular" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vascularList.map((vascular) => (
                                                <SelectItem key={vascular.vascular_id} value={String(vascular.vascular_id)}>
                                                    {vascular.name_vascular}
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
                                <Input name="registerdate" type="date" value={registerDate} onChange={(e) => setRegisterDate(e.target.value)} className="w-full" />
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
