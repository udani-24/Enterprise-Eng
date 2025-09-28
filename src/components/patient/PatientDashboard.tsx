import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { patientApi } from '@/api/patientApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, User, Pill, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PatientHistory {
  id: string;
  visit_date: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  doctor_id: string;
  doctor_profile?: {
    full_name: string;
  };
}

const PatientDashboard = () => {
  const { profile } = useAuth();
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadPatientHistory();
    }
  }, [profile]);

  const loadPatientHistory = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      // Use the new API instead of Supabase
      const data = await patientApi.getPatientVisits(profile.id);
      setPatientHistory(data || []);
    } catch (error: any) {
      toast.error('Error loading medical history: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecentVisitStats = () => {
    const totalVisits = patientHistory.length;
    const recentVisit = patientHistory[0];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const recentVisits = patientHistory.filter(
      visit => new Date(visit.visit_date) > lastMonth
    ).length;

    return { totalVisits, recentVisit, recentVisits };
  };

  const stats = getRecentVisitStats();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {profile?.full_name}
        </h1>
        {(profile as any)?.patient_id_number && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Patient ID: {(profile as any).patient_id_number}
            </Badge>
          </div>
        )}
        <p className="text-gray-600">Your medical records and health information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalVisits}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Visits</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentVisits}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Visit</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.recentVisit
                    ? new Date(stats.recentVisit.visit_date).toLocaleDateString()
                    : 'No visits yet'
                  }
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medications Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Current Medications from Medical History
          </CardTitle>
          <CardDescription>
            Medications prescribed in previous visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading medications...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientHistory
                .filter(record => record.prescription)
                .map(record => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {new Date(record.visit_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-800">{record.prescription}</span>
                    </div>
                  </div>
                ))}
              {patientHistory.filter(record => record.prescription).length === 0 && (
                <div className="text-center text-gray-500 py-4">No medications found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical History
          </CardTitle>
          <CardDescription>
            Your complete medical record history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading your medical history...</p>
            </div>
          ) : patientHistory.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Medical Records Yet
              </h3>
              <p className="text-gray-600">
                Your medical history will appear here after your first visit
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {patientHistory.map((record) => (
                <div key={record.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Visit on {new Date(record.visit_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.visit_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {record.doctor_profile?.full_name && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Dr. {record.doctor_profile.full_name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid gap-4">
                    {record.diagnosis && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Diagnosis
                        </h4>
                        <p className="text-red-800">{record.diagnosis}</p>
                      </div>
                    )}
                    
                    {record.prescription && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Prescription
                        </h4>
                        <p className="text-blue-800">{record.prescription}</p>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                        <p className="text-gray-700">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
