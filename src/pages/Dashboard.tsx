import { useProfileStore } from '../stores/profileStore';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { Scan } from 'lucide-react';

export default function Dashboard() {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black mb-4">NO PROFILE FOUND</h1>
        <Link to="/" className="btn-primary">CREATE PROFILE</Link>
      </div>
    );
  }

  // Embed data directly in QR for offline access
  const qrData = JSON.stringify({
    n: profile.fullName,
    b: profile.bloodType,
    a: profile.allergies,
    c: profile.contactPhone
  });

  return (
    <div className="min-h-screen bg-swiss-red flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full text-center">
        
        <div className="border-b-2 border-black pb-4 mb-6">
          <h2 className="font-black text-3xl">EMERGENCY</h2>
          <p className="font-mono text-xs">SCAN FOR MEDICAL DATA</p>
        </div>

        <div className="flex justify-center mb-6">
            {/* The white box is required for scanning contrast */}
            <div className="p-4 bg-white rounded-lg border-2 border-white/10"> 
                <QRCodeSVG value={qrData} size={200} level={"M"} />
            </div>
        </div>

        <div className="text-left space-y-2 font-mono text-sm border-t-2 border-black pt-4">
          <p><strong>NAME:</strong> {profile.fullName}</p>
          <p><strong>TYPE:</strong> <span className="text-swiss-red font-bold">{profile.bloodType}</span></p>
          <p className="truncate"><strong>HASH:</strong> {profile.hash?.slice(0, 12)}...</p>
          
          <div className="bg-green-100 text-green-800 p-2 mt-4 text-center text-xs border border-green-800 font-bold">
            ✓ SECURED ON QUBIC
          </div>
        </div>
      </div>

      <Link to="/scan" className="mt-8 bg-black text-white px-6 py-3 font-bold border-2 border-white flex items-center gap-2">
        <Scan size={20} /> TEST SCANNER
      </Link>
    </div>
  );
}