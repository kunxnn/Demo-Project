const API_BASE_URL = 'http://localhost:3333';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3333';

export type AddPatientResult = {
  success: boolean;
  message: string;
};

export const fetchSis = async () => {
  const res = await fetch(`${API_BASE_URL}/sis`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
};


export const getProvinces = async () => {
  const res = await axios.get('/locations/provinces');
  return res.data;
};

export const getDistricts = async (provinceId: number) => {
  const res = await axios.get(`/locations/districts/${provinceId}`);
  return res.data;
};

export const getSubdistricts = async (districtId: number) => {
  const res = await axios.get(`/locations/subdistricts/${districtId}`);
  return res.data;
};

export const getZipcode = async (subdistrictId: number) => {
  const res = await axios.get(`/locations/zipcode/${subdistrictId}`);
  return res.data;
};


export const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const data = {
    ...Object.fromEntries(form.entries()),

    province_id: Number(form.get("province_id")),
    district_id: Number(form.get("district_id")),
    subdistrict_id: Number(form.get("subdistrict_id")),
    patient_type: form.getAll("patient_type").join(","),
    patient_age: Number(form.get("patient_age")),
    patient_zipcode: form.get("patient_zipcode")?.toString() ?? '',
  };

  try {
    const res = await fetch('http://localhost:3333/patient', {
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

