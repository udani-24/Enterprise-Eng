
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, User } from 'lucide-react';
console.log

interface Patient {
  id: string;
  full_name: string;
  patient_id_number: string;
}

interface PatientSearchProps {
  patients: Patient[];
  searchTerm: string;
  selectedPatient: Patient | null;
  onSearchChange: (value: string) => void;
  onPatientSelect: (patient: Patient) => void;
}

const PatientSearch = ({
  patients,
  searchTerm,
  selectedPatient,
  onSearchChange,
  onPatientSelect
}: PatientSearchProps) => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  // Update filteredPatients when patients prop changes
  React.useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  const handleFindPatient = () => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      setFilteredPatients(patients);
      return;
    }
    const results = patients.filter(patient => {
      const nameMatch = patient.full_name?.toLowerCase().includes(normalizedSearch);
      const idNumberMatch = patient.patient_id_number?.toLowerCase().includes(normalizedSearch);
      const internalIdMatch = patient.id?.toLowerCase().includes(normalizedSearch);
      return nameMatch || idNumberMatch || internalIdMatch;
    });
    setFilteredPatients(results);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Patient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search by name or ID</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Enter patient name or ID number..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="mt-1"
              />
              <button
                type="button"
                onClick={handleFindPatient}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-1 hover:bg-blue-700 transition"
              >
                Find Patient
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onPatientSelect(patient)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="font-medium">{patient.full_name}</span>
                    <span className="text-sm text-gray-500">ID: {patient.patient_id_number}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-8">No patients found.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSearch;
