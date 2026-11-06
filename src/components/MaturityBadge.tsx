import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export interface MaturityItem {
  level: string;
  status: string;
  feature: string;
}

export const MATURITY_DEFINITIONS: MaturityItem[] = [
  { level: 'L0', status: '人工交付', feature: '依赖个人经验，流程不标准' },
  { level: 'L1', status: '标准化', feature: '有明确输入/输出、SOP、报价和交付标准' },
  { level: 'L2', status: '模块化', feature: 'Workflow拆清楚，可复用模板 / Skill' },
  { level: 'L3', status: 'AI辅助', feature: '部分环节由AI完成，人机协同' },
  { level: 'L4', status: 'AI主导', feature: '大部分流程自动化，人主要做判断和QC' },
  { level: 'L5', status: '智能闭环', feature: '能基于历史效果和策略Pattern持续推荐、优化和学习' }
];

interface MaturityBadgeProps {
  maturity: string;
  showPrefix?: boolean; // whether to show "成熟度: "
  className?: string;
  align?: 'left' | 'right';
}

export default function MaturityBadge({
  maturity,
  showPrefix = true,
  className = '',
  align = 'right'
}: MaturityBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click if open
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`group inline-flex items-center space-x-1 font-mono font-semibold text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/90 text-slate-700 transition-colors cursor-help ${className}`}
        title="点击或悬浮查看成熟度等级释义"
      >
        <span>
          {showPrefix ? `成熟度: ${maturity}` : maturity}
        </span>
        <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
      </button>

      {/* Popover Table */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-full mt-2 w-[440px] max-w-[90vw] z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 text-xs animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-xs">成熟度等级释义</span>
              <span className="text-[11px] text-slate-400">(L0 - L5)</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              当前规格: {maturity}
            </span>
          </div>

          {/* Table matching image */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 font-bold">
                  <th className="py-1.5 px-2 w-12">等级</th>
                  <th className="py-1.5 px-2 w-20">SKU状态</th>
                  <th className="py-1.5 px-2">典型特征</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MATURITY_DEFINITIONS.map((row) => {
                  const isCurrent = row.level.toLowerCase() === maturity.toLowerCase();
                  return (
                    <tr
                      key={row.level}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/90 text-blue-950 font-medium'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <td className="py-1.5 px-2 font-mono font-bold">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-800'
                          }`}
                        >
                          {row.level}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 font-medium text-slate-900 whitespace-nowrap">
                        {row.status}
                      </td>
                      <td className="py-1.5 px-2 text-slate-600 leading-relaxed">
                        {row.feature}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
