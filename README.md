# MediShare - Qubic Hackathon Submission

MediShare is a decentralized emergency medical profile system. It allows patients to own their data and gives first responders instant, verified access to critical information via a QR code.

## Key Features
- **Privacy First:** Medical data is stored locally/IPFS, not on a central database.
- **Qubic Verification:** Uses Qubic to store an immutable hash of the profile, preventing data tampering.
- **Offline Capable:** Critical info (Blood type, Allergies) is embedded directly into the QR code payload.
- **Zero-Knowledge UI:** Designed for high-stress environments. No scrolling, high contrast, dark mode.

## Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (Cyberpunk/Dark Mode)
- **State:** Zustand (Persisted Storage)
- **Crypto:** SHA-256 Hashing for Integrity Check

## Demo
[Link to your Vercel App]