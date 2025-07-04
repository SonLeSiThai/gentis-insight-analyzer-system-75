
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  LogOut, 
  Database,
  Activity,
  Bell,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Target
} from 'lucide-react';
import { UserManagement } from './admin/UserManagement';
import { DiseaseManagement } from './admin/DiseaseManagement';

interface AdminDashboardProps {
  user: {
    role: string;
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced statistics data with positive indicators
  const systemStats = {
    totalPatients: 1248,
    totalDoctors: 24,
    totalDiseases: 157,
    testSamples: 1234,
    positiveResults: 312,
    negativeResults: 922,
    positiveRate: 25.0,
    highRiskPatients: 89,
    mediumRiskPatients: 156,
    lowRiskPatients: 1003,
    branches: [
      { name: 'Chi nhánh Hà Nội', patients: 456, positive: 123, negative: 333, positiveRate: 27.0 },
      { name: 'Chi nhánh TP.HCM', patients: 523, positive: 142, negative: 381, positiveRate: 27.2 },
      { name: 'Chi nhánh Đà Nẵng', patients: 269, positive: 47, negative: 222, positiveRate: 17.5 }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Gentis - Admin</h1>
              <p className="text-sm text-slate-600">Quản trị hệ thống</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-600">{user.phone}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
                <TabsTrigger 
                  value="overview" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Thống kê tổng quan
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Quản lý người dùng
                </TabsTrigger>
                <TabsTrigger 
                  value="diseases" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Quản lý bệnh
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                {/* Main Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng số bệnh nhân</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{systemStats.totalPatients}</div>
                      <p className="text-xs text-muted-foreground">Tất cả chi nhánh</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng số bác sĩ</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{systemStats.totalDoctors}</div>
                      <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Số bệnh trong hệ thống</CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{systemStats.totalDiseases}</div>
                      <p className="text-xs text-muted-foreground">+12 bệnh mới</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Positive Indicators Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tỷ lệ dương tính</CardTitle>
                      <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{systemStats.positiveRate}%</div>
                      <p className="text-xs text-muted-foreground">Tỷ lệ tổng thể</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Nguy cơ cao</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{systemStats.highRiskPatients}</div>
                      <p className="text-xs text-muted-foreground">Cần theo dõi sát</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Nguy cơ trung bình</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{systemStats.mediumRiskPatients}</div>
                      <p className="text-xs text-muted-foreground">Theo dõi định kỳ</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Nguy cơ thấp</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{systemStats.lowRiskPatients}</div>
                      <p className="text-xs text-muted-foreground">Tình trạng ổn định</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Results Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Kết quả dương tính</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{systemStats.positiveResults}</div>
                      <p className="text-xs text-muted-foreground">
                        {((systemStats.positiveResults / systemStats.totalPatients) * 100).toFixed(1)}% tổng số bệnh nhân
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Kết quả âm tính</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{systemStats.negativeResults}</div>
                      <p className="text-xs text-muted-foreground">
                        {((systemStats.negativeResults / systemStats.totalPatients) * 100).toFixed(1)}% tổng số bệnh nhân
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Mẫu xét nghiệm</CardTitle>
                      <Database className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{systemStats.testSamples}</div>
                      <p className="text-xs text-muted-foreground">Tuần này</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Branch Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê theo chi nhánh</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemStats.branches.map((branch, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <h3 className="font-medium text-slate-800">{branch.name}</h3>
                            <p className="text-sm text-slate-600">Tổng số bệnh nhân: {branch.patients}</p>
                          </div>
                          <div className="flex space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">{branch.positive}</div>
                              <div className="text-xs text-slate-600">Dương tính</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{branch.negative}</div>
                              <div className="text-xs text-slate-600">Âm tính</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">
                                {branch.positiveRate}%
                              </div>
                              <div className="text-xs text-slate-600">Tỷ lệ dương</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UserManagement />
            </TabsContent>

            <TabsContent value="diseases" className="mt-0">
              <DiseaseManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
