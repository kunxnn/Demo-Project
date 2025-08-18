"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Container,
    Paper,
    LinearProgress,
    Avatar,
    Stack,
    Divider,
    CardHeader
} from "@mui/material"
import { AccessTime, MedicalServices, Person, MonitorHeart } from "@mui/icons-material";

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

export default function QueueDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [DataQueue, setDataQueueLog] = useState<Queue[]>([]);

    useEffect(() => {
        const GetQueue = async () => {

            try {
                const res = await fetch("http://localhost:3333/queue/showQueue", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`เกิดข้อผิดพลาดกับการดึงข้อมูล`);
                }

                const result = await res.json();
                setDataQueueLog(result);

            } catch (err) {
                console.error("Error fetching queue data:", err);
            }
        };

        GetQueue();
        const intervalId = setInterval(GetQueue, 10000);

        return () => clearInterval(intervalId);
    }, []);

    // ฟังก์ชันแปลงสถานะ
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'waiting': return 'รอดำเนินการ';
            case 'in_progress': return 'กำลังดำเนินการ';
            case 'done': return 'เสร็จสิ้น';
            default: return status;
        }
    };

    return (
        <Container maxWidth="lg" disableGutters>
            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    m: 2
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                    ระบบแสดงคิวผู้ป่วย
                </Typography>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                    โรงพยาบาลแพร่ ไตเทียม 3
                </Typography>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{
                        mt: 2,
                        p: 1.5,
                        bgcolor: "white",
                        borderRadius: 2,
                        display: "inline-flex",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    }}
                >
                    <AccessTime color="primary" />
                    <Typography variant="body1" fontWeight="medium">
                        {currentTime.toLocaleString("th-TH", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </Typography>
                </Stack>
            </Paper>

            <Grid container spacing={2} sx={{ mt: 2, p: 2 }}>
                {DataQueue.length === 0 ? (
                    <Typography variant="body1" sx={{ m: 2 }}>
                        กำลังโหลดข้อมูลคิว...
                    </Typography>
                ) : (
                    DataQueue.map((item) => (
                        <Grid key={item.queue_id}>
                            <Card
                                sx={{
                                    p: 3, 
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: 8
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 280, 
                                }}
                            >
                                {/* Bed Number */}
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <MedicalServices color="primary" fontSize="large" />
                                    <Typography variant="h5" fontWeight="bold" color="primary">
                                        เตียงที่ {item.bed_number}
                                    </Typography>
                                </Stack>

                                {/* Patient Info */}
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <Person color="primary" fontSize="large" />
                                    <Typography variant="h6" fontWeight="medium" noWrap>
                                        {item.patient.patient_title} {item.patient.patient_firstname} {item.patient.patient_lastname}
                                    </Typography>
                                </Stack>

                                {/* Status Display */}
                                <Box
                                    sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                        bgcolor: "white",
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <MonitorHeart color="error" fontSize="medium" />
                                        <Typography variant="h6" fontWeight="medium">
                                            {item.status_show_display ? getStatusLabel(item.status) : "ไม่แสดง"}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {item.stage.stage_name}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Updated At */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mt: "auto",
                                        bgcolor: "grey.100",
                                        p: 1,
                                        borderRadius: 1
                                    }}
                                >
                                    <AccessTime fontSize="small" color="action" />
                                    <Typography
                                        variant="body2" // ใหญ่ขึ้นจาก caption
                                        color="text.secondary"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        อัปเดตล่าสุด:{" "}
                                        {new Date(item.updated_at).toLocaleString("th-TH", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </Typography>
                                </Stack>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 3, textAlign: "center" }}
            >
                ข้อมูลจะอัพเดทอัตโนมัติทุก 10 วินาที | สอบถามเพิ่มเติม โทร. 083-603-8713
            </Typography>
        </Container>
    )
}
