// student.model.ts
export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string;
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
  pfpId: number;
  photo?: string;
  progress: any;
}