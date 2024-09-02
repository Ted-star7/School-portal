// student.model.ts
export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  religion: string;
  admissionNumber: string;
  email: string;
  emergencyContact: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  address: string;
  studentClass: string;
  pfpUrl: string;
  photo: string;
  progress?: any;
}

