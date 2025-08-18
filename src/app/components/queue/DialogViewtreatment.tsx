import { useRef } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton, Typography, Chip, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { handleupdatatreatmentstage, fetcstageById, fetchGetdatatreatmentstage } from "../../api/api_queue"

//alert toast
import toast from 'react-hot-toast';

//icon
import { Icon } from '@iconify/react';
import { AccountCircle } from "@mui/icons-material"

import { fetchhistorywithqueue } from "../../api/api_queue";

interface Props {
    open: boolean
    onClose: () => void
    queue_id: number
    history_id: number
}

interface histoytreatment {
    patient_id: number;
    patient_HN: string;
    patient_title: string;
    patient_firstname: string;
    patient_lastname: string;
    patient_age: number;
    patient_gender: string;
    history_id: number;
    AN: number;
    ward_name: string;
    Bed: string;
    doctor: string;
    ChronicDisease: string;
    diangnosis: string;
    name_respiration: string;
    typehistorytreatment: string;
    registerdate: string;
    name_procedure: string;
    bleed: string;
    LeftRight: string;
    internalijulavein: string;
    name_vascular: string;
    DBLPerm: string;
    side_name: string;
    suboption_name: string;
}


export default function DialogViewtreatment({ open, onClose, queue_id, history_id }: Props) {

    const [history_with_queue, sethistory_with_queue] = useState<histoytreatment | null>(null);

    const loadqueue = async () => {
        try {
            const data = await fetchhistorywithqueue(queue_id, history_id);
            sethistory_with_queue(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadqueue();
    }, []);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-treatment-stage-title"
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="add-treatment-stage-title">
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
            <DialogContent sx={{ p: 1 }}>
                <Box display="flex" flexDirection="column" gap={2} sx={{ p: 1 }}>
                    <Box mb={4}>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                            รายละเอียดการรักษา
                        </Typography>
                    </Box>


                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >

                        {/* หัวข้อ */}
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: 'primary.main', }}
                        >
                            ข้อมูลส่วนตัว
                        </Typography>

                        {/* ชื่อและไอคอน */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountCircle sx={{ color: 'primary.main', fontSize: 36 }} />
                            <Typography variant="body1" fontWeight="bold">
                                {history_with_queue?.patient_title} {history_with_queue?.patient_firstname} {history_with_queue?.patient_lastname}
                            </Typography>
                        </Box>

                        {/* ข้อมูลเพิ่มเติม */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                                label={`HN ${history_with_queue?.patient_HN}`}
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={`อายุ ${history_with_queue?.patient_age} ปี`}
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={`เพศ ${history_with_queue?.patient_gender}`}
                                variant="outlined"
                                color="primary"
                            />
                        </Stack>
                    </Box>



                    {/* ส่วนข้อมูลการรักษา */}
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }}
                        >
                            ข้อมูลการรักษา
                        </Typography>

                        <Typography variant="body1">
                            <strong>วันที่เข้ารับการรักษา:</strong>{" "}
                            {history_with_queue?.registerdate
                                ? new Date(history_with_queue.registerdate).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "-"}
                        </Typography>

                        {/* หมอผู้ทำ */}
                        <Typography variant="body1">
                            <strong>แพทย์ผู้รักษา </strong> {history_with_queue?.doctor || "-"}
                        </Typography>

                        <Typography variant="body1">
                            <strong>การวินิจฉัย </strong> {history_with_queue?.diangnosis || "-"}
                        </Typography>

                        <Typography variant="body1">
                            <strong>โรคประจำตัว </strong> {history_with_queue?.ChronicDisease || "-"}
                        </Typography>

                        <Typography variant="body1">
                            <strong>การหายใจ </strong> {history_with_queue?.name_respiration || "-"}
                        </Typography>




                        <Box
                            sx={{
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: "grey.100",
                                maxWidth: 300,
                            }}
                        >
                            <Typography variant="body1">
                                <Stack direction="column" spacing={1}>
                                    <Box>
                                        <strong>หัตถการ: </strong> {history_with_queue?.name_procedure || "-"}
                                    </Box>
                                    <Box>
                                        <strong>ภาวะเลือดออก: </strong> {history_with_queue?.bleed || "-"}
                                    </Box>
                                    <Box>
                                        <strong>ข้าง: </strong> {history_with_queue?.LeftRight || "-"}
                                    </Box>
                                    <Box>
                                        <strong>Internalijulavein: </strong> {history_with_queue?.internalijulavein || "-"}
                                    </Box>
                                    <Box>
                                        <strong>DBLPerm: </strong> {history_with_queue?.DBLPerm || "-"}
                                    </Box>
                                </Stack>
                            </Typography>
                        </Box>



                        {/* เส้นเลือดที่ใช้ */}
                        <Typography variant="body1">
                            {history_with_queue?.name_vascular || "-"}
                        </Typography>

                        <Box
                            sx={{
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: "grey.100",
                                maxWidth: 300,
                            }}
                        >
                            <Typography variant="body1">
                                <Stack direction="column" spacing={1}>
                                    <Box>
                                         <strong>เส้นเลือดที่ใช้ </strong> {history_with_queue?.name_vascular || "-"}
                                    </Box>
                                    <Box>
                                        <strong>ข้าง </strong> {history_with_queue?.side_name || "-"}
                                    </Box>
                                    <Box>
                                        <strong>doublelumen </strong> {history_with_queue?.suboption_name || "-"}
                                    </Box>
                                </Stack>
                            </Typography>
                        </Box>


                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                                label={`Ward ${history_with_queue?.ward_name || "-"}`}
                                variant="outlined"
                                color="primary"
                            />
                            <Chip
                                label={`เตียง ${history_with_queue?.Bed || "-"}`}
                                variant="outlined"
                                color="primary"
                            />
                            <Chip
                                label={`${history_with_queue?.typehistorytreatment || "-"}`}
                                variant="outlined"
                                color="primary"
                            />
                        </Stack>
                    </Box>

                </Box>
            </DialogContent>
        </Dialog>
    );
}