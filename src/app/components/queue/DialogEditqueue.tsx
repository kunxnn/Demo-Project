import React, { useEffect, useState, useRef } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Box, MenuItem, IconButton, Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

// API
import { fetchgetAvailablePatients } from "../../api/api_patient";
import { handleupdatequeue, fetchqueueById, fetchGetdatatreatmentstage } from "../../api/api_queue";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    queue_id: number;
}

type PatientOption = {
    patient_id: number;
    fullname: string;
};

type TreatmentStage = {
    stage_id: number;
    stage_name: string;
};

interface Patient {
    patient_id: number;
    patient_HN: string;
    patient_title: string;
    patient_firstname: string;
    patient_lastname: string;
}

interface Stage {
    stage_name: string;
    description: string;
}

interface Queue {
    queue_id: number;
    bed_number: number;
    patient: Patient;
    stage: Stage;
    description: string;
    status: string;
}

export default function DialogEditqueue({ open, onClose, onSuccess, queue_id }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const [patients, setPatients] = useState<PatientOption[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);

    const [treatmentStages, setTreatmentStages] = useState<TreatmentStage[]>([]);
    const [selectedTreatmentStage, setSelectedTreatmentStage] = useState<TreatmentStage | null>(null);

    const [status, setStatus] = useState('');
    const [queue, setQueue] = useState<Queue | null>(null);

    useEffect(() => {
        const getPatients = async () => {
            try {
                const data = await fetchgetAvailablePatients();
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
                setTreatmentStages(formatted);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงขั้นตอนการรักษา", error);
            }
        };

        getPatients();
        getTreatmentStages();
    }, []);


    useEffect(() => {
        if (open && queue_id) {
            fetchqueueById(queue_id).then((data) => {
                if (data) {
                    console.log("Fetched data:", data);
                    setQueue(data);

                    // setStatus(data.status);

                    if (data.patient) {
                        setSelectedPatient({
                            patient_id: data.patient.patient_id,
                            fullname: `${data.patient.patient_title} ${data.patient.patient_firstname} ${data.patient.patient_lastname}`,
                        });
                    }

                    // if (data.stage) {
                    //     setSelectedTreatmentStage({
                    //         stage_id: (data as any).stage.stage_id,
                    //         stage_name: data.stage.stage_name,
                    //     });
                    // }
                }
            });
        }
    }, [open, queue_id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleupdatequeue(e ,queue_id);
        if (result?.success) {
            toast.success(result.message, { duration: 2000, position: 'top-center' });
            formRef.current?.reset();
            setSelectedPatient(null);
            setSelectedTreatmentStage(null);
            setStatus('');
            onClose();
            onSuccess();
        } else {
            toast.error(result?.message);
        }
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" aria-labelledby="edit-queue-title">
            <DialogTitle sx={{ m: 0, p: 2 }} id="edit-queue-title">
                แก้ไขคิวติดตามสถานะผู้ป่วย
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

            <form ref={formRef} onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 1 }}>
                    <Box display="flex" flexDirection="column" gap={2} sx={{ p: 1 }}>
                        <TextField
                            label="เลขเตียง"
                            name="bed_number"
                            variant="outlined"
                            type="number"
                            fullWidth
                            defaultValue={queue?.bed_number || ''}
                            required
                        />

                        <Autocomplete
                            fullWidth
                            options={patients}
                            getOptionLabel={(option) => option.fullname}
                            value={selectedPatient}
                            onChange={(event, value) => setSelectedPatient(value)}
                            renderInput={(params) => <TextField {...params} label="ผู้ป่วย" fullWidth />}
                        />

                        {/* <Autocomplete
                            fullWidth
                            options={treatmentStages}
                            getOptionLabel={(option) => option.stage_name}
                            value={selectedTreatmentStage}
                            onChange={(event, value) => setSelectedTreatmentStage(value)}
                            renderInput={(params) => <TextField {...params} label="ขั้นตอนปัจจุบัน" fullWidth />}
                        />

                        <TextField
                            select
                            label="เลือกสถานะ"
                            variant="outlined"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            name="status"
                        >
                            <MenuItem value="waiting">รอดำเนินการ</MenuItem>
                            <MenuItem value="in_progress">กำลังดำเนินการ</MenuItem>
                            <MenuItem value="done">เสร็จสิ้น</MenuItem>
                        </TextField> */}

                        <input type="hidden" name="patient_id" value={selectedPatient?.patient_id || ""} />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" variant="outlined">บันทึก</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
