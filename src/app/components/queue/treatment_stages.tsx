import React, { useEffect, useState } from 'react';
//mui
import { Box, IconButton, Stack, Button, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material';
import { Delete, Edit, } from "@mui/icons-material"

//components
import DialogAddtreatmentstages from "../queue/DialogAddtreatment_stages"
import DialogEditTreatmentStages from "../queue/DialogEdittreatment_stages"

//api
import { fetchGetdatatreatmentstage, handleDeletetreatmentstage } from "../../api/api_queue"
interface treatmentstages {
    stage_id: number
    stage_name: string;
    description: string;
}

export default function Treatmentstages() {

    const [open, setOpen] = useState(false)
    const [Datatreatmentstages, setDatatreatmentstages] = useState<treatmentstages[]>([]);
    const [selectedstage_id, setSelectedstage_id] = useState<number | null>(null);

    const loadTreatmentStages = async () => {
        try {
            const data = await fetchGetdatatreatmentstage();
            setDatatreatmentstages(data);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงขั้นตอนการรักษา", error);
        }
    };

    useEffect(() => {
        loadTreatmentStages();
    }, []);

    
    return (
        <Box>
            <Stack spacing={2}>
                <Box>
                    <Button variant="outlined" onClick={() => setOpen(true)}>เพิ่มขั้นตอนการรักษา</Button>
                    <DialogAddtreatmentstages
                        open={open}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            loadTreatmentStages();
                            setOpen(false)
                        }}
                    />
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>ชื่อขั้นตอน</TableCell>
                            <TableCell>รายละเอียด</TableCell>
                            <TableCell>การจัดการ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Datatreatmentstages.map((tt, index) => (
                            <TableRow key={tt.stage_id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{tt.stage_name}</TableCell>
                                <TableCell>{tt.description}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="warning"
                                        onClick={() => {
                                            setSelectedstage_id(tt.stage_id);
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error"
                                        onClick={async () => {
                                            await handleDeletetreatmentstage(tt.stage_id);
                                            loadTreatmentStages()
                                        }}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>

            {selectedstage_id && (
                <DialogEditTreatmentStages
                    open={true}
                    onClose={() => setSelectedstage_id(null)}
                    onSuccess={() => {
                        loadTreatmentStages();
                        setSelectedstage_id(null);
                    }}
                    stage_id={selectedstage_id}
                />
            )}
        </Box>



    )
}
