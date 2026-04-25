'use client';

import { Save, Plus, Database, AlignLeft, Calendar, Hash, Type, Image as ImageIcon, Link as LinkIcon, Settings2, GripVertical, Trash2 } from 'lucide-react';

export default function SchemaBuilder() {
  return (
    <div className="max-w-[1600px] mx-auto pb-12 overflow-x-hidden">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-4 relative mt-2 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] font-serif uppercase antialiased tracking-tighter flex items-center gap-3">
            <Database size={28} />
            Visual Schema Builder
          </h1>
          <p className="opacity-70 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
            Abstract Data Modeling • Generates ORM Configurations (Prisma)
          </p>
        </div>
        <div className="flex gap-2 relative z-10">
          <button className="border border-[#141414] px-4 py-2 text-xs font-mono tracking-wider bg-transparent hover:bg-white transition-colors flex items-center gap-2 font-bold">
            <Settings2 size={14} /> EXPORT PRISMA.SCHEMA
          </button>
          <button className="border border-[#141414] px-4 py-2 text-xs font-mono tracking-wider bg-[#141414] text-[#E4E3E0] hover:bg-black transition-colors flex items-center gap-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
            <Save size={14} /> DEPLOY SCHEMA TO DB
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Col: Entities Grid */}
        <div className="flex-1 space-y-8">
          
          {/* Entity: Horse Pedigrees */}
          <EntityCard 
            title="Horse Pedigrees" 
            tableName="horse_pedigree"
            fields={[
              { name: 'id', type: 'UUID', icon: <Hash size={14} />, isKey: true },
              { name: 'registered_name', type: 'String', icon: <Type size={14} />, required: true },
              { name: 'sire_id', type: 'Relation', icon: <LinkIcon size={14} />, rel: 'Horse Pedigrees' },
              { name: 'dam_id', type: 'Relation', icon: <LinkIcon size={14} />, rel: 'Horse Pedigrees' },
              { name: 'foal_date', type: 'DateTime', icon: <Calendar size={14} /> },
              { name: 'primary_photo', type: 'AssetURL (S3)', icon: <ImageIcon size={14} /> },
              { name: 'biography', type: 'RichText', icon: <AlignLeft size={14} /> },
            ]}
          />

          {/* Entity: Casino Stats */}
          <EntityCard 
            title="Casino Stats" 
            tableName="casino_statistics"
            fields={[
              { name: 'id', type: 'UUID', icon: <Hash size={14} />, isKey: true },
              { name: 'player_id', type: 'Relation', icon: <LinkIcon size={14} />, rel: 'Users', required: true },
              { name: 'games_played', type: 'Integer', icon: <Hash size={14} />, defaultVal: '0' },
              { name: 'total_winnings', type: 'Decimal', icon: <Hash size={14} />, defaultVal: '0.00' },
              { name: 'favorite_game', type: 'String', icon: <Type size={14} /> },
              { name: 'last_active', type: 'DateTime', icon: <Calendar size={14} /> },
            ]}
          />
          
          <button className="w-full border-2 border-dashed border-[#141414]/30 hover:border-[#141414] bg-transparent hover:bg-white transition-colors py-8 flex flex-col items-center justify-center gap-2 group font-mono">
            <div className="h-10 w-10 rounded-full border border-[#141414] group-hover:bg-[#141414] group-hover:text-white flex items-center justify-center transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest mt-2 group-hover:opacity-100 opacity-60">Add New Data Entity</span>
          </button>
        </div>

        {/* Right Col: Field Toolkit */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="border border-[#141414] bg-white sticky top-8 shadow-[4px_4px_0px_#141414]">
            <div className="border-b border-[#141414] px-4 py-3 bg-[#E4E3E0]">
              <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase">Field Toolkit</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <ToolKitItem icon={<Type size={16} />} label="Short Text" />
              <ToolKitItem icon={<AlignLeft size={16} />} label="Rich Text" />
              <ToolKitItem icon={<Hash size={16} />} label="Number" />
              <ToolKitItem icon={<Calendar size={16} />} label="Date/Time" />
              <ToolKitItem icon={<ImageIcon size={16} />} label="Media (S3)" />
              <ToolKitItem icon={<LinkIcon size={16} />} label="Relation" />
              <ToolKitItem icon={<Database size={16} />} label="JSON" />
              <ToolKitItem icon={<Type size={16} />} label="Enum" />
            </div>
            <div className="p-4 border-t border-[#141414] bg-[#f9f9f9] text-[10px] font-mono leading-relaxed opacity-70">
              Drag field types onto an entity to expand its schema. ORM sync runs automatically on deployment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntityCard({ title, tableName, fields }: { title: string, tableName: string, fields: any[] }) {
  return (
    <div className="border border-[#141414] bg-white shadow-[4px_4px_0px_#141414]">
      <div className="border-b border-[#141414] px-4 py-3 flex items-center justify-between bg-[#141414] text-[#E4E3E0]">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg tracking-tight font-bold">{title}</h2>
          <span className="bg-white/10 px-2 py-0.5 font-mono text-[10px] border border-white/20">DB: {tableName}</span>
        </div>
        <div className="flex gap-2">
          <button className="opacity-60 hover:opacity-100 hover:text-white transition-opacity"><Settings2 size={16} /></button>
        </div>
      </div>
      
      <div className="divide-y divide-[#141414]/20">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-[#141414]/5 transition-colors group">
            <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
              <GripVertical size={14} className="opacity-20 group-hover:opacity-100 cursor-grab" />
              <span className="font-mono text-xs font-bold text-[#141414]">{f.name}</span>
              {f.required && <span className="text-red-500 font-bold">*</span>}
            </div>
            
            <div className="flex items-center gap-2 w-1/3 min-w-[150px]">
              <span className="inline-flex items-center justify-center border border-[#141414]/30 bg-white shadow-sm w-6 h-6 text-[#141414] opacity-80">
                {f.icon}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">{f.type}</span>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
              <div className="font-mono text-[10px] opacity-50 truncate hidden sm:block">
                {f.isKey && <span className="text-amber-600 border border-amber-600/30 bg-amber-50 px-1 py-0.5">PRIMARY_KEY</span>}
                {f.rel && <span className="text-blue-600 border border-blue-600/30 bg-blue-50 px-1 py-0.5">➔ {f.rel}</span>}
                {f.defaultVal && <span>DEFAULT: {f.defaultVal}</span>}
              </div>
              <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 text-red-600 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        
        <div className="p-2 border-t-2 border-dashed border-[#141414]/20 bg-[#f9f9f9] text-center cursor-pointer hover:bg-[#E4E3E0] transition-colors">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#141414] opacity-50 flex items-center justify-center gap-2">
            <Plus size={12} /> Add Field
          </span>
        </div>
      </div>
    </div>
  );
}

function ToolKitItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="border border-[#141414]/30 p-3 hover:border-[#141414] hover:bg-[#141414]/5 cursor-grab flex flex-col items-center justify-center gap-2 transition-colors active:cursor-grabbing bg-white">
      <span className="opacity-80">{icon}</span>
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}
