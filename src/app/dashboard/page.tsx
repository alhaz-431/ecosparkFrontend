'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  }, [router]);

  return <p>Loading Dashboard...</p>;
}