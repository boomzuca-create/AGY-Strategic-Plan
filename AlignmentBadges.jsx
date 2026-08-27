import React from 'react';
import { Landmark, ClipboardCheck, Hospital, Building } from 'lucide-react';

export const AlignmentBadges = ({ isMoph, isInspect, cupCode, isPao, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {/* 1. กสธ. */}
      {isMoph && (
        <span 
          title="สอดคล้องแผนแม่บทกระทรวงสาธารณสุข 2570"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/50 text-amber-300 border border-amber-500/40"
        >
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          กสธ.
        </span>
      )}

      {/* 2. ตรวจราชการ */}
      {isInspect && (
        <span 
          title="สอดคล้องประเด็นตรวจราชการเขตสุขภาพ"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-pink-950/50 text-pink-300 border border-pink-500/40"
        >
          <ClipboardCheck className="w-3.5 h-3.5 text-pink-400" />
          ตรก.
        </span>
      )}

      {/* 3. CUP */}
      {cupCode && (
        <span 
          title={`สอดคล้องเกณฑ์นิเทศระดับอำเภอ/CUP: ${cupCode}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-500/40"
        >
          <Hospital className="w-3.5 h-3.5 text-emerald-400" />
          {cupCode.startsWith('K') ? `CUP: ${cupCode.split(' ')[0]}` : 'CUP'}
        </span>
      )}

      {/* 4. อบจ. */}
      {isPao && (
        <span 
          title="สอดคล้องภารกิจถ่ายโอน รพ.สต. สู่ อบจ."
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-950/50 text-cyan-300 border border-cyan-500/40"
        >
          <Building className="w-3.5 h-3.5 text-cyan-400" />
          อบจ.
        </span>
      )}
    </div>
  );
};

export const KPICardHeader = ({ kpi, className = '' }) => {
  if (!kpi) return null;
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 mb-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
          {kpi.kpi_code || kpi.id}
        </span>
        <span className="text-sky-400 text-sm font-medium">
          {(kpi.strategy_name || kpi.strategy || '').split(' ')[0]} &gt; {kpi.objective_name || kpi.objective || ''}
        </span>
      </div>

      {/* ฝั่งขวาบน: แท็กความสอดคล้อง 4 สายงาน */}
      <AlignmentBadges 
        isMoph={kpi.is_moph ?? kpi.isMoph} 
        isInspect={kpi.is_inspect ?? kpi.isInspect} 
        cupCode={kpi.cup_code ?? kpi.cupCode} 
        isPao={kpi.is_pao ?? kpi.isPao} 
      />
    </div>
  );
};

export default AlignmentBadges;
