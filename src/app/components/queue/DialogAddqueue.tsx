import { useRef } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, MenuItem, IconButton, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { handleAddtreatmentstage } from "../../api/api_queue"

//alert toast
import toast from 'react-hot-toast';

//api
import { fetchGetdataPetient } from "../../api/api_patient"
import { handleAddQueue, fetchGetdatatreatmentstage } from "../../api/api_queue"

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void
}

type patients = {
    patient_id: number;
    fullname: string;
};

type PatientOption = {
    patient_id: number;
    fullname: string;
};

type treatmentstage = {
    stage_id: number;
    stage_name: string;
};



export default function DialogAddqueue({ open, onClose, onSuccess }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [patients, setPatients] = useState<patients[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
    const [treatmentstages, settreatmentstages] = useState<treatmentstage[]>([]);
    const [selectedtreatmentstages, setSelectedtreatmentstages] = useState<treatmentstage | null>(null);
    const [status, setStatus] = useState('');
    useEffect(() => {
        const getPatients = async () => {
            try {
                const data = await fetchGetdataPetient();
                const formatted = data.map((p: any) => ({
                    patient_id: p.patient_id,
                    fullname: `${p.patient_title} ${p.patient_firstname} ${p.patient_lastname}`,
                }));

                setPatients(formatted);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", error);
            }
        };

        const getTreatmentStages = async () => {
            try {
                const data = await fetchGetdatatreatmentstage();
                const formatted = data.map((p: any) => ({
                    stage_id: p.stage_id,
                    stage_name: `${p.stage_name}`,
                }));
                settreatmentstages(formatted);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงขั้นตอนการรักษา", error);
            }
        };

        getTreatmentStages();
        getPatients();
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleAddQueue(e);
        if (result?.success) {
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset();
            setSelectedPatient(null);
            setSelectedtreatmentstages(null);
            setStatus('');
            onClose();
            onSuccess()
        } else {
            toast.error(result?.message);
        }
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-treatment-stage-title"
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="add-treatment-stage-title">
                เพิ่มคิวติดตามสถานะผู้ป่วย
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 1 }}>
                    <Box display="flex" flexDirection="column" gap={2} sx={{ p: 1 }}>
                        <TextField
                            label="เลขเตียง"
                            name="bed_number"
                            variant="outlined"
                            type='number'
                            fullWidth
                            autoFocus
                            required
                        />

                        <Autocomplete
                            disablePortal={false}
                            fullWidth
                            options={patients}
                            getOptionLabel={(option) => option.fullname}
                            value={selectedPatient}
                            onChange={(event, value) => setSelectedPatient(value)}
                            renderInput={(params) => (
                                <TextField {...params} label="ผู้ป่วย" fullWidth />
                            )}
                        />

                        <Autocomplete
                            disablePortal={false}
                            fullWidth
                            options={treatmentstages}
                            getOptionLabel={(option) => option.stage_name}
                            value={selectedtreatmentstages}
                            onChange={(event, value) => setSelectedtreatmentstages(value)}
                            renderInput={(params) => (
                                <TextField {...params} label="ขั้นตอนปัจจุบัน" fullWidth />
                            )}
                        />

                        <TextField
                            select
                            label="เลือกสถานะ"
                            variant="outlined"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            name="status"
                        >
                            {/* <MenuItem value="" disabled>เลือกสถานะ</MenuItem> */}
                            <MenuItem value="waiting">รอ...</MenuItem>
                            <MenuItem value="in_progress">กำลังดำเนินการ</MenuItem>
                            <MenuItem value="done">เสร็จสิ้น</MenuItem>
                        </TextField>

                        <input
                            type="hidden"
                            name="patient_id"
                            value={selectedPatient?.patient_id || ""}
                        />

                        <input
                            type="hidden"
                            name="stage_id"
                            value={selectedtreatmentstages?.stage_id || ""}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="outlined" autoFocus>
                        บันทึก
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}