
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Layout from '@/components/Layout';
import DoctorDashboard from '@/components/doctor/DoctorDashboard';
import PatientDashboard from '@/components/patient/PatientDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';

const Index = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();

  // Refresh profile data every 30 seconds for doctors waiting approval
  useEffect(() => {
    if (profile?.role === 'doctor' && !profile.is_approved) {
      const interval = setInterval(() => {
        refreshProfile();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [profile, refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show admin dashboard if admin is authenticated
  if (isAdminAuthenticated) {
    return <AdminDashboard />;
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  // Check if doctor account is approved
  if (profile.role === 'doctor' && !profile.is_approved) {
    return (
      <Layout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Account Pending Approval</CardTitle>
                <CardDescription>
                  Your doctor account is awaiting admin approval
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Verification Required</span>
                </div>
                <p className="text-sm text-orange-700">
                  An administrator needs to verify your doctor ID ({profile.doctor_id}) before you can access the medical portal.
                  You will receive an email notification once your account is approved.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                This process helps ensure the security and privacy of patient data.
                Thank you for your patience.
              </p>
              <Button 
                onClick={refreshProfile}
                variant="outline" 
                className="w-full mt-4 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Check Approval Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {profile.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
    </Layout>
  );
};

export default Index;
