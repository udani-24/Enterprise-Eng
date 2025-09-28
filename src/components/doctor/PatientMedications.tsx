import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  full_name: string;
  patient_id_number: string;
}

interface PatientHistory {
  id: string;
  visit_date: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  patient_id: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface PatientMedicationsProps {
  selectedPatient: Patient;
  patientHistories: PatientHistory[];
  loading: boolean;
}

const PatientMedications = ({
  selectedPatient,
  patientHistories,
  loading
}: PatientMedicationsProps) => {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });

  const commonMedications = [
    'Metformin',
    'Lisinopril',
    'Amlodipine',
    'Aspirin',
    'Ibuprofen',
    'Amoxicillin',
    'Omeprazole',
    'Albuterol',
    'Acetaminophen',
    'Prednisone',
    'Cetirizine',
    'Simvastatin'
  ];

  const commonDosages = [
    '5mg',
    '10mg',
    '20mg',
    '25mg',
    '50mg',
    '100mg',
    '250mg',
    '500mg',
    '1000mg'
  ];

  const commonFrequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const commonDurations = [
    '3 days',
    '7 days',
    '10 days',
    '14 days',
    '30 days',
    '60 days',
    '90 days',
    'Ongoing',
    'Until next visit'
  ];

  // Extract medications from prescription history
  const currentMedications = patientHistories
    .filter(history => history.prescription)
    .map(history => ({
      date: history.visit_date,
      prescription: history.prescription,
      diagnosis: history.diagnosis
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleMedicationChange = (field: keyof Medication, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMedication = async () => {
    if (!selectedPatient) return;
    try {
      const prescriptionText = `${newMedication.name} ${newMedication.dosage} - ${newMedication.frequency}, ${newMedication.duration}`;
      const { error } = await supabase
        .from('patient_histories')
        .insert({
          patient_id: selectedPatient.id,
          doctor_id: null, // TODO: set doctor_id if available
          notes: newMedication.notes,
          diagnosis: '',
          prescription: prescriptionText,
          visit_date: new Date().toISOString()
        });
      if (error) throw error;
      // Optionally, reload or notify
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: ''
      });
      // Optionally, show a success message or reload patient histories
      window.location.reload(); // Simple reload to reflect changes
    } catch (err) {
      // Optionally, show an error message
      console.error('Error adding medication:', err);
    }
  };

  const isFormValid = newMedication.name && newMedication.dosage && newMedication.frequency;

  return (
    <div className="space-y-6">
      {/* Current Medications from History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Current Medications from Medical History
          </CardTitle>
          <CardDescription>
            Medications prescribed in previous visits for {selectedPatient.full_name} (ID: {selectedPatient.patient_id_number})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading medications...</p>
            </div>
          ) : currentMedications.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Medications Found
              </h3>
              <p className="text-gray-600">
                No prescriptions have been recorded for this patient yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMedications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {new Date(med.date).toLocaleDateString()}
                        </Badge>
                        {med.diagnosis && (
                          <Badge variant="secondary">{med.diagnosis}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {med.prescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Medication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Medication
          </CardTitle>
          <CardDescription>
            Add a new medication to {selectedPatient.full_name}'s treatment plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medication Name */}
            <div className="space-y-2">
              <Label htmlFor="medication-select">Select Medication</Label>
              <Select onValueChange={(value) => handleMedicationChange('name', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose medication..." />
                </SelectTrigger>
                <SelectContent>
                  {commonMedications.map((med) => (
                    <SelectItem key={med} value={med}>
                      {med}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="custom-medication">Or enter custom medication</Label>
              <Input
                id="custom-medication"
                placeholder="Enter medication name..."
                value={newMedication.name}
                onChange={(e) => handleMedicationChange('name', e.target.value)}
              />
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label htmlFor="dosage-select">Select Dosage</Label>
              <Select onValueChange={(value) => handleMedicationChange('dosage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose dosage..." />
                </SelectTrigger>
                <SelectContent>
                  {commonDosages.map((dosage) => (
                    <SelectItem key={dosage} value={dosage}>
                      {dosage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="custom-dosage">Or enter custom dosage</Label>
              <Input
                id="custom-dosage"
                placeholder="Enter dosage..."
                value={newMedication.dosage}
                onChange={(e) => handleMedicationChange('dosage', e.target.value)}
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select onValueChange={(value) => handleMedicationChange('frequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose frequency..." />
                </SelectTrigger>
                <SelectContent>
                  {commonFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select onValueChange={(value) => handleMedicationChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose duration..." />
                </SelectTrigger>
                <SelectContent>
                  {commonDurations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <Label htmlFor="medication-notes">Additional Notes</Label>
            <textarea
              id="medication-notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Special instructions, warnings, interactions..."
              value={newMedication.notes}
              onChange={(e) => handleMedicationChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={addMedication}
            disabled={!isFormValid}
            className="w-full mt-4"
          >
            Add Medication to Treatment Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMedications;