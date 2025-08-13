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
import { Separator } from "@/components/ui/separator"
// icons 
import { AlertTriangle, User } from "lucide-react"

//api fetch
import { fetchSis, getProvinces, getDistricts, getSubdistricts, getZipcode, handleAddPatient } from "../api/api_dialog_addpatient"

//mui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

//alert toast
import toast from 'react-hot-toast';

interface Sis {
    sis_id: number;
    name_sis: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void
}


const statuses = ["ผู้ป่วยใหม่", "ผู้ป่วยเก่า", "Chronic", "Acute"];

export default function DialogAddpatient({ open, onClose, onSuccess }: Props) {
    const [sisList, setSisList] = useState<Sis[]>([]);
    const [selectedSis, setSelectedSis] = useState<string | number>('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedSubdistrict, setSelectedSubdistrict] = useState<number | null>(null);
    const [zipcode, setZipcode] = useState('');

    const [patient_type, setpatient_type] = useState<string[]>([]);

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleAddPatient(e);

        if (result?.success) { //ถ้า result ไม่เป็น null หรือ undefined และ result.success เป็น true ให้เข้าบล็อกนี้
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset(); //รีเซตฟอร์มที่ส่งเข้ามา
            setValue(''); // รีเซต radio เพศ (ถ้าต้องการค่าเริ่มต้นอื่น กำหนดใหม่)
            setSelectedSis('');
            setpatient_type([]);
            setZipcode('');
            setSelectedProvince(null);
            setSelectedDistrict(null);
            setSelectedSubdistrict(null);
            onClose();
        } else {
            toast.error(result?.message);
        }
    };

    // 🔁 Fetch ข้อมูลใหม่ทุกครั้งที่ modal เปิด
    useEffect(() => {
        if (open) {
            const loadSis = async () => {
                try {
                    const data = await fetchSis();
                    setSisList(data);
                } catch (err) {
                    console.error('Error fetching sis:', err);
                }
            };
            loadSis();
        }
    }, [open]); // ← trigger ทุกครั้งที่ open เปลี่ยน

    useEffect(() => {
        getProvinces().then(setProvinces);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            getDistricts(selectedProvince).then(data => {
                setDistricts(data);
                setSelectedDistrict(null);
                setSubdistricts([]);
                setZipcode('');
            });
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            getSubdistricts(selectedDistrict).then(data => {
                setSubdistricts(data);
                setSelectedSubdistrict(null);
                setZipcode('');
            });
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedSubdistrict) {
            getZipcode(selectedSubdistrict).then(setZipcode);
        }
    }, [selectedSubdistrict]);

    const [value, setValue] = React.useState('female');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };


    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" >
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">เพิ่มข้อมูลผู้ป่วย</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* ข้อมูลพื้นฐาน */}
                    <Card>
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ข้อมูลพื้นฐาน</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="HN" className="text-sm font-medium">
                                        หมายเลข HN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="HN" name="patient_HN" type="number" placeholder="กรอกหมายเลข HN" className="w-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">คำนำหน้า</Label>
                                        <Select name='patient_title'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกคำนำหน้า" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="นาย">นาย</SelectItem>
                                                <SelectItem value="นาง">นาง</SelectItem>
                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                                <SelectItem value="เด็กชาย">เด็กชาย</SelectItem>
                                                <SelectItem value="เด็กหญิง">เด็กหญิง</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            ชื่อ <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="patient_firstname" type="text" placeholder="กรอกชื่อ" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            นามสกุล <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="patient_lastname" type="text" placeholder="กรอกนามสกุล" required />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="yearold" className="text-sm font-medium">
                                        อายุ
                                    </Label>
                                    <Input name="patient_age" type="number" placeholder="กรอกอายุ" className="w-32" required />
                                </div>

                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">เพศ</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="patient_gender"
                                        value={value}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="ชาย" control={<Radio />} label="ชาย" />
                                        <FormControlLabel value="หญิง" control={<Radio />} label="หญิง" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ที่อยู่ */}
                    <Card>
                        <CardContent >
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ที่อยู่</h3>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="grid gap-2">
                                        <Input name="patient_address" type="text" placeholder="ที่อยู่" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">จังหวัด</Label>
                                        <Select onValueChange={(value) => setSelectedProvince(Number(value))} name='province_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกจังหวัด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {provinces.map((p: any) => (
                                                    <SelectItem key={p.province_id} value={String(p.province_id)}>{p.name_th}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">อำเภอ/เขต</Label>
                                        <Select onValueChange={(value) => setSelectedDistrict(Number(value))} name='district_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="อำเภอ/เขต" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((d: any) => (
                                                    <SelectItem key={d.district_id} value={String(d.district_id)}>{d.name_th}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">ตำบล/แขวง</Label>
                                        <Select onValueChange={(value) => setSelectedSubdistrict(Number(value))} name='subdistrict_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="ตำบล/แขวง" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subdistricts.map((s: any) => (
                                                    <SelectItem key={s.subdistrict_id} value={String(s.subdistrict_id)}>{s.name_th}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            รหัสไปรษณีย์
                                        </Label>
                                        <Input name="patient_zipcode" type="number" placeholder="รหัสไปรษณีย์" readOnly className="bg-gray-50" value={zipcode || ''} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* สิทธิ์การรักษา */}
                    <Card>
                        <CardContent >
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">สิทธิ์การรักษา</Label>
                                <Select value={selectedSis.toString()} onValueChange={(value) => setSelectedSis(value)} name='patient_sis'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="สิทธิ์" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sisList.map((sis) => (
                                            <SelectItem key={sis.sis_id} value={String(sis.sis_id)}>
                                                {sis.name_sis}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ประเภทผู้ป่วย */}
                    <Card>
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ประเภทผู้ป่วย</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {statuses.map((status) => (
                                    <div key={status} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`patient_type-${status}`}
                                            name="patient_type"
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

                    {/* Alert Pre-Arrest */}
                    <Card className="border-red-200 bg-red-50/30">
                        <CardContent >
                            <div className="flex items-center space-x-3">
                                <Checkbox name='patient_health' value="Alert pre Arrest" className="border-red-500 data-[state=checked]:bg-red-500" />
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <Label className="text-sm font-semibold text-red-600 ">
                                        Alert pre Arrest
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    <Separator />
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">
                                อ่านบัตรประชาชน
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="outline">
                            บันทึกข้อมูล
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
