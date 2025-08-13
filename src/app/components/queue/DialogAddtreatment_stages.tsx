import { useRef } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, TextareaAutosize, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { handleAddtreatmentstage } from "../../api/api_queue"

//alert toast
import toast from 'react-hot-toast';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void
}


export default function DialogAddTreatmentStages({ open, onClose, onSuccess }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleAddtreatmentstage(e);
        if (result?.success) {
            toast.success(result.message, {
                duration: 2000,
                position: 'top-center',
            });
            formRef.current?.reset(); //รีเซตฟอร์มที่ส่งเข้ามา
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
                เพิ่มขั้นตอนการรักษา
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
                            label="ชื่อขั้นตอน"
                            name="stage_name"
                            variant="outlined"
                            fullWidth
                            autoFocus
                            required
                        />
                        <TextField
                            label="รายละเอียด"
                            name="description"
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={3}
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