import React from 'react';

interface TimeRangeSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const options = [
    { label: '7d', value: 7 },
    { label: '14d', value: 14 },
    { label: '30d', value: 30 },
  ];

  return (
    <div className="flex bg-zinc-100/80 p-0.5 rounded-lg border border-zinc-200/50">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 sm:flex-none px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
            value === opt.value
              ? 'bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
