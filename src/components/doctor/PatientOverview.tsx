
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';
import PatientHistoryView from './PatientHistoryView';
import AddMedicalRecord from './AddMedicalRecord';
import PatientMedications from './PatientMedications';

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

interface NewRecord {
  notes: string;
  diagnosis: string;
  prescription: string;
}

interface PatientOverviewProps {
  selectedPatient: Patient | null;
  patientHistories: PatientHistory[];
  newRecord: NewRecord;
  loading: boolean;
  onRecordChange: (field: keyof NewRecord, value: string) => void;
  onAddRecord: () => void;
}

const PatientOverview = ({
  selectedPatient,
  patientHistories,
  newRecord,
  loading,
  onRecordChange,
  onAddRecord
}: PatientOverviewProps) => {
  if (!selectedPatient) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a Patient
          </h3>
          <p className="text-gray-600">
            Choose a patient from the list to view their medical history
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="history" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedPatient.full_name}
            </h2>
            <p className="text-gray-600">
              Patient ID: <span className="font-medium text-gray-800">{selectedPatient.patient_id_number}</span> • Medical Records
            </p>
          </div>
        </div>
        <TabsList>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="add-record">Add Record</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="history">
        <PatientHistoryView
          selectedPatient={selectedPatient}
          patientHistories={patientHistories}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="add-record">
        <AddMedicalRecord
          selectedPatient={selectedPatient}
          newRecord={newRecord}
          loading={loading}
          onRecordChange={onRecordChange}
          onAddRecord={onAddRecord}
        />
      </TabsContent>

      <TabsContent value="medications">
        <PatientMedications
          selectedPatient={selectedPatient}
          patientHistories={patientHistories}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PatientOverview;
