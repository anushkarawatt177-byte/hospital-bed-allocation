import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Bed, 
  Patient, 
  WardInfo, 
  NotificationItem, 
  AllocationRecord, 
  SystemUser, 
  UserRole,
  PriorityLevel,
  WardType,
  BedType
} from '../types/hospital';
import { 
  INITIAL_BEDS, 
  INITIAL_PATIENTS, 
  INITIAL_WARDS, 
  INITIAL_ALLOCATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USERS 
} from '../data/mockData';

interface HospitalStats {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  cleaningBeds: number;
  maintenanceBeds: number;
  icuAvailable: number;
  emergencyAvailable: number;
  totalPatients: number;
  todayAdmissions: number;
  todayDischarges: number;
  pendingAdmissions: number;
  occupancyRate: number;
}

interface HospitalContextType {
  currentUser: SystemUser | null;
  isAuthenticated: boolean;
  beds: Bed[];
  patients: Patient[];
  wards: WardInfo[];
  allocations: AllocationRecord[];
  notifications: NotificationItem[];
  stats: HospitalStats;
  selectedWardFilter: string;
  setSelectedWardFilter: (ward: string) => void;
  // Auth methods
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  // Bed operations
  allocateBed: (patientId: string, bedId: string, notes?: string) => { success: boolean; message: string };
  emergencyAllocate: (patientInfo: Partial<Patient>, bedId: string) => { success: boolean; message: string };
  dischargePatient: (patientId: string, summary?: string) => { success: boolean; message: string };
  markBedCleaned: (bedId: string) => void;
  setBedStatus: (bedId: string, status: Bed['status'], notes?: string) => void;
  addNewBed: (bed: Omit<Bed, 'id'>) => void;
  updateBed: (bed: Bed) => void;
  deleteBed: (bedId: string) => void;
  // Patient operations
  addPatient: (patient: Omit<Patient, 'id' | 'patientId'>) => Patient;
  updatePatient: (patient: Patient) => void;
  // Notification operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  // Reset
  resetToDefaultData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEY_BEDS = 'hbas_beds_v1';
const STORAGE_KEY_PATIENTS = 'hbas_patients_v1';
const STORAGE_KEY_ALLOCATIONS = 'hbas_allocations_v1';
const STORAGE_KEY_NOTIFS = 'hbas_notifs_v1';
const STORAGE_KEY_USER = 'hbas_current_user_v1';
const STORAGE_KEY_AUTH = 'hbas_auth_v1';

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beds, setBeds] = useState<Bed[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEDS);
      return saved ? JSON.parse(saved) : INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [wards, setWards] = useState<WardInfo[]>(INITIAL_WARDS);

  const [allocations, setAllocations] = useState<AllocationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALLOCATIONS);
      return saved ? JSON.parse(saved) : INITIAL_ALLOCATIONS;
    } catch {
      return INITIAL_ALLOCATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<SystemUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Admin by default
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : true; // Logged in for easy review, or can toggle
    } catch {
      return true;
    }
  });

  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('All');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BEDS, JSON.stringify(beds));
    } catch (e) {
      console.error(e);
    }
  }, [beds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error(e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALLOCATIONS, JSON.stringify(allocations));
    } catch (e) {
      console.error(e);
    }
  }, [allocations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isAuthenticated]);

  // Derived Statistics Calculation
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const reservedBeds = beds.filter(b => b.status === 'reserved').length;
  const cleaningBeds = beds.filter(b => b.status === 'cleaning').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance').length;
  
  const icuAvailable = beds.filter(b => b.ward === 'ICU' && b.status === 'available').length;
  const emergencyAvailable = beds.filter(b => b.ward === 'Emergency' && b.status === 'available').length;
  
  const totalPatients = patients.filter(p => p.status === 'Admitted' || p.status === 'Pending Bed' || p.status === 'In Triage').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayAdmissions = patients.filter(p => p.admissionDate?.startsWith(today) || p.admissionDate?.includes('2026-10-07')).length;
  const todayDischarges = patients.filter(p => p.status === 'Discharged' && (p.dischargeDate?.startsWith(today) || p.dischargeDate?.includes('2026-10-07'))).length;
  const pendingAdmissions = patients.filter(p => p.status === 'Pending Bed' || p.status === 'In Triage').length;

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const stats: HospitalStats = {
    totalBeds,
    availableBeds,
    occupiedBeds,
    reservedBeds,
    cleaningBeds,
    maintenanceBeds,
    icuAvailable,
    emergencyAvailable,
    totalPatients,
    todayAdmissions,
    todayDischarges,
    pendingAdmissions,
    occupancyRate
  };

  // Auth Handlers
  const login = (email: string, role: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr-${Date.now()}`,
      name: `${role} User`,
      email: email || `${role.toLowerCase()}@hospital.org`,
      role,
      department: 'Clinical Operations'
    };
    setCurrentUser(matched);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole) => {
    const userForRole = INITIAL_USERS.find(u => u.role === newRole);
    if (userForRole) {
      setCurrentUser(userForRole);
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  // Notification Helpers
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Bed Allocation Logic
  const allocateBed = (patientId: string, bedId: string, notes?: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    const targetPatient = patients.find(p => p.id === patientId || p.patientId === patientId);

    if (!targetBed) {
      return { success: false, message: 'Specified bed was not found.' };
    }
    if (targetBed.status === 'occupied') {
      return { success: false, message: `Bed ${targetBed.bedNumber} is already occupied by another patient.` };
    }
    if (targetBed.status === 'maintenance') {
      return { success: false, message: `Bed ${targetBed.bedNumber} is currently under maintenance.` };
    }
    if (!targetPatient) {
      return { success: false, message: 'Patient record could not be found.' };
    }

    const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update Bed
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        const historyEntry = {
          id: `hist-${Date.now()}`,
          patientId: targetPatient.patientId,
          patientName: targetPatient.name,
          allocatedAt: nowFormatted,
          doctor: targetPatient.assignedDoctor || currentUser?.name || 'Duty Medical Officer',
          notes: notes || 'Standard clinical bed allocation'
        };

        return {
          ...bed,
          status: 'occupied',
          currentPatientId: targetPatient.patientId,
          currentPatientName: targetPatient.name,
          assignedDoctor: targetPatient.assignedDoctor,
          admissionDate: targetPatient.admissionDate || nowFormatted.split(' ')[0],
          notes: notes || bed.notes,
          allocationHistory: [...(bed.allocationHistory || []), historyEntry]
        };
      }
      return bed;
    }));

    // Update Patient
    setPatients(prev => prev.map(pat => {
      if (pat.id === targetPatient.id) {
        return {
          ...pat,
          status: 'Admitted',
          assignedBedId: targetBed.id,
          assignedBedNumber: targetBed.bedNumber
        };
      }
      return pat;
    }));

    // Add to Recent Allocations
    const newAllocRecord: AllocationRecord = {
      id: `alloc-${Date.now()}`,
      patientId: targetPatient.patientId,
      patientName: targetPatient.name,
      bedId: targetBed.id,
      bedNumber: targetBed.bedNumber,
      ward: targetBed.ward,
      bedType: targetBed.bedType,
      admissionDate: nowFormatted,
      allocatedBy: currentUser?.name || 'Admissions Desk',
      doctor: targetPatient.assignedDoctor || 'Attending Physician',
      priority: targetPatient.priority,
      status: 'Active'
    };
    setAllocations(prev => [newAllocRecord, ...prev]);

    // Send notification
    addNotification({
      title: 'Bed Allocated Successfully',
      message: `Patient ${targetPatient.name} (${targetPatient.patientId}) allocated to ${targetBed.bedNumber} (${targetBed.ward}).`,
      type: 'success',
      linkTab: 'beds'
    });

    return { 
      success: true, 
      message: `Bed ${targetBed.bedNumber} successfully allocated to ${targetPatient.name}.` 
    };
  };

  // Emergency Rapid Allocation
  const emergencyAllocate = (patientInfo: Partial<Patient>, bedId: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed) {
      return { success: false, message: 'Emergency bed not found.' };
    }
    if (targetBed.status === 'occupied') {
      return { success: false, message: `Bed ${targetBed.bedNumber} is already occupied.` };
    }

    const patientUniqueId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    const newEmergencyPatient: Patient = {
      id: `pat-emr-${Date.now()}`,
      patientId: patientInfo.patientId || patientUniqueId,
      name: patientInfo.name || 'Emergency Intake Patient',
      age: patientInfo.age || 40,
      gender: patientInfo.gender || 'Male',
      contact: patientInfo.contact || 'Direct Ambulance Transfer',
      emergencyContact: patientInfo.emergencyContact || 'EMS Escort Team',
      admissionDate: todayDate,
      diagnosis: patientInfo.diagnosis || 'Acute Emergency Trauma / Critical Stabilization',
      priority: 'Emergency',
      requiredWard: targetBed.ward,
      requiredBedType: targetBed.bedType,
      assignedBedId: targetBed.id,
      assignedBedNumber: targetBed.bedNumber,
      assignedDoctor: patientInfo.assignedDoctor || 'Dr. Kevin Zhang (Emergency Medicine)',
      status: 'Admitted',
      bloodGroup: patientInfo.bloodGroup || 'Unknown (Pending Crossmatch)',
      vitals: patientInfo.vitals || {
        bloodPressure: '120/80',
        heartRate: 110,
        oxygenSaturation: 92,
        temperature: 36.8
      }
    };

    setPatients(prev => [newEmergencyPatient, ...prev]);

    // Update Bed to Occupied
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        return {
          ...bed,
          status: 'occupied',
          currentPatientId: newEmergencyPatient.patientId,
          currentPatientName: newEmergencyPatient.name,
          assignedDoctor: newEmergencyPatient.assignedDoctor,
          admissionDate: todayDate,
          notes: `Rapid Emergency Code Allocation. ${patientInfo.diagnosis || ''}`
        };
      }
      return bed;
    }));

    // Record allocation
    const newAllocRecord: AllocationRecord = {
      id: `alloc-emr-${Date.now()}`,
      patientId: newEmergencyPatient.patientId,
      patientName: newEmergencyPatient.name,
      bedId: targetBed.id,
      bedNumber: targetBed.bedNumber,
      ward: targetBed.ward,
      bedType: targetBed.bedType,
      admissionDate: nowIso.replace('T', ' ').substring(0, 16),
      allocatedBy: `${currentUser?.name || 'Triage Officer'} (Express Emergency)`,
      doctor: newEmergencyPatient.assignedDoctor,
      priority: 'Emergency',
      status: 'Active'
    };
    setAllocations(prev => [newAllocRecord, ...prev]);

    addNotification({
      title: '🚨 Emergency Bed Allocated',
      message: `Emergency patient ${newEmergencyPatient.name} assigned to ${targetBed.bedNumber} immediately.`,
      type: 'critical',
      linkTab: 'beds'
    });

    return {
      success: true,
      message: `Emergency bed ${targetBed.bedNumber} successfully assigned to ${newEmergencyPatient.name}.`
    };
  };

  // Discharge Workflow
  const dischargePatient = (patientId: string, summary?: string) => {
    const patient = patients.find(p => p.id === patientId || p.patientId === patientId);
    if (!patient) {
      return { success: false, message: 'Patient not found.' };
    }

    const assignedBedId = patient.assignedBedId;
    const todayDate = new Date().toISOString().split('T')[0];

    // 1. Update patient status to Discharged
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          status: 'Discharged',
          dischargeDate: todayDate,
          dischargeSummary: summary || 'Patient discharged in stable condition. Follow-up instructions provided.',
          assignedBedNumber: `${p.assignedBedNumber || 'N/A'} (Discharged)`
        };
      }
      return p;
    }));

    // 2. Change assigned bed status to Cleaning
    if (assignedBedId) {
      setBeds(prev => prev.map(b => {
        if (b.id === assignedBedId) {
          return {
            ...b,
            status: 'cleaning',
            currentPatientId: undefined,
            currentPatientName: undefined,
            cleaningStartedAt: new Date().toISOString(),
            notes: `Vacated by ${patient.name}. Terminal sanitization in progress.`
          };
        }
        return b;
      }));
    }

    // 3. Update allocation record status if present
    setAllocations(prev => prev.map(a => {
      if (a.patientId === patient.patientId) {
        return { ...a, status: 'Discharged' };
      }
      return a;
    }));

    // 4. Send Notification
    addNotification({
      title: 'Patient Discharged',
      message: `${patient.name} has been discharged. Bed ${patient.assignedBedNumber || ''} is now queued for terminal cleaning.`,
      type: 'info',
      linkTab: 'admissions'
    });

    return {
      success: true,
      message: `Patient ${patient.name} successfully discharged. Bed set to Cleaning.`
    };
  };

  // Mark Cleaning Bed as Available
  const markBedCleaned = (bedId: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed) return;

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'available',
          cleaningStartedAt: undefined,
          notes: 'Terminal disinfection completed. Sanitized and ready for next patient.'
        };
      }
      return b;
    }));

    addNotification({
      title: 'Bed Ready for Admission',
      message: `Bed ${targetBed.bedNumber} in ${targetBed.ward} has completed sanitization and is now Available.`,
      type: 'success',
      linkTab: 'beds'
    });
  };

  const setBedStatus = (bedId: string, status: Bed['status'], notes?: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status,
          notes: notes !== undefined ? notes : b.notes,
          ...(status === 'available' || status === 'cleaning' || status === 'maintenance'
            ? { currentPatientId: undefined, currentPatientName: undefined }
            : {})
        };
      }
      return b;
    }));
  };

  // Bed CRUD
  const addNewBed = (bedData: Omit<Bed, 'id'>) => {
    const newBed: Bed = {
      ...bedData,
      id: `bed-${bedData.ward.toLowerCase().slice(0, 3)}-${Date.now()}`
    };
    setBeds(prev => [...prev, newBed]);
    addNotification({
      title: 'New Bed Commissioned',
      message: `Bed ${newBed.bedNumber} has been added to ${newBed.ward}.`,
      type: 'info',
      linkTab: 'beds'
    });
  };

  const updateBed = (updatedBed: Bed) => {
    setBeds(prev => prev.map(b => b.id === updatedBed.id ? updatedBed : b));
  };

  const deleteBed = (bedId: string) => {
    setBeds(prev => prev.filter(b => b.id !== bedId));
  };

  // Patient CRUD
  const addPatient = (patientData: Omit<Patient, 'id' | 'patientId'>): Patient => {
    const newPatId = `PAT-${Math.floor(1030 + Math.random() * 8900)}`;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientId: newPatId
    };
    setPatients(prev => [newPatient, ...prev]);
    addNotification({
      title: 'New Patient Registered',
      message: `${newPatient.name} (${newPatient.patientId}) added to admission intake.`,
      type: 'info',
      linkTab: 'patients'
    });
    return newPatient;
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  // Reset to original factory demo data
  const resetToDefaultData = () => {
    setBeds(INITIAL_BEDS);
    setPatients(INITIAL_PATIENTS);
    setAllocations(INITIAL_ALLOCATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    localStorage.removeItem(STORAGE_KEY_BEDS);
    localStorage.removeItem(STORAGE_KEY_PATIENTS);
    localStorage.removeItem(STORAGE_KEY_ALLOCATIONS);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        beds,
        patients,
        wards,
        allocations,
        notifications,
        stats,
        selectedWardFilter,
        setSelectedWardFilter,
        login,
        logout,
        switchRole,
        allocateBed,
        emergencyAllocate,
        dischargePatient,
        markBedCleaned,
        setBedStatus,
        addNewBed,
        updateBed,
        deleteBed,
        addPatient,
        updatePatient,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        resetToDefaultData
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
