import { EmergencyProfile } from '../types';
import { hashProfile } from './crypto';

const STORAGE_KEY = 'medishare_profiles';

// For hackathon: simple localStorage + API simulation
// In production: would use backend + IPFS

interface StoredProfile {
  profile: EmergencyProfile;
  hash: string;
  timestamp: number;
}

// Get all stored profiles (for demo/verifier access)
export function getStoredProfiles(): Map<string, StoredProfile> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return new Map();
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

// Store a profile
export function storeProfile(profile: EmergencyProfile): string {
  const profiles = getStoredProfiles();
  const hash = hashProfile(profile);
  
  profiles.set(profile.id, {
    profile,
    hash,
    timestamp: Date.now(),
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(profiles)));
  return hash;
}

// Get a profile by ID
export function getProfile(profileId: string): StoredProfile | null {
  const profiles = getStoredProfiles();
  return profiles.get(profileId) || null;
}

// Verify a profile exists and hash matches
export function verifyProfile(profileId: string, expectedHash: string): {
  valid: boolean;
  profile: EmergencyProfile | null;
  error?: string;
} {
  const stored = getProfile(profileId);
  
  if (!stored) {
    return { valid: false, profile: null, error: 'Profile not found' };
  }
  
  const computedHash = hashProfile(stored.profile);
  
  if (computedHash !== expectedHash) {
    return { valid: false, profile: null, error: 'Hash mismatch - profile may have been tampered' };
  }
  
  return { valid: true, profile: stored.profile };
}