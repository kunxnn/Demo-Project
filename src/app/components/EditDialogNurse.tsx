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

// icons 
import { AlertTriangle, User } from "lucide-react"

//alert toast
import toast from 'react-hot-toast';

//api
import { fetchNurseById, handleupdatenurse } from "../api/api_dialog_nurse"


interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    nurseID: number;
}

export default function EditDialogNurse({ open, onClose, onSuccess, nurseID }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const [nurseData, setNurseData] = useState({
        nurse_code: '',
        nurse_title: '',
        nurse_fname: '',
        nurse_lname: '',
        nurse_username: '',
        type: '',
    });

    useEffect(() => {
        if (open && nurseID) {
            fetchNurseById(nurseID).then(async (data) => {
                if (data) {
                    setNurseData({
                        nurse_code: data.nurse_code || '',
                        nurse_title: data.nurse_title || '',
                        nurse_fname: data.nurse_fname || '',
                        nurse_lname: data.nurse_lname || '',
                        nurse_username: data.nurse_username || '',
                        type: data.type,
                    });
                }
            });
        }
    }, [open, nurseID]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nurseID) {
            toast.error("ไม่พบผู้ใช้งาน"); //แก้ไม่ให้โค้ดแดงเฉยๆ
            return;
        }

        const result = await handleupdatenurse(e, nurseID);
        if (result?.success) { 
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset(); //รีเซตฟอร์มที่ส่งเข้ามา
            onClose();
        } else {
            toast.error(result?.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNurseData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" >
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">แก้ไขข้อมูลพยาบาล</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* ข้อมูลพื้นฐาน */}
                    <Card>
                        <CardContent>
                            <h3 className="font-medium text-sm text-gray-700 mb-4">ข้อมูลพื้นฐาน</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="HN" className="text-sm font-medium">
                                        รหัสประจำตัว <span className="text-red-500">*</span>
                                    </Label>
                                    <Input name="nurse_code" type="number" value={nurseData.nurse_code} onChange={handleChange} placeholder="กรอกหมายเลขประจำตัว" className="w-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">คำนำหน้า</Label>
                                        <Select name='nurse_title' value={nurseData.nurse_title} onValueChange={(val) => setNurseData((prev) => ({ ...prev, nurse_title: val }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกคำนำหน้า" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="นาย">นาย</SelectItem>
                                                <SelectItem value="นาง">นาง</SelectItem>
                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            ชื่อ <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="nurse_fname" type="text" value={nurseData.nurse_fname} onChange={handleChange} placeholder="กรอกชื่อ" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium">
                                            นามสกุล <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="nurse_lname" type="text" value={nurseData.nurse_lname} onChange={handleChange} placeholder="กรอกนามสกุล" required />
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4"'>
                                    <div className="grid gap-2">
                                        <Label htmlFor="yearold" className="text-sm font-medium">
                                            ชื่อผู้ใช้งาน <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="nurse_username" type="text" value={nurseData.nurse_username} onChange={handleChange} placeholder="ชื่อผู้ใช้งาน" className="w-32" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="yearold" className="text-sm font-medium">
                                            รหัสผ่าน <span className="text-red-500">*</span>
                                        </Label>
                                        <Input name="nurse_password" type="password" placeholder="กรอกรหัสผ่านใหม่หากต้องการเปลี่ยน" className="w-32" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="yearold" className="text-sm font-medium">
                                            สิทธิ์
                                        </Label>
                                        <Input name="type" type="text" value={nurseData.type} className="w-32" required={true} readOnly={true} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
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
