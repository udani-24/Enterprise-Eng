
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Pill } from 'lucide-react';

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
}

interface PatientHistoryViewProps {
  selectedPatient: Patient;
  patientHistories: PatientHistory[];
  loading: boolean;
}

const PatientHistoryView = ({ selectedPatient, patientHistories, loading }: PatientHistoryViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Medical History
        </CardTitle>
        <CardDescription>
          Complete medical record history for {selectedPatient.full_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : patientHistories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medical records found
          </div>
        ) : (
          <div className="space-y-4">
            {patientHistories.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {new Date(record.visit_date).toLocaleDateString()}
                    </span>
                  </div>
                  {record.doctor_profile?.full_name && (
                    <Badge variant="secondary">
                      Dr. {record.doctor_profile.full_name}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  {record.diagnosis && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Diagnosis</h4>
                      <p className="text-gray-900">{record.diagnosis}</p>
                    </div>
                  )}
                  
                  {record.prescription && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        Prescription
                      </h4>
                      <p className="text-gray-900">{record.prescription}</p>
                    </div>
                  )}
                  
                  {record.notes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Notes</h4>
                      <p className="text-gray-600">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientHistoryView;
