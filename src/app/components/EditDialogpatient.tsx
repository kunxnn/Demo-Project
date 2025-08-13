'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// UI shadcn
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// icons
import { AlertTriangle, User } from "lucide-react";

// MUI
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// API functions
import { handleEditUser, fetchUserById } from '../api/api_patient';
import { fetchSis, getProvinces, getDistricts, getSubdistricts, getZipcode, handleAddPatient } from "../api/api_dialog_addpatient"

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: number;

}

interface Sis {
    sis_id: number;
    name_sis: string;
}


const statuses = ["ผู้ป่วยใหม่", "ผู้ป่วยเก่า", "Chronic", "Acute"];

export default function EditDialogpatient({ open, onClose, onSuccess, patientId }: Props) {
    const [datapatient, setdatapatient] = useState<any>(null);


    // สถานะควบคุมอื่นๆ เช่น สิทธิ์, ที่อยู่, เพศ, ประเภทผู้ป่วย
    const [sisList, setSisList] = useState<Sis[]>([]);
    const [selectedSis, setSelectedSis] = useState<string | number>('');
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [subdistricts, setSubdistricts] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedSubdistrict, setSelectedSubdistrict] = useState<number | null>(null);
    const [zipcode, setZipcode] = useState('');

    const [patient_type, setPatient_type] = useState<string[]>([]);

    const [gender, setGender] = useState<string>('หญิง');


    useEffect(() => {
        if (open && patientId) {
            fetchUserById(patientId).then(async (data) => {
                if (data) {
                    // console.log(data);
                    console.log(data);
                    setdatapatient(data);
                    setSelectedSis(String(data.patient_sis || ''));
                    setSelectedProvince(data.province_id || null);

                    // โหลด districts ตาม province ก่อน
                    if (data.province_id) {
                        const districtsData = await getDistricts(data.province_id);
                        setDistricts(districtsData);
                    }
                    setSelectedDistrict(data.district_id || null);

                    // โหลด subdistricts ตาม district ก่อน
                    if (data.district_id) {
                        const subdistrictsData = await getSubdistricts(data.district_id);
                        setSubdistricts(subdistrictsData);
                    }
                    setSelectedDistrict(data.district_id || null);
                    setSelectedSubdistrict(data.subdistrict_id || null);
                    setZipcode(data.patient_zipcode || '');
                    setGender(data.patient_gender || 'หญิง');
                    setPatient_type(
                        typeof data.patient_type === "string"
                            ? data.patient_type.split(",")
                            : Array.isArray(data.patient_type)
                                ? data.patient_type
                                : []
                    );
                }
            });
            // โหลดจังหวัด หรือเอา API อื่นมาแทน (สมมติฟังก์ชัน getProvinces() อยู่แล้ว)
            getProvinces().then(setProvinces);

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
    }, [open, patientId]);

    // โหลดอำเภอ เมื่อจังหวัดเปลี่ยน
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

    // โหลดตำบล เมื่ออำเภอเปลี่ยน
    useEffect(() => {
        if (selectedDistrict) {
            getSubdistricts(selectedDistrict).then(data => {
                setSubdistricts(data);
                setSelectedSubdistrict(null);
                setZipcode('');
            });
        }
    }, [selectedDistrict]);

    // โหลด zipcode เมื่อ ตำบลเปลี่ยน
    useEffect(() => {
        if (selectedSubdistrict) {
            getZipcode(selectedSubdistrict).then(setZipcode);
        }
    }, [selectedSubdistrict]);

    // ฟังก์ชันจัดการการเปลี่ยนแปลง input ทุกชนิด
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setdatapatient((prev: any) => ({ ...prev, [name]: value }));
    };


    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGender(e.target.value);
        setdatapatient((prev: any) => ({ ...prev, patient_gender: e.target.value }));
    };

    const handlePatientTypeChange = (status: string, checked: boolean) => {
        let newTypes = [...patient_type];
        if (checked) {
            if (!newTypes.includes(status)) newTypes.push(status);
        } else {
            newTypes = newTypes.filter(s => s !== status);
        }
        setPatient_type(newTypes);
        setdatapatient((prev: any) => ({ ...prev, patient_type: newTypes }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!datapatient) return;

        const data = {
            ...datapatient,
            patient_sis: Number(selectedSis),
            province_id: selectedProvince,
            district_id: selectedDistrict,
            subdistrict_id: selectedSubdistrict,
            patient_type: patient_type,
            patient_gender: gender,
            patient_zipcode: zipcode,
        };

        const result = await handleEditUser(data);
        if (result?.ok && result.code === 201) {
            toast.success(result.message);
            onSuccess();
            onClose();
        } else {
            toast.error(result.message);
        }
    };


    // --- ถ้าข้อมูลยังไม่โหลด อย่าแสดง dialog ---
    if (!datapatient) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">แก้ไขข้อมูลผู้ป่วย</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* ตัวอย่างข้อมูลพื้นฐาน */}
                    <Card>
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ข้อมูลพื้นฐาน</h3>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="HN" className="text-sm font-medium">
                                        หมายเลข HN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="HN"
                                        name="patient_HN"
                                        type="number"
                                        placeholder="กรอกหมายเลข HN"
                                        className="w-full"
                                        value={datapatient.patient_HN || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">คำนำหน้า</Label>
                                        <Select
                                            name="patient_title"
                                            value={datapatient.patient_title || ''}
                                            onValueChange={val =>
                                                setdatapatient((prev: any) => ({ ...prev, patient_title: val }))
                                            }
                                        >
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
                                        <Input
                                            name="patient_firstname"
                                            type="text"
                                            placeholder="กรอกชื่อ"
                                            value={datapatient.patient_firstname || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            นามสกุล <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            name="patient_lastname"
                                            type="text"
                                            placeholder="กรอกนามสกุล"
                                            value={datapatient.patient_lastname || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="yearold" className="text-sm font-medium">
                                        อายุ
                                    </Label>
                                    <Input
                                        name="patient_age"
                                        type="number"
                                        placeholder="กรอกอายุ"
                                        className="w-32"
                                        value={datapatient.patient_age || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <FormControl>
                                    <FormLabel id="gender-radio-group">เพศ</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="gender-radio-group"
                                        name="patient_gender"
                                        value={gender}
                                        onChange={handleGenderChange}
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
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ที่อยู่</h3>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="grid gap-2">
                                        <Input
                                            name="patient_address"
                                            type="text"
                                            placeholder="ที่อยู่"
                                            value={datapatient.patient_address || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">จังหวัด</Label>
                                        <Select
                                            name="province_id"
                                            value={selectedProvince ? String(selectedProvince) : ''}
                                            onValueChange={(val) => setSelectedProvince(Number(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกจังหวัด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {provinces.map((p) => (
                                                    <SelectItem key={p.province_id} value={String(p.province_id)}>
                                                        {p.name_th}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">อำเภอ/เขต</Label>
                                        <Select
                                            name="district_id"
                                            value={selectedDistrict ? String(selectedDistrict) : ''}
                                            onValueChange={(val) => setSelectedDistrict(Number(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="อำเภอ/เขต" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((d) => (
                                                    <SelectItem key={d.district_id} value={String(d.district_id)}>
                                                        {d.name_th}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">ตำบล/แขวง</Label>
                                        <Select name="subdistrict_id"
                                            value={selectedSubdistrict ? String(selectedSubdistrict) : ''}
                                            onValueChange={(val) => setSelectedSubdistrict(Number(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="ตำบล/แขวง" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subdistricts.map((s) => (
                                                    <SelectItem key={s.subdistrict_id} value={String(s.subdistrict_id)}>
                                                        {s.name_th}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">รหัสไปรษณีย์</Label>
                                        <Input
                                            name="patient_zipcode"
                                            type="number"
                                            placeholder="รหัสไปรษณีย์"
                                            readOnly
                                            className="bg-gray-50"
                                            value={zipcode || ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* สิทธิ์การรักษา */}
                    <Card>
                        <CardContent>
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">สิทธิ์การรักษา</Label>
                                <Select
                                    value={selectedSis.toString()} onValueChange={(val) => setSelectedSis(val)}
                                    name="patient_sis"
                                >
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
                                            onCheckedChange={(checked) => handlePatientTypeChange(status, checked === true)}
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
                        <CardContent>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    name="patient_health"
                                    value="Alert pre Arrest"
                                    className="border-red-500 data-[state=checked]:bg-red-500"
                                    checked={datapatient.patient_health === 'Alert pre Arrest'}
                                    onCheckedChange={(checked) =>
                                        setdatapatient((prev: any) => ({
                                            ...prev,
                                            patient_health: checked ? 'Alert pre Arrest' : '',
                                        }))
                                    }
                                />
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <Label className="text-sm font-semibold text-red-600">Alert pre Arrest</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">อ่านบัตรประชาชน</Button>
                        </DialogClose>
                        <Button type="submit" variant="outline">
                            บันทึกข้อมูล
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
