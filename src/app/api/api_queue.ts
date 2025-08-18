const API_BASE_URL = 'http://localhost:3333';
import Swal from 'sweetalert2';

export const handleAddtreatmentstage = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.currentTarget);
    const data = {
        ...Object.fromEntries(form.entries()),
    };

    try {
        const res = await fetch(`${API_BASE_URL}/queue/treatmentstage/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.code === 201) {
            return {
                success: result.status,
                message: result.message,
            }
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error(err);
    }
};

export const fetchGetdatatreatmentstage = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue/treatmentstage`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch treatmentstage");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch treatmentstage");
    }
};

export const fetcstageById = async (stage_id: number) => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue/treatmentstage/${stage_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const handleupdatatreatmentstage = async (e: React.FormEvent<HTMLFormElement>, stage_id: number) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data = {
        ...Object.fromEntries(form.entries()),
    };

    try {
        const res = await fetch(`http://localhost:3333/queue/treatmentstage/update/${stage_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.code === 200) {
            return {
                success: result.status,
                message: result.message,
            }
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error(err);
    }
};

export const handleDeletetreatmentstage = async (stage_id: number) => {
    const result = await Swal.fire({
        title: "ต้องการลบข้อมูลหรือไม่?",
        text: "กรุณาตรวจสอบข้อมูลที่ต้องการลบให้ดี!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ใช่, ลบเดี๋ยวนี้"
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:3333/queue/treatmentstage/detele/${stage_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (res.ok && result.code === 200) {
                Swal.fire({
                    icon: result.status,
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1000,
                })
            } else {
                Swal.fire({
                    icon: result.status,
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
        } catch (err) {
            console.error(err);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
    }
};

export const handleAddQueue = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.currentTarget);
    const data = {
        ...Object.fromEntries(form.entries()),
    };
    try {
        const res = await fetch(`${API_BASE_URL}/queue/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.code === 201) {
            return {
                success: result.status,
                message: result.message,
            }
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error(err);
    }
};

export const fetchGetdataqueue = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch queue");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch queue");
    }
};

export const handleDeletequeue = async (queue_id: number) => {
    const result = await Swal.fire({
        title: "ต้องการลบข้อมูลหรือไม่?",
        text: "กรุณาตรวจสอบข้อมูลที่ต้องการลบให้ดี!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ใช่, ลบเดี๋ยวนี้"
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`${API_BASE_URL}/queue/detele/${queue_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (res.ok && result.code === 200) {
                Swal.fire({
                    icon: result.status,
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1000,
                })
            } else {
                Swal.fire({
                    icon: result.status,
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
        } catch (err) {
            console.error(err);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
    }
};

export const fetchqueueById = async (queue_id: number) => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue/findone/${queue_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};


export const updateQueueStatus = async (queue_id: number, status: string) => {
    await fetch(`${API_BASE_URL}/queue/${queue_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
};


export const updateQueueStage = async (queue_id: number, stage: number) => {
    await fetch(`${API_BASE_URL}/queue/${queue_id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
    });
};

export const handleupdatequeue = async (e: React.FormEvent<HTMLFormElement>, queue_id: number) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data = {
        ...Object.fromEntries(form.entries()),
    };

    try {
        const res = await fetch(`${API_BASE_URL}/queue/update/${queue_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.code === 200) {
            return {
                success: result.status,
                message: result.message,
            }
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error(err);
    }
};


export const toggleQueueDisplay = async (queue_id: number, status_show_display: boolean) => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue/toggle-display/${queue_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status_show_display }),
        });

        if (!res.ok) {
            throw new Error('Failed to update display status');
        }

        const data = await res.json();
        return data; // { success: true/false, message: string }
    } catch (error) {
        console.error(error);
    }
}

export const fetchhistoryGetdataqueue = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/queue/findallhistoryqueue`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetchhistoryGetdataqueue");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetchhistoryGetdataqueue");
    }
};

export const fetchhistorywithqueue = async (queue_id: number, history_id: number) => {
    try {
        const res = await fetch(`${API_BASE_URL}/historytreatment/view/${history_id}`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch queue");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch queue");
    }
};