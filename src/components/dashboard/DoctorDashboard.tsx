import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  User, 
  Users, 
  TestTube, 
  BarChart3, 
  Database, 
  BookOpen,
  Activity,
  Settings,
  Eye
} from 'lucide-react';
import { TestResultManagement } from './doctor/TestResultManagement';
import { TestManagement } from './doctor/TestManagement';
import { GentisTestManagement } from './doctor/GentisTestManagement';
import { DiseaseView } from './doctor/DiseaseView';
import { DataAnalysis } from './doctor/DataAnalysis';
import { ProfileManagement } from './doctor/ProfileManagement';

interface DoctorDashboardProps {
  user: {
    role: 'admin' | 'doctor' | 'collaborator';
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

const menuItems = [
  { id: 'tests-result', label: 'Quản lý xét nghiệm', icon: Users },
  { id: 'tests', label: 'Tạo xét nghiệm', icon: TestTube },
  { id: 'batch', label: 'Phân tích hàng loạt', icon: Database },
  { id: 'diseases', label: 'Danh mục bệnh', icon: BookOpen },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: Settings },
];

const collaboratorMenuItems = [
  { id: 'tests-result', label: 'Quản lý xét nghiệm', icon: Users },
  { id: 'diseases', label: 'Danh mục bệnh', icon: BookOpen },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: Settings },
];

const DoctorSidebar = ({ activeTab, setActiveTab, userRole }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  userRole: string;
}) => {
  const filteredMenuItems = userRole === 'collaborator' ? collaboratorMenuItems : menuItems;

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold mb-4">
            <Activity className="h-5 w-5 mr-2" />
                            Gentis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('tests-result');

  const renderContent = () => {
    switch (activeTab) {
      case 'tests-result':
        return <TestResultManagement userRole={user.role} />;
      case 'tests':
        // Use enhanced test management for Gentis role, regular test management for collaborators
        return user.role === 'doctor' ? (
          <GentisTestManagement />
        ) : (
          <TestManagement userRole={user.role} />
        );
      case 'batch':
        return user.role !== 'collaborator' ? (
          <DataAnalysis />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Gentis không có quyền truy cập chức năng này</p>
          </div>
        );
      case 'diseases':
        return <DiseaseView />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return <TestResultManagement userRole={user.role} />;
    }
  };

  const getUserRoleDisplay = () => {
    switch (user.role) {
      case 'doctor':
        return 'Bác sĩ';
      case 'collaborator':
        return 'Gentis';
      case 'admin':
        return 'Quản trị viên';
      default:
        return user.role;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <DoctorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userRole={user.role}
        />
        
        <SidebarInset className="flex-1">
          <header className="bg-white border-b border-slate-200 py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-2xl font-bold text-slate-800">
                  Chào mừng, {user.name} ({getUserRoleDisplay()})
                </h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                      <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                    Hồ sơ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
