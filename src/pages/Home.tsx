import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 opacity-50"></div>
      
      <div className="max-w-4xl w-full z-10">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-xs font-medium text-green-400 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Qubic Network Live
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2">
            MEDISHARE
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            The Decentralized Emergency Cloud.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/create" className="group">
            <div className="bg-[#111] border border-white/10 h-full p-8 rounded-2xl hover:border-white/30 hover:bg-[#151515] transition-all">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Patient</h2>
              <p className="text-gray-500 text-sm mb-6">Create encrypted profile & generate QR.</p>
              <div className="flex items-center text-sm font-bold text-white">
                Start Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </Link>

          <Link to="/scan" className="group">
            <div className="bg-[#111] border border-white/10 h-full p-8 rounded-2xl hover:border-blue-500/50 hover:bg-blue-900/5 transition-all">
              <div className="w-12 h-12 bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Provider</h2>
              <p className="text-gray-500 text-sm mb-6">Scan patient QR to verify hash.</p>
              <div className="flex items-center text-sm font-bold text-blue-500">
                Launch Scanner <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}