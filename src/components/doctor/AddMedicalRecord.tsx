
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
}

interface NewRecord {
  notes: string;
  diagnosis: string;
  prescription: string;
}

interface AddMedicalRecordProps {
  selectedPatient: Patient;
  newRecord: NewRecord;
  loading: boolean;
  onRecordChange: (field: keyof NewRecord, value: string) => void;
  onAddRecord: () => void;
}

const AddMedicalRecord = ({
  selectedPatient,
  newRecord,
  loading,
  onRecordChange,
  onAddRecord
}: AddMedicalRecordProps) => {
  const commonDiagnoses = [
    'Hypertension (High Blood Pressure)',
    'Type 2 Diabetes',
    'Type 1 Diabetes',
    'Hypotension (Low Blood Pressure)',
    'Upper Respiratory Infection',
    'Migraine',
    'Anxiety Disorder',
    'Depression',
    'Asthma',
    'Arthritis',
    'Gastroenteritis',
    'Urinary Tract Infection',
    'Allergic Reaction',
    'Bronchitis',
    'Sinusitis'
  ];

  const commonPrescriptions = [
    'Metformin 500mg - Take twice daily with meals',
    'Lisinopril 10mg - Take once daily in the morning',
    'Amlodipine 5mg - Take once daily',
    'Aspirin 81mg - Take once daily with food',
    'Ibuprofen 400mg - Take as needed for pain (max 3 times daily)',
    'Amoxicillin 500mg - Take three times daily for 7 days',
    'Omeprazole 20mg - Take once daily before breakfast',
    'Albuterol Inhaler - Use as needed for breathing difficulty',
    'Acetaminophen 500mg - Take as needed for pain/fever',
    'Prednisone 20mg - Take as directed by physician',
    'Cetirizine 10mg - Take once daily for allergies',
    'Simvastatin 20mg - Take once daily at bedtime'
  ];

  const severityLevels = [
    'Mild',
    'Moderate',
    'Severe',
    'Critical'
  ];

  const vitalSigns = [
    'Blood Pressure: Normal (120/80)',
    'Blood Pressure: High (140/90+)',
    'Blood Pressure: Low (90/60-)',
    'Heart Rate: Normal (60-100 bpm)',
    'Heart Rate: Elevated (100+ bpm)',
    'Heart Rate: Low (below 60 bpm)',
    'Temperature: Normal (98.6°F)',
    'Temperature: Fever (100.4°F+)',
    'Oxygen Saturation: Normal (95-100%)',
    'Oxygen Saturation: Low (below 95%)'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Medical Record
        </CardTitle>
        <CardDescription>
          Add a new medical record for {selectedPatient.full_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Diagnosis Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosis-select">Select Common Diagnosis</Label>
              <Select onValueChange={(value) => onRecordChange('diagnosis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a common diagnosis..." />
                </SelectTrigger>
                <SelectContent>
                  {commonDiagnoses.map((diagnosis) => (
                    <SelectItem key={diagnosis} value={diagnosis}>
                      {diagnosis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="diagnosis">Or Enter Custom Diagnosis</Label>
              <Input
                id="diagnosis"
                placeholder="Enter custom diagnosis..."
                value={newRecord.diagnosis}
                onChange={(e) => onRecordChange('diagnosis', e.target.value)}
              />
            </div>
          </div>

          {/* Prescription Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="prescription-select">Select Common Prescription</Label>
              <Select onValueChange={(value) => onRecordChange('prescription', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a common prescription..." />
                </SelectTrigger>
                <SelectContent>
                  {commonPrescriptions.map((prescription) => (
                    <SelectItem key={prescription} value={prescription}>
                      {prescription}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prescription">Or Enter Custom Prescription</Label>
              <Input
                id="prescription"
                placeholder="Enter custom prescription..."
                value={newRecord.prescription}
                onChange={(e) => onRecordChange('prescription', e.target.value)}
              />
            </div>
          </div>

          {/* Quick Add Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="severity">Condition Severity</Label>
              <Select onValueChange={(value) => {
                const currentNotes = newRecord.notes;
                const severityNote = `Severity: ${value}`;
                const updatedNotes = currentNotes ? `${currentNotes}\n${severityNote}` : severityNote;
                onRecordChange('notes', updatedNotes);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity..." />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vitals">Add Vital Signs</Label>
              <Select onValueChange={(value) => {
                const currentNotes = newRecord.notes;
                const vitalNote = `Vital Signs - ${value}`;
                const updatedNotes = currentNotes ? `${currentNotes}\n${vitalNote}` : vitalNote;
                onRecordChange('notes', updatedNotes);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Add vital signs..." />
                </SelectTrigger>
                <SelectContent>
                  {vitalSigns.map((vital) => (
                    <SelectItem key={vital} value={vital}>
                      {vital}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Additional notes, observations, follow-up instructions..."
              value={newRecord.notes}
              onChange={(e) => onRecordChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={onAddRecord}
            disabled={loading || !newRecord.diagnosis}
            className="w-full"
          >
            {loading ? 'Adding Record...' : 'Add Medical Record'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddMedicalRecord;
