/**
 * Qubic Blockchain Integration
 * 
 * For the hackathon, we'll create a mock that simulates Qubic transactions.
 * In production, this would use the actual Qubic SDK.
 */

import { hashProfile } from './crypto';
import { EmergencyProfile, ProfileHash } from '../types';

// Simulated on-chain storage (in memory for demo)
const onChainProfiles = new Map<string, ProfileHash>();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Register a profile hash on Qubic
 */
export async function registerProfileOnQubic(
  profile: EmergencyProfile
): Promise<{ txHash: string; profileHash: string }> {
  // Simulate transaction time
  await delay(1500 + Math.random() * 1000);
  
  const profileHash = hashProfile(profile);
  
  // Store on "chain" (simulated)
  onChainProfiles.set(profile.id, {
    profileId: profile.id,
    hash: profileHash,
    timestamp: Date.now(),
    ownerAddress: profile.ownerAddress,
  });
  
  // Generate mock transaction hash
  const txHash = `qubic_${Date.now()}_${profile.id.slice(0, 8)}`;
  
  console.log('[Qubic] Profile registered:', {
    profileId: profile.id,
    hash: profileHash,
    txHash,
  });
  
  return { txHash, profileHash };
}

/**
 * Verify a profile hash on Qubic
 */
export async function verifyProfileOnQubic(
  profileId: string,
  expectedHash: string
): Promise<{
  verified: boolean;
  onChainHash: string | null;
  timestamp: number | null;
}> {
  // Simulate RPC call
  await delay(500 + Math.random() * 500);
  
  const stored = onChainProfiles.get(profileId);
  
  if (!stored) {
    return { verified: false, onChainHash: null, timestamp: null };
  }
  
  return {
    verified: stored.hash === expectedHash,
    onChainHash: stored.hash,
    timestamp: stored.timestamp,
  };
}

/**
 * Get Qubic testnet explorer URL
 */
export function getExplorerUrl(txHash: string): string {
  // Replace with actual Qubic explorer when available
  return `https://explorer.qubic.org/tx/${txHash}`;
}

/**
 * Check if connected to Qubic testnet
 */
export async function checkQubicConnection(): Promise<boolean> {
  await delay(200);
  return true; // Always connected in simulation
}

// ============================================
// ACTUAL QUBIC INTEGRATION (uncomment when ready)
// ============================================

/*
import { QubicClient } from '@qubic/sdk'; // hypothetical SDK

const client = new QubicClient({
  network: 'testnet',
  rpcUrl: 'https://testnet.qubic.org/rpc',
});

export async function registerProfileOnQubic(
  profile: EmergencyProfile,
  signer: any // wallet signer
): Promise<{ txHash: string; profileHash: string }> {
  const profileHash = hashProfile(profile);
  
  // Build transaction
  const tx = await client.buildTransaction({
    type: 'STORE_DATA',
    data: {
      key: `medishare:profile:${profile.id}`,
      value: profileHash,
    },
  });
  
  // Sign and submit
  const signedTx = await signer.signTransaction(tx);
  const result = await client.submitTransaction(signedTx);
  
  return {
    txHash: result.txHash,
    profileHash,
  };
}
*/