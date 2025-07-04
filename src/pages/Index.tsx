
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, Lock, Stethoscope, Shield } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{
    role: 'admin' | 'doctor' | 'collaborator';
    name: string;
    phone: string;
  } | null>(null);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Gentis</h1>
              <p className="text-slate-600">Phần mềm hỗ trợ phân tích xét nghiệm sàng lọc</p>
            </div>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {currentUser.role === 'admin' ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <DoctorDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
      <Toaster />
    </>
  );
};

export default Index;
