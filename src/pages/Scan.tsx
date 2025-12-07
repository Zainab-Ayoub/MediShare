import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, AlertTriangle, ArrowLeft, Pill, FileText, Stethoscope, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../stores/profileStore';

export default function Scan() {
  const [data, setData] = useState<any>(null);
  const [verified, setVerified] = useState(false);
  
  // In a real app, we would fetch the rich data from IPFS using the ID from the QR.
  // For the demo, we peek into our local store to simulate "Fetching from Cloud"
  const localProfile = useProfileStore(state => state.profile);

  useEffect(() => {
    if (!data) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render((text) => {
        scanner.clear();
        try {
          const parsed = JSON.parse(text);
          setData(parsed);
          // Simulate network verify
          setTimeout(() => setVerified(true), 1200);
        } catch (e) { alert("Invalid QR"); window.location.reload(); }
      }, (err) => console.log(err));
      return () => { scanner.clear().catch(e => console.error(e)); };
    }
  }, [data]);

  if (data) {
    // Merge QR data with "Cloud" data (simulated)
    const richData = localProfile && localProfile.fullName === data.n ? localProfile : null;

    return (
      <div className="min-h-screen p-4 md:p-8 md:p-8">
        <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center text-sm font-semibold mb-6 hover:underline text-gray-500">
                <ArrowLeft size={16} className="mr-1"/> Exit Patient View
            </Link>

            {/* Header Status */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Patient Record</h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {verified ? 'VERIFIED-ON-QUBIC' : 'VERIFYING...'}</p>
                </div>
                {verified ? <div className="badge bg-green-100 text-green-800 border-green-200 px-3 py-1"><CheckCircle size={14} className="mr-1"/> Authenticated</div> 
                          : <div className="badge bg-yellow-100 text-yellow-800 border-yellow-200"><Activity size={14} className="mr-1 animate-spin"/> Checking Hash</div>}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* LEFT COL: CRITICAL INFO */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card border-l-4 border-l-red-500">
                        <h3 className="input-label text-red-600 mb-2">Critical Alerts</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Blood Type</p>
                                <p className="text-3xl font-black text-gray-900">{data.b}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Allergies</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {data.a?.map((t: string) => <span key={t} className="badge bg-red-100 text-red-800 border-red-200">{t}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-black text-white">
                        <h3 className="input-label text-gray-400 mb-2">Emergency Contact</h3>
                        <p className="text-lg font-bold">{localProfile?.contactName || "Unknown"}</p>
                        <a href={`tel:${data.c}`} className="block mt-4 bg-white text-black text-center py-2 rounded font-bold hover:bg-gray-200">
                            Call {data.c}
                        </a>
                    </div>
                </div>

                {/* RIGHT COL: RICH DATA */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Prescriptions */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <Pill className="text-blue-500" size={20} />
                            <h3 className="font-bold">Active Prescriptions</h3>
                        </div>
                        {richData?.medications.map((m: any) => (
                            <div key={m.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-semibold text-sm">{m.title}</p>
                                    <p className="text-xs text-gray-500">{m.details}</p>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded h-fit">{m.date}</span>
                            </div>
                        ))}
                        {(!richData || richData.medications.length === 0) && <p className="text-sm text-gray-400 italic">No records found on chain.</p>}
                    </div>

                    {/* Reports */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <FileText className="text-orange-500" size={20} />
                            <h3 className="font-bold">Latest Lab Reports</h3>
                        </div>
                        {richData?.reports.map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 p-2 rounded cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 p-2 rounded text-orange-600"><FileText size={16}/></div>
                                    <div>
                                        <p className="font-semibold text-sm group-hover:underline">{r.title}</p>
                                        <p className="text-xs text-gray-500">{r.details}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{r.date}</span>
                            </div>
                        ))}
                         {(!richData || richData.reports.length === 0) && <p className="text-sm text-gray-400 italic">No reports uploaded.</p>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-center max-w-md mx-auto flex flex-col justify-center">
      <h1 className="text-3xl font-black mb-2">Provider Access</h1>
      <p className="text-gray-500 mb-8">Scan patient QR to decrypt medical records</p>
      <div id="reader" className="border rounded-lg overflow-hidden shadow-sm"></div>
      <Link to="/" className="mt-8 text-sm font-semibold hover:underline">Cancel</Link>
    </div>
  );
}