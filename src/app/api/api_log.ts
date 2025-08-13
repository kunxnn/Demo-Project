const API_BASE_URL = 'http://localhost:3333';

export const fetchGetdataLog = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/log/me`, {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Log");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Log");
  }
};



