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
} from "@mui/material"
import { AccessTime, Person, MonitorHeart, Bloodtype, FavoriteOutlined, MedicalServices } from "@mui/icons-material"

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
        const intervalId = setInterval(GetQueue, 1000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container maxWidth="lg">
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
            <Grid container spacing={2}>
                <Grid container columnSpacing={3} rowSpacing={1}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        {/* Service Card */}
                        <Box sx={{ width: { lg: '300px' } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: {
                                        xs: "center",
                                        sm: "center",
                                        lg: "flex-start",
                                    },
                                }}
                            >
                                {/* Service Icon*/}
                                <Box
                                    sx={{
                                        background: "linear-gradient(to right, #E2D8CB, #E0C299)",
                                        width: "72px",
                                        height: "72px",
                                        p: 1,
                                        borderRadius: 2,
                                        marginBottom: { xs: 1, sm: 2 },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "& img": {
                                            objectFit: "contain",
                                        },
                                    }}
                                >
                                </Box>
                            </Box>

                            {/* Service content*/}
                            <Box
                                sx={{
                                    textAlign: { xs: "center", sm: "center", lg: "left" },
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: "14px", sm: "14px", lg: "16px" },
                                        lineHeight: { xs: "22px", sm: "22px", lg: "24px" },
                                        color: "#040404",
                                        mb: 1,
                                    }}
                                >

                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 400,
                                        fontSize: { xs: "12px", sm: "14px", lg: "16px" },
                                        lineHeight: { xs: "20px", sm: "22px", lg: "24px" },
                                        color: "#040404",
                                        px: { xs: 2, sm: 3, lg: 0 },
                                    }}
                                >

                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid >
            </Grid>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 3, textAlign: "center" }}
            >
                ข้อมูลจะอัพเดทอัตโนมัติทุก 30 วินาที | สอบถามเพิ่มเติม โทร. 02-123-4567
            </Typography>
        </Container>
    )
}
