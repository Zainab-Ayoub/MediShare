export interface EmergencyProfile {
  id: string;
  version: number;
  
  // Core emergency info
  fullName: string;
  dateOfBirth: string;
  bloodType: BloodType;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  
  // Emergency contact
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Optional
  organDonor: boolean;
  notes: string;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  ownerAddress: string;
}

export type BloodType = 
  | 'A+' | 'A-' 
  | 'B+' | 'B-' 
  | 'AB+' | 'AB-' 
  | 'O+' | 'O-'
  | 'Unknown';

export interface ProfileHash {
  profileId: string;
  hash: string;
  timestamp: number;
  ownerAddress: string;
}

export interface AccessGrant {
  profileId: string;
  grantedTo: string;
  expiresAt: number;
  createdAt: number;
  revoked: boolean;
}

export interface QRData {
  version: number;
  profileId: string;
  // Embedded emergency data for offline access
  emergency: {
    bloodType: BloodType;
    allergies: string[];
    contact: string;
  };
  verifyUrl: string;
  timestamp: number;
}

export interface VerificationResult {
  valid: boolean;
  profile: EmergencyProfile | null;
  onChainHash: string | null;
  computedHash: string;
  timestamp: number;
  error?: string;
}