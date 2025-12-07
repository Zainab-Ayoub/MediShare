import CryptoJS from 'crypto-js';
import { EmergencyProfile, QRData } from '../types';

// Generate a deterministic hash of the profile
export function hashProfile(profile: EmergencyProfile): string {
  // Create a canonical string representation
  const canonical = JSON.stringify({
    id: profile.id,
    version: profile.version,
    fullName: profile.fullName,
    dateOfBirth: profile.dateOfBirth,
    bloodType: profile.bloodType,
    allergies: profile.allergies.sort(),
    medicalConditions: profile.medicalConditions.sort(),
    currentMedications: profile.currentMedications.sort(),
    emergencyContact: profile.emergencyContact,
    organDonor: profile.organDonor,
    notes: profile.notes,
    createdAt: profile.createdAt,
    ownerAddress: profile.ownerAddress,
  });
  
  return CryptoJS.SHA256(canonical).toString(CryptoJS.enc.Hex);
}

// Verify a profile against a hash
export function verifyProfileHash(profile: EmergencyProfile, hash: string): boolean {
  const computedHash = hashProfile(profile);
  return computedHash === hash;
}

// Generate QR data with embedded emergency info
export function generateQRData(profile: EmergencyProfile): QRData {
  return {
    version: 1,
    profileId: profile.id,
    emergency: {
      bloodType: profile.bloodType,
      allergies: profile.allergies.slice(0, 5), // Limit for QR size
      contact: profile.emergencyContact.phone,
    },
    verifyUrl: `${window.location.origin}/verify/${profile.id}`,
    timestamp: Date.now(),
  };
}

// Encode QR data to string
export function encodeQRData(data: QRData): string {
  return btoa(JSON.stringify(data));
}

// Decode QR data from string
export function decodeQRData(encoded: string): QRData | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

// Encrypt profile for storage (optional, for file attachments)
export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypt profile data
export function decryptData(encrypted: string, key: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}