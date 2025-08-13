const API_BASE_URL = 'http://localhost:3333';
import Swal from 'sweetalert2';

export const handleAddNurse = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),
  };
  try {
    const res = await fetch(`${API_BASE_URL}/nurse`, {
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

export const fetchGetdataNurse = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/nurse`);
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const handleDelete = async (nurse_id: number) => {
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
      const res = await fetch(`http://localhost:3333/nurse/${nurse_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      // console.log(data);
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


export const fetchNurseById = async (nurse_id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/nurse/${nurse_id}`, {
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


export const handleupdatenurse = async (e: React.FormEvent<HTMLFormElement>, nurseID: number) => {
  e.preventDefault();

  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),
  };

  try {
    const res = await fetch(`http://localhost:3333/nurse/${nurseID}`, {
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

