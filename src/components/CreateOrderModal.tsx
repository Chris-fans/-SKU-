import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
  Zap
} from 'lucide-react';
import { SKU, Project, SecondCategoryInfo, SKUExtraSpecs } from '../types';
import { MOCK_SKUS, SECOND_CATEGORIES } from '../data';
import SKUCard from './SKUCard';
import SKUComparisonModal from './SKUComparisonModal';
import CaseLightboxModal from './CaseLightboxModal';

// Calculate standard working days from deliveryDays string (e.g. "T+3工作日" -> 3)
export function getStandardWorkingDays(deliveryDaysStr?: string): number {
  if (!deliveryDaysStr) return 3;
  const match = deliveryDaysStr.match(/T\+(\d+)/);
  if (match) return parseInt(match[1], 10);
  return 3;
}

// Calculate estimated delivery date by adding N working days (excluding Saturday & Sunday)
export function calculateEstimatedDeliveryDate(baseDate: Date, workingDays: number): { date: Date; dateStr: string } {
  const target = new Date(baseDate);
  target.setHours(0, 0, 0, 0);
  let added = 0;
  while (added < workingDays) {
    target.setDate(target.getDate() + 1);
    const day = target.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return { date: target, dateStr: `${y}-${m}-${d}` };
}

// Calculate remaining working days from base date to chosen target date string
export function getWorkingDaysDifference(baseDate: Date, targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const parts = targetDateStr.split('-').map(Number);
  if (parts.length !== 3) return 0;
  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  target.setHours(0, 0, 0, 0);

  const current = new Date(baseDate);
  current.setHours(0, 0, 0, 0);

  if (target <= current) return 0;

  let count = 0;
  while (current < target) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return count;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId?: string;
  onSubmit: (orderData: {
    projectId: string;
    orderSource?: string;
    opProject?: string;
    items: {
      skuId: string;
      skuTitle: string;
      category: string;
      quantity: number;
      unitPrice: number;
      deliveryDate: string;
      currency?: string;
      priceChangeReason?: string;
      specs?: SKUExtraSpecs;
    }[];
    notes: string;
    totalAmount: number;
  }) => void;
}

const MOCK_REQUESTERS = [
  '追觅国际（香港）有限公司',
  '追觅科技海外事业部',
  '科沃斯全球机器人品牌部',
  '安克创新品牌营销中心',
  '影石创新出海营销部'
];

const MOCK_OP_PROJECTS = [
  '追觅吸尘器2025',
  '追觅北美-空净线-FB+GG-26代',
  '科沃斯全球-扫地机线-FB+GG-05代',
  '安克创新-便携充电储能-海外站-12代',
  '追觅海外洗地机H14首发项目'
];

export default function CreateOrderModal({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSubmit
}: CreateOrderModalProps) {
  // Top Form States
  const [selectedRequester, setSelectedRequester] = useState<string>('');
  const [orderSource, setOrderSource] = useState<'内需' | '外需'>('内需');
  const [selectedOpProject, setSelectedOpProject] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Category Hierarchy Navigation States
  const [currentSecondCategory, setCurrentSecondCategory] = useState<SecondCategoryInfo['id']>('品效创意');
  const [currentThirdCategory, setCurrentThirdCategory] = useState<string>('品效平面');
  const [selectedFourthFilter, setSelectedFourthFilter] = useState<string>('全部');

  // Selected SKUs and Item configs
  const [selectedSKUIds, setSelectedSKUIds] = useState<string[]>(['sku-px-pm-std']);
  const [skuConfigs, setSkuConfigs] = useState<Record<string, {
    quantity: number;
    unitPrice: number;
    deliveryDate: string;
    currency: string;
    priceChangeReason?: string;
    priceChangeType?: string;
    specs?: SKUExtraSpecs;
  }>>(() => {
    const defaultSku = MOCK_SKUS.find(s => s.id === 'sku-px-pm-std');
    const stdDays = defaultSku ? getStandardWorkingDays(defaultSku.deliveryDays) : 3;
    const est = calculateEstimatedDeliveryDate(new Date(), stdDays);
    return {
      'sku-px-pm-std': {
        quantity: 20,
        unitPrice: 240,
        deliveryDate: est.dateStr,
        currency: 'CNY',
        priceChangeReason: '',
        priceChangeType: '',
        specs: {
          language: '',
          dimensions: '',
          fileFormat: '',
          namingConvention: '',
          copywriting: '',
          storyboard: '',
          specialRequirements: ''
        }
      }
    };
  });

  const [expandedSkuSpecs, setExpandedSkuSpecs] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals for Comparison and Case Preview Lightbox
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; initialIndex: number } | null>(null);

  // Sync projects and activeProjectId
  useEffect(() => {
    if (activeProjectId) {
      setSelectedProjectId(activeProjectId);
      const proj = projects.find(p => p.id === activeProjectId);
      if (proj) {
        setSelectedRequester(proj.manager || '追觅国际（香港）有限公司');
        setSelectedOpProject(proj.name || '追觅吸尘器2025');
      }
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
      setSelectedRequester('追觅国际（香港）有限公司');
      setSelectedOpProject('追觅吸尘器2025');
    }
  }, [activeProjectId, projects]);

  // Active second category info
  const activeSecondCatInfo = SECOND_CATEGORIES.find(c => c.id === currentSecondCategory) || SECOND_CATEGORIES[0];

  // Guaranteed valid third category for current second category (prevents transient empty state rendering)
  const effectiveThirdCategory = activeSecondCatInfo.thirdCategories.includes(currentThirdCategory)
    ? currentThirdCategory
    : (activeSecondCatInfo.thirdCategories[0] || '');

  // Synchronous atomic category switcher to eliminate double-render jitter
  const handleSelectSecondCategory = (catId: SecondCategoryInfo['id']) => {
    if (catId === currentSecondCategory) return;
    const targetCat = SECOND_CATEGORIES.find(c => c.id === catId);
    let nextThird = currentThirdCategory;
    if (targetCat && targetCat.thirdCategories.length > 0) {
      if (!targetCat.thirdCategories.includes(currentThirdCategory)) {
        nextThird = targetCat.thirdCategories[0];
      }
    }
    setCurrentSecondCategory(catId);
    setCurrentThirdCategory(nextThird);
    setSelectedFourthFilter('全部');
  };

  const handleSelectThirdCategory = (third: string) => {
    if (third === currentThirdCategory) return;
    setCurrentThirdCategory(third);
    setSelectedFourthFilter('全部');
  };

  if (!isOpen) return null;

  // Toggle SKU selection
  const toggleSKU = (sku: SKU) => {
    if (selectedSKUIds.includes(sku.id)) {
      setSelectedSKUIds(prev => prev.filter(id => id !== sku.id));
      setSkuConfigs(prev => {
        const copy = { ...prev };
        delete copy[sku.id];
        return copy;
      });
    } else {
      setSelectedSKUIds(prev => [...prev, sku.id]);
      
      const defaultQty = parseInt(sku.minOrder) || 10;
      const stdDays = getStandardWorkingDays(sku.deliveryDays);
      const est = calculateEstimatedDeliveryDate(new Date(), stdDays);

      setSkuConfigs(prev => ({
        ...prev,
        [sku.id]: {
          quantity: defaultQty,
          unitPrice: sku.defaultPrice,
          deliveryDate: est.dateStr,
          currency: 'CNY',
          priceChangeReason: '',
          priceChangeType: ''
        }
      }));
    }
    setErrorMessage(null);
  };

  const updateSkuConfig = (skuId: string, fields: Partial<{
    quantity: number;
    unitPrice: number;
    deliveryDate: string;
    currency: string;
    priceChangeReason: string;
    priceChangeType: string;
    specs: SKUExtraSpecs;
  }>) => {
    setSkuConfigs(prev => {
      const current = prev[skuId] || {};
      const updatedFields = { ...fields };
      if (updatedFields.quantity !== undefined) {
        updatedFields.quantity = Math.min(999, Math.max(1, updatedFields.quantity));
      }
      return {
        ...prev,
        [skuId]: {
          ...current,
          ...updatedFields,
          specs: fields.specs ? { ...(current.specs || {}), ...fields.specs } : current.specs
        }
      };
    });
  };

  const updateSkuSpecField = (skuId: string, field: keyof SKUExtraSpecs, value: string) => {
    setSkuConfigs(prev => {
      const current = prev[skuId];
      if (!current) return prev;
      return {
        ...prev,
        [skuId]: {
          ...current,
          specs: {
            ...(current.specs || {}),
            [field]: value
          }
        }
      };
    });
  };

  const toggleExpandSpecs = (skuId: string) => {
    setExpandedSkuSpecs(prev => ({
      ...prev,
      [skuId]: !prev[skuId]
    }));
  };

  const removeSKU = (skuId: string) => {
    setSelectedSKUIds(prev => prev.filter(id => id !== skuId));
    setSkuConfigs(prev => {
      const copy = { ...prev };
      delete copy[skuId];
      return copy;
    });
  };

  // Filter SKUs in current category with memoization
  const currentSKUs = useMemo(() => {
    return MOCK_SKUS.filter(sku => {
      const matchSecond = sku.secondCategory === currentSecondCategory;
      const matchThird = sku.thirdCategory === effectiveThirdCategory;
      const matchFourth = selectedFourthFilter === '全部' || 
        sku.fourthCategory === selectedFourthFilter;

      return matchSecond && matchThird && matchFourth;
    });
  }, [currentSecondCategory, effectiveThirdCategory, selectedFourthFilter]);

  // Calculate totals including rush surcharges
  const totalBaseAmount = useMemo(() => {
    return selectedSKUIds.reduce((sum, id) => {
      const config = skuConfigs[id];
      if (!config) return sum;
      return sum + (config.quantity * config.unitPrice);
    }, 0);
  }, [selectedSKUIds, skuConfigs]);

  const totalRushFee = useMemo(() => {
    const today = new Date();
    return selectedSKUIds.reduce((sum, id) => {
      const sku = MOCK_SKUS.find(s => s.id === id);
      const config = skuConfigs[id];
      if (!sku || !config || !config.deliveryDate) return sum;
      const stdWorkingDays = getStandardWorkingDays(sku.deliveryDays);
      const chosenWorkingDays = getWorkingDaysDifference(today, config.deliveryDate);
      if (chosenWorkingDays < stdWorkingDays) {
        const rushRate = chosenWorkingDays === stdWorkingDays - 1 ? 0.3 : 0.5;
        return sum + Math.round(config.quantity * config.unitPrice * rushRate);
      }
      return sum;
    }, 0);
  }, [selectedSKUIds, skuConfigs]);

  const totalAmount = totalBaseAmount + totalRushFee;

  // Form submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSKUIds.length === 0) {
      setErrorMessage('请至少选择一个创意 SKU 进行下单！');
      return;
    }

    let hasInvalid = false;
    let hasMissingReason = false;

    selectedSKUIds.forEach(id => {
      const sku = MOCK_SKUS.find(s => s.id === id);
      const config = skuConfigs[id];
      if (!sku || !config || config.quantity <= 0 || config.unitPrice <= 0 || !config.deliveryDate) {
        hasInvalid = true;
      } else {
        const minPrice = sku.defaultPrice * 0.8;
        const maxPrice = sku.defaultPrice * 1.2;
        const isOutOfBounds = config.unitPrice < minPrice || config.unitPrice > maxPrice;
        if (isOutOfBounds) {
          if (!config.priceChangeType) {
            hasMissingReason = true;
          } else if (config.priceChangeType === '其他' && !config.priceChangeReason?.trim()) {
            hasMissingReason = true;
          }
        }
      }
    });

    if (hasInvalid) {
      setErrorMessage('请确保所有选定 SKU 的数量和单价均为大于0的正数，且期望交付日期已填写。');
      return;
    }

    if (hasMissingReason) {
      setErrorMessage('部分 SKU 的单价已超出合理价格区间 (±20%)，系统将通知行业Leader，请选择改价原因。若选择其他，请填写具体说明。');
      return;
    }

    const items = selectedSKUIds.map(id => {
      const sku = MOCK_SKUS.find(s => s.id === id)!;
      const config = skuConfigs[id];
      const minPrice = sku.defaultPrice * 0.8;
      const maxPrice = sku.defaultPrice * 1.2;
      const isOutOfBounds = config.unitPrice < minPrice || config.unitPrice > maxPrice;

      let reason = '';
      if (isOutOfBounds) {
        if (config.priceChangeType === '其他') {
          reason = `其他: ${config.priceChangeReason || ''}`;
        } else {
          reason = config.priceChangeType || '';
        }
      }

      return {
        skuId: id,
        skuTitle: sku.title,
        category: sku.secondCategory,
        quantity: config.quantity,
        unitPrice: config.unitPrice,
        deliveryDate: config.deliveryDate,
        currency: config.currency || 'CNY',
        priceChangeReason: reason,
        specs: config.specs
      };
    });

    onSubmit({
      projectId: selectedProjectId || projects[0]?.id || 'proj-1',
      orderSource,
      opProject: selectedOpProject,
      items,
      notes: '',
      totalAmount
    });
  };

  // Distinct Fourth Categories for current Third Category
  const availableFourthCategories = useMemo(() => {
    return Array.from(
      new Set(
        MOCK_SKUS
          .filter(s => s.secondCategory === currentSecondCategory && s.thirdCategory === effectiveThirdCategory)
          .map(s => s.fourthCategory)
      )
    );
  }, [currentSecondCategory, effectiveThirdCategory]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          id="create-order-modal"
          /* 弹框固定为 1200px (max-w-[1200px]) */
          className="relative bg-white w-full max-w-[1200px] rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200"
        >
          {/* Top Main Header */}
          <div className="flex items-center justify-between px-8 py-4.5 border-b border-slate-100 flex-shrink-0 bg-white">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">新建订单</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    ECBR 创意库架构 · 1200px
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  全品类创意选品 · 价格与制作精度直观对比 · 批量合并下单
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Workspace Container */}
            <div className="p-7 space-y-6 overflow-y-auto flex-1 bg-white">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Row 1: 需求方 / 订单来源 / OP项目 */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 flex flex-wrap items-center gap-5">
                {/* 需求方 */}
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-700 flex-shrink-0">
                    选择需求方 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative min-w-[200px]">
                    <select
                      value={selectedRequester}
                      onChange={(e) => setSelectedRequester(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-800 transition-all cursor-pointer font-medium"
                    >
                      <option value="">请选择需求方</option>
                      {MOCK_REQUESTERS.map((req) => (
                        <option key={req} value={req}>
                          {req}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 订单来源 */}
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-700 flex-shrink-0">
                    订单来源 <span className="text-rose-500">*</span>
                  </label>
                  <div className="bg-slate-200/60 p-0.5 rounded-xl flex items-center">
                    <button
                      type="button"
                      onClick={() => setOrderSource('内需')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        orderSource === '内需'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      内需
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderSource('外需')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        orderSource === '外需'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      外需
                    </button>
                  </div>
                </div>

                {/* OP项目 */}
                <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                  <label className="text-xs font-bold text-slate-700 flex-shrink-0">
                    选择OP项目 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex-1">
                    <select
                      value={selectedOpProject}
                      onChange={(e) => setSelectedOpProject(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-800 transition-all cursor-pointer font-medium"
                    >
                      <option value="">请选择OP项目</option>
                      {MOCK_OP_PROJECTS.map((proj) => (
                        <option key={proj} value={proj}>
                          {proj}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ===============================================================
                  ECBR 创意选品区 (优化空间：卡片内直接融合标题与描述，移除大横幅与一级类目文案)
              =============================================================== */}
              <div className="space-y-4">
                {/* 1. 创意类型切换卡片 (融合标题与描述文案，节省纵向高度) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        创意类型
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        先选择所需创意交付定位
                      </span>
                    </div>

                    {/* Button to open Side-by-Side Comparison Matrix */}
                    <button
                      type="button"
                      onClick={() => setIsComparisonOpen(true)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>全维度规格对照表</span>
                    </button>
                  </div>

                  {/* 4 大创意类型卡片：直接在卡片内完整呈现名称与业务定位描述 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SECOND_CATEGORIES.map((cat) => {
                      const isActive = currentSecondCategory === cat.id;
                      const selectedCount = selectedSKUIds.filter(
                        id => MOCK_SKUS.find(s => s.id === id)?.secondCategory === cat.id
                      ).length;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectSecondCategory(cat.id)}
                          className={`relative p-3.5 rounded-2xl text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between ${
                            isActive
                              ? 'bg-gradient-to-b from-blue-50/80 to-white border-2 border-blue-600 shadow-xs'
                              : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center space-x-1.5">
                                {isActive && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                )}
                                <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                                  {cat.name}
                                </span>
                              </div>
                              {selectedCount > 0 && (
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    isActive
                                      ? 'bg-blue-600 text-white shadow-2xs'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  已选 {selectedCount}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] leading-relaxed line-clamp-3 ${
                                isActive ? 'text-slate-600 font-medium' : 'text-slate-500'
                              }`}
                            >
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. 三级类目切换 + 档位选择引导 + 原创/修改切换 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-3">
                    {/* 三级类目 Segmented Control */}
                    <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/50">
                      {activeSecondCatInfo.thirdCategories.map((third) => {
                        const isSelected = effectiveThirdCategory === third;
                        return (
                          <button
                            key={third}
                            type="button"
                            onClick={() => handleSelectThirdCategory(third)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer ${
                              isSelected
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {third}
                          </button>
                        );
                      })}
                    </div>

                    {/* 档位选择引导：仅在选中品效创意时出现 */}
                    {currentSecondCategory === '品效创意' && (
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>
                          <strong className="font-bold text-amber-900">如何快速分辨档位？</strong>
                          核心区分维度是<span className="font-bold text-amber-950 underline decoration-amber-300 underline-offset-2">本地化深度</span>，其次可参考<span className="font-bold text-amber-950 underline decoration-amber-300 underline-offset-2">制作精度</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 全部 / 原创 / 修改 等切换 (去掉“四级类型”文案标签，直接展示切换) */}
                  {availableFourthCategories.length > 0 && (
                    <div className="flex items-center space-x-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => setSelectedFourthFilter('全部')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-150 ${
                          selectedFourthFilter === '全部'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        全部
                      </button>
                      {availableFourthCategories.map((fourth) => (
                        <button
                          key={fourth}
                          type="button"
                          onClick={() => setSelectedFourthFilter(fourth)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedFourthFilter === fourth
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {fourth}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. 单 SKU 平铺卡片展示区 (平滑过渡动效，避免闪烁卡顿) */}
                <div className="min-h-[380px] relative">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${currentSecondCategory}-${effectiveThirdCategory}-${selectedFourthFilter}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {currentSKUs.length === 0 ? (
                        <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                          <p className="text-xs font-bold text-slate-500">当前筛选条件下暂无对应 SKU</p>
                          <p className="text-[11px] text-slate-400 mt-1">您可以切换其他分类查看规格</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentSKUs.map((sku, index) => {
                            const isSelected = selectedSKUIds.includes(sku.id);
                            return (
                              <motion.div
                                key={sku.id}
                                className="h-full flex flex-col"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.18,
                                  delay: Math.min(index * 0.03, 0.09),
                                  ease: 'easeOut'
                                }}
                              >
                                <SKUCard
                                  sku={sku}
                                  isSelected={isSelected}
                                  orderSource={orderSource}
                                  onToggle={() => toggleSKU(sku)}
                                  onPreviewImages={(imgs, idx) => setLightboxData({ images: imgs, initialIndex: idx })}
                                />
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ===============================================================
                  配置下单参数 & 交付期 (已选 SKU 清单)
              =============================================================== */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      已选 SKU 下单配置与参数定制
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      支持多品类同时结算下单，单价、数量及期望交付日期均可独立设置
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    已选定 {selectedSKUIds.length} 项规格
                  </span>
                </div>

                {selectedSKUIds.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">请在上方点选需要下单的创意 SKU</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      可同时勾选平面、视频、修改类等多个规格，自动生成合并清单
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {selectedSKUIds.map((id) => {
                      const sku = MOCK_SKUS.find(item => item.id === id);
                      const config = skuConfigs[id];
                      if (!sku || !config) return null;

                      const priceRangeMatch = sku.cbPriceCNY.match(/¥(\d+)-(\d+)/);
                      const minPrice = priceRangeMatch ? parseInt(priceRangeMatch[1], 10) : Math.round(sku.defaultPrice * 0.8);
                      const maxPrice = priceRangeMatch ? parseInt(priceRangeMatch[2], 10) : Math.round(sku.defaultPrice * 1.2);
                      const isOutOfBounds = config.unitPrice < minPrice || config.unitPrice > maxPrice;
                      const isExpanded = !!expandedSkuSpecs[id];

                      // Lead time & Rush surcharge calculation
                      const today = new Date();
                      const stdWorkingDays = getStandardWorkingDays(sku.deliveryDays);
                      const estimatedDateInfo = calculateEstimatedDeliveryDate(today, stdWorkingDays);
                      const chosenWorkingDays = getWorkingDaysDifference(today, config.deliveryDate);
                      const isRush = config.deliveryDate ? chosenWorkingDays < stdWorkingDays : false;
                      const rushRate = isRush ? (chosenWorkingDays === stdWorkingDays - 1 ? 0.3 : 0.5) : 0;
                      const baseSubtotal = config.quantity * config.unitPrice;
                      const rushFee = Math.round(baseSubtotal * rushRate);
                      const itemTotal = baseSubtotal + rushFee;

                      return (
                        <div
                          key={id}
                          className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-2xs space-y-3.5"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left SKU basic label: 只展示大类名称与自动测算的预计完成日期 */}
                            <div className="lg:w-[230px] flex-shrink-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="bg-blue-50 text-blue-700 font-bold text-[11px] px-2 py-0.5 rounded">
                                  {sku.secondCategory}
                                </span>
                              </div>
                              <h5 className="font-bold text-slate-900 text-sm mt-1 truncate">
                                {sku.title}
                              </h5>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                交付时效: {sku.deliveryDays}
                              </span>
                            </div>

                            {/* Middle inputs row */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                              {/* 币种 */}
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">币种</label>
                                <div className="relative">
                                  <select
                                    value={config.currency || 'CNY'}
                                    onChange={(e) => updateSkuConfig(id, { currency: e.target.value })}
                                    className="w-full h-[36px] appearance-none bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-2.5 pr-6 text-xs text-slate-800 font-bold cursor-pointer"
                                  >
                                    <option value="CNY">CNY (¥)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="MC">MC (🪙)</option>
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </div>

                              {/* 数量 */}
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">数量</label>
                                <div className="h-[36px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2">
                                  <button
                                    type="button"
                                    onClick={() => updateSkuConfig(id, { quantity: Math.max(1, config.quantity - 1) })}
                                    className="w-5 h-5 flex items-center justify-center cursor-pointer rounded hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0 font-bold text-xs"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    value={config.quantity}
                                    onChange={(e) => updateSkuConfig(id, { quantity: Math.min(999, Math.max(1, parseInt(e.target.value) || 1)) })}
                                    className="w-full min-w-0 h-full text-center bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 p-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateSkuConfig(id, { quantity: Math.min(999, config.quantity + 1) })}
                                    className="w-5 h-5 flex items-center justify-center cursor-pointer rounded hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0 font-bold text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* 单价 */}
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  单价 (建议区间: ¥{minPrice}-¥{maxPrice})
                                </label>
                                <div className="h-[36px] flex items-center bg-white border border-slate-200 focus-within:border-blue-500 rounded-xl px-2.5 transition-colors">
                                  <span className="text-xs text-slate-400 font-bold mr-1 flex-shrink-0">
                                    {config.currency === 'USD' ? '$' : config.currency === 'MC' ? '🪙' : '¥'}
                                  </span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={config.unitPrice}
                                    onChange={(e) => updateSkuConfig(id, { unitPrice: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="w-full h-full bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 p-0"
                                  />
                                  <button
                                    type="button"
                                    title="恢复参考价"
                                    onClick={() => updateSkuConfig(id, { unitPrice: sku.defaultPrice })}
                                    className="p-1 cursor-pointer rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0 ml-1"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* 期望交付时间 */}
                              <div className="sm:col-span-4">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[11px] font-bold text-slate-500">期望交付时间</label>
                                  <span className="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                                    工时测算: {estimatedDateInfo.dateStr}
                                  </span>
                                </div>
                                <div className={`h-[36px] flex items-center bg-white border rounded-xl px-2.5 transition-colors ${
                                  isRush
                                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                                    : 'border-slate-200 focus-within:border-blue-500'
                                }`}>
                                  <Calendar className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${isRush ? 'text-amber-500' : 'text-slate-400'}`} />
                                  <input
                                    type="date"
                                    value={config.deliveryDate}
                                    onChange={(e) => updateSkuConfig(id, { deliveryDate: e.target.value })}
                                    className="w-full h-full bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none focus:ring-0 p-0 cursor-pointer min-w-0"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right Subtotal & Delete */}
                            <div className="flex items-center justify-between lg:justify-end lg:space-x-4 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 lg:min-w-[170px]">
                              <div className="text-left lg:text-right">
                                <span className="block text-[11px] text-slate-400">预估小计</span>
                                <span className="text-sm font-black text-slate-900 font-mono">
                                  {config.currency === 'USD' ? '$' : config.currency === 'MC' ? '🪙' : '¥'}
                                  {itemTotal.toLocaleString()}
                                </span>
                                {rushFee > 0 && (
                                  <span className="block text-[11px] font-bold text-rose-600 mt-0.5">
                                    含加急 +{Math.round(rushRate * 100)}% (+¥{rushFee.toLocaleString()})
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSKU(id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="移出清单"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* 工期加急溢价提示 */}
                          {isRush && (
                            <div className="bg-gradient-to-r from-amber-50/90 to-rose-50/90 border border-amber-200/90 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs shadow-2xs">
                              <div className="flex items-start md:items-center space-x-2.5 text-amber-950 flex-1">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0">
                                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                                </div>
                                <div>
                                  <div className="flex items-center flex-wrap gap-2">
                                    <span className="font-bold text-amber-900 text-xs">触发加急溢价提示</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                                      工期加急：T+2 工作日+30%, T+1 工作日+50%
                                    </span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                      已生效当前档位: +{Math.round(rushRate * 100)}% 加急溢价
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                    您选择的期望交付时间（<strong className="text-slate-800 font-mono">{config.deliveryDate}</strong>）短于根据工时计算的预计交付时间（<strong className="text-slate-800 font-mono">{estimatedDateInfo.dateStr}</strong>，标准工时需 {stdWorkingDays} 个工作日）。加急服务费：<strong className="text-rose-600 font-mono">+¥{rushFee.toLocaleString()}</strong>（已同步计入小计与订单总金额）。
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => updateSkuConfig(id, { deliveryDate: estimatedDateInfo.dateStr })}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors flex-shrink-0 cursor-pointer self-start md:self-center"
                                title="恢复为根据工时计算的标准交付时间"
                              >
                                <RefreshCw className="w-3 h-3 text-slate-400" />
                                <span>恢复预计交付时间</span>
                              </button>
                            </div>
                          )}

                          {/* Out-of-bounds Price Warning and Leader review reason */}
                          {isOutOfBounds && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs">
                              <div className="flex items-start space-x-2 text-amber-900 md:max-w-xs flex-shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="block font-bold">单价超出合理浮动区间 (±20%)</span>
                                  <span className="text-amber-700 text-[11px]">该订单提交后将推送至行业 Leader 协同审核。</span>
                                </div>
                              </div>
                              <div className="flex-1 max-w-md w-full flex flex-col gap-2">
                                <select
                                  value={config.priceChangeType || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateSkuConfig(id, {
                                      priceChangeType: val,
                                      priceChangeReason: val === '其他' ? (config.priceChangeReason || '') : ''
                                    });
                                  }}
                                  className="w-full bg-white border border-amber-200 focus:border-amber-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold cursor-pointer"
                                  required
                                >
                                  <option value="">-- 请选择改价原因 (必选) --</option>
                                  <option value="执行难度调整">执行难度调整</option>
                                  <option value="商务报价策略">商务报价策略</option>
                                  <option value="其他">其他</option>
                                </select>
                                {config.priceChangeType === '其他' && (
                                  <input
                                    type="text"
                                    placeholder="请填写修改价格的具体原因（必填）..."
                                    value={config.priceChangeReason || ''}
                                    onChange={(e) => updateSkuConfig(id, { priceChangeReason: e.target.value })}
                                    className="w-full bg-white border border-amber-200 focus:border-amber-500 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                    required
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Secondary Fold: Additional specs */}
                          <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-xs">
                              <button
                                type="button"
                                onClick={() => toggleExpandSpecs(id)}
                                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center space-x-1 cursor-pointer"
                              >
                                <span>{isExpanded ? '收起交付规格要求' : '+ 填写详细交付标准 (语言、尺寸、文件格式等选填)'}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden mt-3"
                                >
                                  <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/70 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">语言</label>
                                        <input
                                          type="text"
                                          placeholder="如: 英语 / 德语 / 日语"
                                          value={config.specs?.language || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'language', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">尺寸 / 比例</label>
                                        <input
                                          type="text"
                                          placeholder="如: 1:1, 9:16, 4:5"
                                          value={config.specs?.dimensions || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'dimensions', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">交付文件格式</label>
                                        <input
                                          type="text"
                                          placeholder="如: PSD / PNG / MP4"
                                          value={config.specs?.fileFormat || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'fileFormat', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">文件命名规范</label>
                                        <input
                                          type="text"
                                          placeholder="如: [国家]_[产品]_[版本]"
                                          value={config.specs?.namingConvention || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'namingConvention', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">已有文案 / 宣传词</label>
                                        <textarea
                                          rows={2}
                                          placeholder="在此粘贴既有文案大纲或主打Slogan..."
                                          value={config.specs?.copywriting || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'copywriting', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2 text-xs text-slate-800 resize-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">参考分镜 / 脚本文档</label>
                                        <textarea
                                          rows={2}
                                          placeholder="在此填写云文档链接或分镜参考要求..."
                                          value={config.specs?.storyboard || ''}
                                          onChange={(e) => updateSkuSpecField(id, 'storyboard', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2 text-xs text-slate-800 resize-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer Action Bar */}
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-500">
                  共选定 <strong className="text-slate-900 font-bold">{selectedSKUIds.length}</strong> 个创意规格
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xs text-slate-400">预估订单总金额:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                  {totalRushFee > 0 && (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      含工期加急服务费 +¥{totalRushFee.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-slate-200 cursor-pointer text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs transition-colors"
                  id="cancel-modal-btn"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={selectedSKUIds.length === 0}
                  className="px-6 py-2 font-bold rounded-xl text-xs transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1.5"
                  id="submit-order-btn"
                >
                  <span>确认创建订单</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      <SKUComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        skus={MOCK_SKUS.filter(s => s.secondCategory === currentSecondCategory && s.thirdCategory === effectiveThirdCategory)}
        selectedSKUIds={selectedSKUIds}
        onToggleSKU={(sku) => toggleSKU(sku)}
        onPreviewImages={(imgs, idx) => setLightboxData({ images: imgs, initialIndex: idx })}
      />

      {/* Case Lightbox Modal */}
      <CaseLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        images={lightboxData?.images || []}
        initialIndex={lightboxData?.initialIndex ?? 0}
      />
    </>
  );
}
