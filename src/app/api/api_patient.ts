import Swal from 'sweetalert2';
const API_BASE_URL = 'http://localhost:3333';


export const fetchGetdataPetient = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/patient`);
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const handleDelete = async (id: number) => {
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
      const res = await fetch(`http://localhost:3333/patient/${id}`, {
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

export const handleEditUser = async (patientData: any) => {
  const Newdatapatient = {
    ...patientData,
    patient_type: Array.isArray(patientData.patient_type)
      ? patientData.patient_type.join(',')
      : patientData.patient_type,
  };

  // console.log('🚀 sending patientstatus:', Newdatapatient); //  ตรวจสอบได้ว่ามี string แล้ว

  try {
    const res = await fetch(`http://localhost:3333/patient/${patientData.patient_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Newdatapatient), 
    });

    const result = await res.json();
    return { 
      ok: res.ok,
      code: result.code,
      message: result.message 
    };
  } catch (err) {
    return { 
      message: err };
  }
};


export const fetchUserById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/patient/${id}`, {
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
