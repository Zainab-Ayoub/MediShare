import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, MedicalItem } from '../stores/profileStore';
import { ShieldCheck, Plus, FileText, Pill, Stethoscope, User, Save, ChevronRight } from 'lucide-react';

export default function CreateProfile() {
  const navigate = useNavigate();
  const createProfile = useProfileStore((state) => state.createProfile);
  
  // Tab State for "No Scroll" Layout
  const [activeTab, setActiveTab] = useState<'identity' | 'meds' | 'reports'>('identity');

  // Data State
  const [basic, setBasic] = useState({ fullName: '', bloodType: '', allergies: '', contactName: '', contactPhone: '' });
  const [meds, setMeds] = useState<MedicalItem[]>([]);
  const [reports, setReports] = useState<MedicalItem[]>([]);
  const [diagnoses, setDiagnoses] = useState<MedicalItem[]>([]);

  // Inputs for popups
  const [tempInput, setTempInput] = useState({ title: '', details: '', date: '' });

  const handleAddItem = (type: 'prescription' | 'report' | 'diagnosis', list: any[], setList: any) => {
    if (!tempInput.title) return;
    const newItem = {
      id: Date.now().toString(),
      type, title: tempInput.title, details: tempInput.details,
      date: tempInput.date || new Date().toISOString().split('T')[0]
    };
    setList([...list, newItem]);
    setTempInput({ title: '', details: '', date: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfile({
      ...basic,
      allergies: basic.allergies.split(',').map(s => s.trim()).filter(Boolean),
      medications: meds, reports, history: diagnoses
    });
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#050505] text-white overflow-hidden">
      
      {/* LEFT SIDEBAR - STATIC INFO */}
      <div className="w-full md:w-80 border-r border-white/10 p-6 flex flex-col justify-between bg-black/40">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MediShare</h1>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('identity')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'identity' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-500 hover:text-white'}`}>
              <User size={18} /> <span className="text-sm font-medium">Identity</span>
            </button>
            <button onClick={() => setActiveTab('meds')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'meds' ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' : 'text-gray-500 hover:text-white'}`}>
              <Pill size={18} /> <span className="text-sm font-medium">Prescriptions</span>
            </button>
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-orange-600/10 text-orange-400 border border-orange-600/20' : 'text-gray-500 hover:text-white'}`}>
              <FileText size={18} /> <span className="text-sm font-medium">Files & Reports</span>
            </button>
          </nav>
        </div>

        <button onClick={handleSubmit} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
          <Save size={18} /> Save to Qubic
        </button>
      </div>

      {/* RIGHT PANEL - DYNAMIC CONTENT */}
      <div className="flex-1 p-6 md:p-12 relative custom-scroll">
        
        {/* TAB 1: IDENTITY */}
        {activeTab === 'identity' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Patient Identity</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="input-label">Full Name</label>
                <input className="input-field text-lg" value={basic.fullName} onChange={e => setBasic({...basic, fullName: e.target.value})} placeholder="Jane Doe" autoFocus />
              </div>
              <div>
                <label className="input-label">Blood Type</label>
                <select className="input-field" value={basic.bloodType} onChange={e => setBasic({...basic, bloodType: e.target.value})}>
                   <option value="">Select...</option><option value="A+">A+</option><option value="O+">O+</option><option value="B-">B-</option>
                </select>
              </div>
              <div>
                <label className="input-label">Date of Birth</label>
                <input type="date" className="input-field" />
              </div>
              <div className="col-span-2">
                 <label className="input-label text-red-400">Allergies (Critical)</label>
                 <input className="input-field border-red-900/30 bg-red-900/10 text-red-200" value={basic.allergies} onChange={e => setBasic({...basic, allergies: e.target.value})} placeholder="Peanuts, Penicillin..." />
              </div>
              <div className="col-span-2 pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Contact Name" value={basic.contactName} onChange={e => setBasic({...basic, contactName: e.target.value})} />
                  <input className="input-field" type="tel" placeholder="Phone Number" value={basic.contactPhone} onChange={e => setBasic({...basic, contactPhone: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDS */}
        {activeTab === 'meds' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Pill className="text-purple-500" /> Prescriptions</h2>
            
            {/* Add New Bar */}
            <div className="glass-panel p-4 mb-6 flex gap-2">
              <input className="input-field" placeholder="Medication Name" value={tempInput.title} onChange={e => setTempInput({...tempInput, title: e.target.value})} />
              <input className="input-field" placeholder="Dosage (e.g. 50mg)" value={tempInput.details} onChange={e => setTempInput({...tempInput, details: e.target.value})} />
              <button onClick={() => handleAddItem('prescription', meds, setMeds)} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg"><Plus size={20}/></button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {meds.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div><p className="font-bold text-white">{m.title}</p><p className="text-sm text-gray-400">{m.details}</p></div>
                  <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">Active</div>
                </div>
              ))}
              {meds.length === 0 && <div className="text-center p-10 border border-dashed border-white/10 rounded-xl text-gray-600">No prescriptions added</div>}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeTab === 'reports' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FileText className="text-orange-500" /> Lab Reports</h2>
             
             {/* Add New Bar */}
             <div className="glass-panel p-4 mb-6 flex gap-2">
              <input className="input-field" placeholder="Report Title" value={tempInput.title} onChange={e => setTempInput({...tempInput, title: e.target.value})} />
              <input type="date" className="input-field w-40" value={tempInput.date} onChange={e => setTempInput({...tempInput, date: e.target.value})} />
              <button onClick={() => handleAddItem('report', reports, setReports)} className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg"><Plus size={20}/></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                  <FileText className="text-orange-500 mb-2" size={24} />
                  <p className="font-bold text-sm text-white truncate">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}