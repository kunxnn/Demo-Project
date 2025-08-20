import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

// MUI
import { Box, Stack, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Switch, Select, MenuItem, Tooltip, Typography } from '@mui/material';

// Icons
import { Delete, Edit, MedicalServices, Folder, ViewList } from "@mui/icons-material"
import { Icon } from '@iconify/react';

// Component
import DialogAddqueue from "../queue/DialogAddqueue"
import DialogEditqueue from "../queue/DialogEditqueue"
import DialogAddhistorytreatment from "../queue/DialogAddHistorytrentment_queue"
import EditDialogHistorytreatment from "../queue/EditDialogHistorytreatment"
import DialogViewtreatment from "../queue/DialogViewtreatment"
// API
import { fetchGetdataqueue, handleDeletequeue, fetchGetdatatreatmentstage, updateQueueStatus, updateQueueStage, toggleQueueDisplay } from "../../api/api_queue"
import { handleDelete } from "../../api/api_historytreatment";


export default function QueueSettingPatient() {
    const router = useRouter();
    const statusLabels: { [key: string]: string } = {
        waiting: 'รอดำเนินการ',
        in_progress: 'กำลังดำเนินการ',
        done: 'เสร็จสิ้น',
    };

    interface Patient {
        patient_id: number;
        patient_HN: string;
        patient_title: string;
        patient_firstname: string;
        patient_lastname: string;
    }

    interface Stage {
        stage_id: number;
        stage_name: string;
        description?: string;
    }

    interface Queue {
        queue_id: number;
        bed_number: number;
        patient: Patient;
        stage: Stage;
        status: string;
        hasHistory: boolean;
        history_treatment: HistoryTreatment;
        status_show_display: boolean;
        updated_at: string;
    }

    interface HistoryTreatment {
        history_id: number;
    }
    type treatmentstage = {
        stage_id: number;
        stage_name: string;
    };

    const [open, setOpen] = useState(false);
    const [openViewtreatment, setOpenViewtreatment] = useState(false);
    const [QueueIDview, setQueueIDview] = useState<number | null>(null);
    const [SelectedhistorytreatmentIDview, setSelectedhistorytreatmentIDview] = useState<number | null>(null);
    const [queue, setQueue] = useState<Queue[]>([]);
    const [selectedqueue_id, setSelectedqueue_id] = useState<number | null>(null);
    const [addHistoryQueueId, setAddHistoryQueueId] = useState<number | null>(null);
    const [editHistoryQueueId, setEditHistoryQueueId] = useState<number | null>(null);
    const [SelectedhistorytreatmentID, setSelectedhistorytreatmentID] = useState<number | null>(null);
    const [bedNumber, setBedNumber] = useState<number>(0);

    const [editStatus, setEditStatus] = useState<{ [key: number]: string }>({});
    const [editStage, setEditStage] = useState<{ [key: number]: number }>({});
    const [showDisplayMap, setShowDisplayMap] = useState<{ [key: number]: boolean }>({});

    const [treatmentstages, settreatmentstages] = useState<treatmentstage[]>([]);

    const loadqueue = async () => {
        try {
            const data = await fetchGetdataqueue();
            setQueue(data);
            const statusMap: { [key: number]: string } = {};
            const stageMap: { [key: number]: number } = {};
            data.forEach((q: Queue) => {
                statusMap[q.queue_id] = q.status;
                stageMap[q.queue_id] = q.stage.stage_id;
            });
            setEditStatus(statusMap);
            setEditStage(stageMap);

            const treatmentStagesData = await fetchGetdatatreatmentstage();
            const formatted = treatmentStagesData.map((p: any) => ({
                stage_id: p.stage_id,
                stage_name: p.stage_name,
            }));
            settreatmentstages(formatted);

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        loadqueue();

    }, []);

    const handleChangeStatus = async (queue_id: number, newStatus: string) => {
        try {
            setEditStatus(prev => ({ ...prev, [queue_id]: newStatus }));
            await updateQueueStatus(queue_id, newStatus);
            loadqueue();
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const handleChangeStage = async (queue_id: number, newStageId: number) => {
        try {
            setEditStage(prev => ({ ...prev, [queue_id]: newStageId }));
            await updateQueueStage(queue_id, newStageId);
            loadqueue();
        } catch (error) {
            console.error('Update stage error:', error);
        }
    };

    const handleToggleDisplay = async (queue_id: number, currentValue: boolean) => {
        const newValue = !currentValue;
        try {
            await toggleQueueDisplay(queue_id, newValue);
            await loadqueue();
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <Box>
            <Stack spacing={2}>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                }}>
                    <Button variant="outlined" onClick={() => setOpen(true)}>
                        เพิ่มคิวติดตามสถานะผู้ป่วย
                    </Button>
                    <DialogAddqueue
                        open={open}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            loadqueue()
                            setOpen(false)
                        }}
                    />

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ViewList />}
                        onClick={() => router.push('DisplayQueue')}
                    >
                        หน้าแสดงคิว
                    </Button>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ลำดับ</TableCell>
                            <TableCell>เตียงที่</TableCell>
                            <TableCell>HN</TableCell>
                            <TableCell>ชื่อ</TableCell>
                            <TableCell>ขั้นตอนปัจจุบัน</TableCell>
                            <TableCell>สถานะ</TableCell>
                            <TableCell>ข้อมูลล่าสุด</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queue.map((q, index) => (
                            <TableRow key={q.queue_id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{q.bed_number}</TableCell>
                                <TableCell>{q.patient.patient_HN}</TableCell>
                                <TableCell>{`${q.patient.patient_title} ${q.patient.patient_firstname} ${q.patient.patient_lastname}`}</TableCell>

                                <TableCell>
                                    <Select
                                        size="small"
                                        value={editStage[q.queue_id] ?? ''}
                                        onChange={(e) => {
                                            const selectedId = Number(e.target.value);
                                            handleChangeStage(q.queue_id, selectedId);
                                        }}
                                    >
                                        {treatmentstages.map(stage => (
                                            <MenuItem key={stage.stage_id} value={stage.stage_id}>
                                                {stage.stage_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>

                                <TableCell>
                                    <Select
                                        size="small"
                                        value={editStatus[q.queue_id] ?? ''}
                                        onChange={(e) => handleChangeStatus(q.queue_id, e.target.value)}
                                    >
                                        {Object.entries(statusLabels).map(([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>

                                <TableCell>
                                    {new Date(q.updated_at).toLocaleString('th-TH', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </TableCell>

                                <TableCell>
                                    <Tooltip title="ปิด/เปิด การแสดงคิว">
                                        <Switch
                                            checked={q.status_show_display}
                                            onChange={() => handleToggleDisplay(q.queue_id, q.status_show_display)}
                                        />
                                    </Tooltip>

                                    <Tooltip title={q.hasHistory ? "แก้ไขข้อมูลการรักษา" : "เพิ่มข้อมูลการรักษา"}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                setBedNumber(q.bed_number);
                                                if (q.hasHistory && q.history_treatment) {
                                                    setEditHistoryQueueId(q.queue_id);
                                                    setSelectedhistorytreatmentID(q.history_treatment.history_id);
                                                } else {
                                                    setAddHistoryQueueId(q.queue_id);
                                                }
                                            }}
                                        >
                                            {q.hasHistory ? <Edit /> : <MedicalServices />}
                                        </IconButton>
                                    </Tooltip>



                                    {q.hasHistory && (
                                        <>
                                            <Tooltip title="ดูรายละเอียดการรักษา">
                                                <IconButton color="primary" onClick={() => {
                                                    setQueueIDview(q.queue_id);
                                                    setSelectedhistorytreatmentIDview(q.history_treatment.history_id);
                                                }}>
                                                    <Folder />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="ลบข้อมูลการรักษา">
                                                <IconButton
                                                    color="error"
                                                    onClick={async () => {
                                                        await handleDelete(q.history_treatment.history_id);
                                                        loadqueue()
                                                    }}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </>

                                    )}

                                    <Tooltip title="แก้ไขคิว">
                                        <IconButton color="warning"
                                            onClick={() => {
                                                setSelectedqueue_id(q.queue_id);
                                            }}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="ลบคิว">
                                        <IconButton color="error"
                                            onClick={async () => {
                                                await handleDeletequeue(q.queue_id);
                                                loadqueue()
                                            }}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>

            {selectedqueue_id && (
                <DialogEditqueue
                    open={true}
                    onClose={() => setSelectedqueue_id(null)}
                    onSuccess={() => {
                        loadqueue();
                        setSelectedqueue_id(null);
                    }}
                    queue_id={selectedqueue_id}
                />
            )}

            {addHistoryQueueId && (
                <DialogAddhistorytreatment
                    open={true}
                    onClose={() => setAddHistoryQueueId(null)}
                    onSuccess={() => {
                        loadqueue();
                        setAddHistoryQueueId(null);
                    }}
                    queue_id={addHistoryQueueId}
                    bedNumber={bedNumber}
                />
            )}

            {editHistoryQueueId && SelectedhistorytreatmentID !== null && (
                <EditDialogHistorytreatment
                    open={true}
                    onClose={() => setEditHistoryQueueId(null)}
                    onSuccess={() => {
                        loadqueue();
                        setEditHistoryQueueId(null);
                    }}
                    queue_id={editHistoryQueueId}
                    history_id={SelectedhistorytreatmentID}
                />
            )}

            {QueueIDview && SelectedhistorytreatmentIDview !== null && (
                <DialogViewtreatment
                    open={true}
                    onClose={() => {
                        setQueueIDview(null);
                        setSelectedhistorytreatmentIDview(null);
                    }}
                    queue_id={QueueIDview}
                    history_id={SelectedhistorytreatmentIDview}
                />
            )}

        </Box >

    );
}
