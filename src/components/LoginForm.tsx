
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Stethoscope, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const { toast } = useToast();

  const handleLogin = async (role: 'admin' | 'doctor' | 'collaborator') => {
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      onLogin({
        role,
        name: role === 'admin' ? 'Admin Gentis' : 'Bác sĩ Nguyễn Văn A',
        phone: phone
      });
      setLoading(false);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đến với Gentis",
      });
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!resetPhone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate password reset
    toast({
      title: "Đã gửi mã reset",
      description: `Mã reset mật khẩu đã được gửi tới ${resetPhone}`,
    });
    setShowForgotPassword(false);
    setResetPhone('');
  };

  if (showForgotPassword) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl text-slate-700">Quên mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resetPhone">Số điện thoại</Label>
              <Input
                id="resetPhone"
                type="tel"
                placeholder="Nhập số điện thoại đã đăng ký"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={handleForgotPassword}
            >
              Gửi mã reset
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl text-slate-700">Đăng nhập hệ thống</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-sm">
              <Stethoscope className="h-4 w-4 mr-1" />
              Bác sĩ
            </TabsTrigger>
            <TabsTrigger value="collaborator" className="text-sm">
              <User className="h-4 w-4 mr-1" />
              Cộng tác
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="mt-4">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={() => handleLogin('admin')}
              disabled={loading}
            >
              Đăng nhập với quyền Admin
            </Button>
          </TabsContent>
          
          <TabsContent value="doctor" className="mt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleLogin('doctor')}
              disabled={loading}
            >
              Đăng nhập Bác sĩ 
            </Button>
          </TabsContent>
          
          <TabsContent value="collaborator" className="mt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={() => handleLogin('collaborator')}
              disabled={loading}
            >
              Đăng nhập Bác sĩ Gentis
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-sm text-blue-600"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
