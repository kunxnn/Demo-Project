import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

// MUI
import { Box, Chip, Stack, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Switch, Select, MenuItem, Tooltip } from '@mui/material';

// Icons
import { Delete, Edit, MedicalServices, Folder } from "@mui/icons-material"
import { Icon } from '@iconify/react';

// Component
import DialogAddqueue from "../queue/DialogAddqueue"
import DialogEditqueue from "../queue/DialogEditqueue"
import DialogAddhistorytreatment from "../queue/DialogAddHistorytrentment_queue"
import EditDialogHistorytreatment from "../queue/EditDialogHistorytreatment"

// API
import { fetchhistoryGetdataqueue, handleDeletequeue, } from "../../api/api_queue"
import { handleDelete } from "../../api/api_historytreatment";


export default function QueueSettingPatient() {
    const router = useRouter();


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
    }

    interface HistoryTreatment {
        history_id: number;
    }

    const [open, setOpen] = useState(false);
    const [queue, setQueue] = useState<Queue[]>([]);
    const [selectedqueue_id, setSelectedqueue_id] = useState<number | null>(null);
    const [addHistoryQueueId, setAddHistoryQueueId] = useState<number | null>(null);
    const [editHistoryQueueId, setEditHistoryQueueId] = useState<number | null>(null);
    const [SelectedhistorytreatmentID, setSelectedhistorytreatmentID] = useState<number | null>(null);
    const [bedNumber, setBedNumber] = useState<number>(0);

    const loadqueue = async () => {
        try {
            const data = await fetchhistoryGetdataqueue();
            setQueue(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadqueue();
    }, []);

    return (
        <Box>
            <Stack spacing={2}>
                <Box>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ลำดับ</TableCell>
                            <TableCell>เตียงที่</TableCell>
                            <TableCell>HN</TableCell>
                            <TableCell>ชื่อ</TableCell>
                            <TableCell>สถานะ</TableCell>
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
                                    {q.status === "done" ? (
                                        <Chip label="เสร็จสิ้นการรักษา" color="success" size="small" />
                                    ) : (
                                        q.status
                                    )}
                                </TableCell>


                                <TableCell>
                                    {q.hasHistory && (
                                        <Tooltip title="ดูรายละเอียดการรักษา">
                                        <IconButton color="primary" onClick={() => router.push(`Queue/Detail_Queue`)}>
                                            <Folder />
                                        </IconButton>
                                    </Tooltip>
                                    )}


                                    {/* <Tooltip title={q.hasHistory ? "แก้ไขข้อมูลการรักษา" : "เพิ่มข้อมูลการรักษา"}>
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
                                    </Tooltip> */}

                                    {/* {q.hasHistory && (
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
                                    )} */}

                                    {/* <Tooltip title="แก้ไขคิว">
                                        <IconButton color="warning"
                                            onClick={() => {
                                                setSelectedqueue_id(q.queue_id);
                                            }}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip> */}

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
        </Box>
    );
}
