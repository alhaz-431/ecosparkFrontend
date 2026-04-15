import axios from 'axios';

const api = axios.create({
  // নিশ্চিত করুন আপনার .env ফাইলে এই নামটাই আছে
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // ১৫০০০ থেকে বাড়িয়ে ৬০০০০ (৬০ সেকেন্ড) করা হলো যাতে রেন্ডার সার্ভার জাগার সময় পায়
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ======================
// Request Interceptor
// ======================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================
// Response Interceptor
// ======================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // ৪০১ এরর হ্যান্ডলিং (অটো লগআউট)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // ইনবক্স বা ড্যাশবোর্ডে থাকলে লগইন পেজে পাঠিয়ে দিবে
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

















