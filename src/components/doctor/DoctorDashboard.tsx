import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doctorApi } from '@/api/doctorApi';
import { patientApi } from '@/api/patientApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PatientCreationForm from './PatientCreationForm';
import PatientSearch from './PatientSearch';
import PatientOverview from './PatientOverview';

interface PatientHistory {
  id: string;
  visit_date: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  patient_id: string;
  patient_profile?: {
    full_name: string;
  };
  doctor_profile?: {
    full_name: string;
  };
}

interface Patient {
  id: string;
  full_name: string;
  patient_id_number: string;
}

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientHistories, setPatientHistories] = useState<PatientHistory[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    notes: '',
    diagnosis: '',
    prescription: ''
  });

  // Load all patients using the new API
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      // Use the new doctorApi instead of Supabase
      const data = await doctorApi.getPatients();
      setPatients(data || []);
    } catch (error: any) {
      toast.error('Error loading patients: ' + error.message);
    }
  };

  const loadPatientHistory = async (patientId: string) => {
    try {
      setLoading(true);
      // Use the new patientApi instead of Supabase
      const data = await patientApi.getPatientVisits(patientId);
      setPatientHistories(data || []);
    } catch (error: any) {
      toast.error('Error loading patient history: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    loadPatientHistory(patient.id);
  };

  const handleRecordChange = (field: keyof typeof newRecord, value: string) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRecord = async () => {
    if (!selectedPatient || !profile) return;

    try {
      setLoading(true);
      // Use the new patientApi instead of Supabase
      await patientApi.addPatientVisit(selectedPatient.id, {
        doctor_id: profile.id,
        notes: newRecord.notes,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription,
        visit_date: new Date().toISOString()
      });
      
      toast.success('Medical record added successfully');
      setNewRecord({ notes: '', diagnosis: '', prescription: '' });
      loadPatientHistory(selectedPatient.id);
    } catch (error: any) {
      toast.error('Error adding record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-gray-600">Manage your patients and medical records</p>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="create">Create Patient</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Search</CardTitle>
                <CardDescription>
                  Search and select patients to view their records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientSearch
                  patients={patients}
                  onPatientSelect={handlePatientSelect}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </CardContent>
            </Card>

            {selectedPatient && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Patient</CardTitle>
                  <CardDescription>
                    {selectedPatient.full_name} - ID: {selectedPatient.patient_id_number}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientOverview
                    patient={selectedPatient}
                    patientHistories={patientHistories}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="records">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <CardTitle>Add Medical Record</CardTitle>
                <CardDescription>
                  Add a new medical record for {selectedPatient.full_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={newRecord.notes}
                    onChange={(e) => handleRecordChange('notes', e.target.value)}
                    placeholder="Enter visit notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRecord.diagnosis}
                    onChange={(e) => handleRecordChange('diagnosis', e.target.value)}
                    placeholder="Enter diagnosis..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newRecord.prescription}
                    onChange={(e) => handleRecordChange('prescription', e.target.value)}
                    placeholder="Enter prescription..."
                  />
                </div>

                <button
                  onClick={handleAddRecord}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Record...' : 'Add Medical Record'}
                </button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">Please select a patient first to add medical records.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Patient</CardTitle>
              <CardDescription>
                Register a new patient in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientCreationForm onPatientCreated={loadPatients} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
