const API_URL = 'http://10.0.13.211:4000/api'; // 👈 reemplazá por tu IP real

export const api = {
  listCourses: async () => {
    const res = await fetch(`${API_URL}/courses`);
    return res.json();
  },
  createCourse: async (accessToken, payload) => {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  enroll: async (accessToken, course_id) => {
    const res = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ course_id }),
    });
    return res.json();
  },
};
