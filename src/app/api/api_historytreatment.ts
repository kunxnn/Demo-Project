const API_BASE_URL = 'http://localhost:3333';
import Swal from 'sweetalert2';
export const fetchGetdatahistory = async (patient_id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/historytreatment/patient/${patient_id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch historytreatment');
  }
};

export const handleDelete = async (history_id: number) => {
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
      const res = await fetch(`http://localhost:3333/historytreatment/${history_id}`, {
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

export const fetchhistoryById = async (history_id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/historytreatment/detail/${history_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error('Fetch failed historytreatment Edit');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchWard = async () => {
  const res = await fetch(`${API_BASE_URL}/ward`);
  if (!res.ok) {
    throw new Error('Failed to fetch ward');
  }
  return res.json();
};

export const fetchrespiration = async () => {
  const res = await fetch(`${API_BASE_URL}/respiration`);
  if (!res.ok) {
    throw new Error('Failed to fetch respiration');
  }
  return res.json();
};

export const fetchprocedure = async () => {
  const res = await fetch(`${API_BASE_URL}/procedure`);
  if (!res.ok) {
    throw new Error('Failed to fetch procedure');
  }
  return res.json();
};

export const fetchvascular = async () => {
  const res = await fetch(`${API_BASE_URL}/vascular`);
  if (!res.ok) {
    throw new Error('Failed to fetch vascular');
  }
  return res.json();
};

export const handleAddhistorytreatment = async (e: React.FormEvent<HTMLFormElement>, patient_id: number) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),
    ChronicDisease: form.getAll("ChronicDisease").join(","),
    patient_id_history: patient_id,
  };


  try {
    const res = await fetch('http://localhost:3333/historytreatment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result);
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

export const handleupdatehistorytreatment = async (e: React.FormEvent<HTMLFormElement>, history_id: number) => {
  e.preventDefault();

  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),
    ChronicDisease: form.getAll("ChronicDisease").join(","),
    history_id: history_id
  };

  const allFields = ['bleed', 'LeftRight', 'internalijulavein', 'DBLPerm', 'side_name', 'suboption_name'];
  (allFields as string[]).forEach(key => {
    if (!(key in data)) {
      (data as any)[key] = null;
    }
  });

  try {
    const res = await fetch(`http://localhost:3333/historytreatment/${history_id}`, {
      method: 'PATCH',
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

export const handleAddhistorytreatment_queue = async (e: React.FormEvent<HTMLFormElement>, patient_id: number , queue_id : number) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),
    ChronicDisease: form.getAll("ChronicDisease").join(","),
    patient_id_history: patient_id,
    queue_id: queue_id
  };


  try {
    const res = await fetch('http://localhost:3333/historytreatment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result);
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


