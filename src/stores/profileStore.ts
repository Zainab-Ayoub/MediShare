import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

export interface MedicalItem {
  id: string;
  title: string;
  date: string;
  type: 'prescription' | 'report' | 'diagnosis';
  details: string;
}

export interface EmergencyProfile {
  id: string;
  fullName: string;
  bloodType: string;
  allergies: string[];
  contactName: string;
  contactPhone: string;
  // New Rich Data
  medications: MedicalItem[];
  reports: MedicalItem[];
  history: MedicalItem[];
  hash?: string;
}

interface ProfileState {
  profile: EmergencyProfile | null;
  createProfile: (data: Partial<EmergencyProfile>) => void;
  clearProfile: () => void;
  addItem: (section: 'medications' | 'reports' | 'history', item: Omit<MedicalItem, 'id'>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      
      createProfile: (data) => {
        const id = Date.now().toString(); // Simple ID
        const newProfile: EmergencyProfile = {
          id,
          fullName: data.fullName || '',
          bloodType: data.bloodType || '',
          allergies: data.allergies || [],
          contactName: data.contactName || '',
          contactPhone: data.contactPhone || '',
          medications: data.medications || [],
          reports: data.reports || [],
          history: data.history || [],
        };
        
        // Hash only critical data for the QR/Blockchain to save space
        const criticalData = JSON.stringify({
          n: newProfile.fullName,
          b: newProfile.bloodType,
          a: newProfile.allergies
        });
        const hash = CryptoJS.SHA256(criticalData).toString();

        set({ profile: { ...newProfile, hash } });
      },

      addItem: (section, item) => {
        const current = get().profile;
        if (!current) return;
        
        const newItem: MedicalItem = { ...item, id: crypto.randomUUID() };
        
        set({
          profile: {
            ...current,
            [section]: [...current[section], newItem]
          }
        });
      },

      clearProfile: () => set({ profile: null }),
    }),
    { name: 'medishare-full-storage' }
  )
);