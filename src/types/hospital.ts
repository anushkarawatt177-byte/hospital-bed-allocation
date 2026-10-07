export type BedStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';

export type WardType = 
  | 'General Ward' 
  | 'ICU' 
  | 'Emergency' 
  | 'Pediatric' 
  | 'Private Ward' 
  | 'Semi-Private Ward';

export type BedType = 
  | 'Standard Bed' 
  | 'ICU Bed with Ventilator' 
  | 'ICU High Dependency' 
  | 'Emergency Trauma Bed' 
  | 'Oxygen Supported Bed' 
  | 'Pediatric Crib' 
  | 'Deluxe Private Suite' 
  | 'Isolation Bed';

export type PriorityLevel = 'Emergency' | 'High' | 'Normal';

export type PatientStatus = 'Admitted' | 'Pending Bed' | 'Discharged' | 'In Triage';

export type UserRole = 'Admin' | 'Doctor' | 'Staff';

export interface Bed {
  id: string;
  bedNumber: string;
  ward: WardType;
  bedType: BedType;
  floor: string;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  assignedDoctor?: string;
  admissionDate?: string;
  equipment: string[];
  cleaningStartedAt?: string;
  notes?: string;
  allocationHistory?: {
    id: string;
    patientId: string;
    patientName: string;
    allocatedAt: string;
    dischargedAt?: string;
    doctor: string;
    notes?: string;
  }[];
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  emergencyContact: string;
  admissionDate: string;
  diagnosis: string;
  priority: PriorityLevel;
  requiredWard: WardType;
  requiredBedType: BedType;
  assignedBedId?: string;
  assignedBedNumber?: string;
  assignedDoctor: string;
  status: PatientStatus;
  bloodGroup: string;
  allergies?: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
    temperature: number;
  };
  dischargeDate?: string;
  dischargeSummary?: string;
}

export interface WardInfo {
  id: string;
  name: WardType;
  totalBeds: number;
  floor: string;
  headNurse: string;
  contactExt: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface AllocationRecord {
  id: string;
  patientId: string;
  patientName: string;
  bedId: string;
  bedNumber: string;
  ward: WardType;
  bedType: BedType;
  admissionDate: string;
  allocatedBy: string;
  doctor: string;
  priority: PriorityLevel;
  status: 'Active' | 'Discharged' | 'Transferred';
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}
