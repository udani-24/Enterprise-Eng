
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface PatientCreationFormProps {
  onPatientCreated: () => void;
}

const PatientCreationForm = ({ onPatientCreated }: PatientCreationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    patientIdNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the patient account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'patient',
            patient_id_number: formData.patientIdNumber,
          },
          emailRedirectTo: undefined,
        },
      });

      if (authError) throw authError;

      toast.success('Patient account created successfully!');
      setFormData({ fullName: '', email: '', password: '', patientIdNumber: '' });
      onPatientCreated();
    } catch (error: any) {
      toast.error('Error creating patient: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Patient
        </CardTitle>
        <CardDescription>
          Create a new patient account in the medical portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient-id">Patient ID Number</Label>
            <Input
              id="patient-id"
              type="text"
              placeholder="Enter unique patient ID number"
              value={formData.patientIdNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, patientIdNumber: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="patient-name">Patient Full Name</Label>
            <Input
              id="patient-name"
              type="text"
              placeholder="Enter patient's full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="patient-email">Patient Email</Label>
            <Input
              id="patient-email"
              type="email"
              placeholder="Enter patient's email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="patient-password">Temporary Password</Label>
            <Input
              id="patient-password"
              type="password"
              placeholder="Create a temporary password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
            <strong>Note:</strong> The patient will receive these credentials and should change their password upon first login.
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Patient...' : 'Create Patient Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientCreationForm;
