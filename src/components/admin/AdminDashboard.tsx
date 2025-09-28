import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Settings, User, Calendar, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSettings from './AdminSettings';
import { useNavigate } from 'react-router-dom';

interface PendingDoctor {
  id: string;
  full_name: string;
  doctor_id: string;
  is_approved: boolean;
}

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<PendingDoctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredDoctors(pendingDoctors);
    } else {
      const keyword = search.toLowerCase();
      setFilteredDoctors(
        pendingDoctors.filter(
          d =>
            d.full_name.toLowerCase().includes(keyword) ||
            d.doctor_id.toLowerCase().includes(keyword)
        )
      );
    }
  }, [search, pendingDoctors]);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, doctor_id, is_approved')
        .eq('role', 'doctor')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setPendingDoctors(data || []);
    } catch (error: any) {
      toast.error('Error fetching doctors: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (doctorId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_approved: approved,
          approved_at: approved ? new Date().toISOString() : null,
        })
        .eq('id', doctorId);

      if (error) throw error;

      toast.success(
        approved
          ? 'Doctor approved successfully!'
          : 'Doctor approval revoked.'
      );
      await fetchPendingDoctors();
    } catch (error: any) {
      toast.error('Error updating doctor status: ' + error.message);
    }
  };

  if (showSettings) {
    return <AdminSettings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage doctor approvals and system settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            onClick={adminLogout}
            variant="destructive"
            className="flex items-center gap-2"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDoctors.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pendingDoctors.filter(d => d.is_approved).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingDoctors.filter(d => !d.is_approved).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH & TABLE */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle>Doctor Applications</CardTitle>
              <CardDescription>Review, approve, or revoke doctor registrations below.</CardDescription>
            </div>
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor ID or name"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No doctors found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Doctor ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow
                      key={doctor.id}
                      className={doctor.is_approved ? "bg-green-50" : ""}
                    >
                      <TableCell className="font-medium">{doctor.full_name}</TableCell>
                      <TableCell>
                        <span className="font-mono bg-accent/70 px-2 py-1 rounded text-xs">{doctor.doctor_id}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={doctor.is_approved ? "default" : "secondary"}
                          className={
                            doctor.is_approved
                              ? "bg-green-600 text-white"
                              : "bg-orange-400 text-white"
                          }
                        >
                          {doctor.is_approved ? (
                            <>
                              <CheckCircle className="inline mr-1 h-4 w-4" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Calendar className="inline mr-1 h-4 w-4" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!doctor.is_approved && (
                            <Button
                              size="sm"
                              onClick={() => handleApproval(doctor.id, true)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              aria-label="Approve doctor"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {doctor.is_approved && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproval(doctor.id, false)}
                              aria-label="Revoke doctor approval"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
