import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Star,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Layers,
  Image as ImageIcon,
  FileCheck2,
  ZoomIn,
  Info,
  Film
} from 'lucide-react';
import { SKU } from '../types';
import { ATTACHED_CASE_IMAGES } from '../data';

interface SKUCardProps {
  key?: React.Key;
  sku: SKU;
  isSelected: boolean;
  orderSource?: '内需' | '外需';
  onToggle: () => void;
  onPreviewImages: (images: string[], initialIndex: number) => void;
}

export default function SKUCard({
  sku,
  isSelected,
  orderSource = '内需',
  onToggle,
  onPreviewImages
}: SKUCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Use images specific to this SKU or fallback to attached case images
  const displayImages = (sku.caseImages && sku.caseImages.length > 0)
    ? sku.caseImages
    : ATTACHED_CASE_IMAGES;

  // Show exactly 2 case images on the card
  const previewTwoImages = displayImages.slice(0, 2);

  // Clean single price display (RMB default for demo, or USD if orderSource is 外需)
  const isUSD = orderSource === '外需';
  const priceText = isUSD
    ? sku.cbPriceUSD.replace(/（.*）/, '').trim()
    : sku.cbPriceCNY.replace(/（.*）/, '').trim();

  return (
    <div
      className={`h-full relative rounded-2xl border transition-colors duration-150 flex flex-col bg-white ${
        isSelected
          ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
          : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
      }`}
    >
      {/* Top Tag & Header */}
      <div className="p-4 pb-3 flex items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/40 rounded-t-2xl min-h-[72px]">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            {sku.isRecommended && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white flex-shrink-0">
                荐
              </span>
            )}
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {sku.title}
            </h4>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {sku.subtitle}
          </p>
        </div>

        {/* Checkbox Trigger */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
            isSelected
              ? 'bg-blue-600 text-white shadow-xs'
              : 'border border-slate-300 hover:border-blue-400 bg-white'
          }`}
          title={isSelected ? '取消选定' : '勾选加入清单'}
        >
          {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
        </button>
      </div>

      {/* Main Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* =========================================
            1. 价格展示 (直接展示人民币单价，去掉CB刊例价、起购数量与税点文案)
        ========================================= */}
        <div className="bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bold">价格</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-bold text-blue-600 font-mono text-base tracking-tight">
              {priceText}
            </span>
          </div>
        </div>

        {/* =========================================
            2. 策略深度 (Strategy Depth)
        ========================================= */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>策略深度</span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {sku.strategyDepth.level}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug bg-slate-50/50 p-2 rounded-lg border border-slate-100/80 min-h-[46px]">
            {sku.strategyDepth.desc}
          </p>
        </div>

        {/* =========================================
            3. 制作精度 (Production Precision)
        ========================================= */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>制作精度</span>
              </span>
              <div className="relative group/tooltip inline-flex items-center">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tooltip:block z-50 w-52 p-2 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-lg text-center pointer-events-none animate-in fade-in duration-150 font-normal">
                  如有额外需求，可在区间价内上浮
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
            {sku.productionPrecision.humanAIPercent ? (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                人机比例 {sku.productionPrecision.humanAIPercent}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                按需调整
              </span>
            )}
          </div>

          {sku.productionPrecision.descriptionPoints && sku.productionPrecision.descriptionPoints.length > 0 ? (
            /* 平面尺寸拓展 & 平面文案修改等定制规格点 */
            <div className="space-y-1 text-[11px] bg-slate-50/60 p-2.5 rounded-lg border border-slate-100/80 text-slate-700 min-h-[92px]">
              {sku.productionPrecision.descriptionPoints.map((point, idx) => (
                <div key={idx} className="leading-relaxed font-medium">
                  {point}
                </div>
              ))}
            </div>
          ) : (
            /* 原创品效平面 / 品效视频标准版 / Lite版 / Pro版等设计规格 (按品效平面排版展示结构化包含项) */
            <div className="space-y-1.5 text-[11px] bg-slate-50/60 p-2.5 rounded-lg border border-slate-100/80 text-slate-700 min-h-[92px]">
              {/* 1. 遵循品牌 VI 规范 */}
              {sku.productionPrecision.viCompliant && (
                <div className="flex items-center space-x-1 text-slate-800 font-medium pb-1 border-b border-slate-200/50">
                  <span className="text-slate-400">•</span>
                  <span>遵循品牌 VI 规范</span>
                </div>
              )}

              {/* 2 & 3. 创意方向 / 方案方向 & 分镜脚本 / 创意Brief */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500">
                    {sku.thirdCategory.includes('视频') && sku.tier === 'Lite版' ? '方案方向:' : '创意方向:'}
                  </span>
                  {sku.productionPrecision.creativeDirection === 'available' ? (
                    <span className="text-emerald-600 font-medium flex items-center">
                      可提供 <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium flex items-center">
                      不提供 <XCircle className="w-3.5 h-3.5 ml-0.5 text-rose-500" />
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 justify-end text-right">
                  <span className="text-slate-500">
                    {sku.thirdCategory.includes('视频') ? '分镜脚本:' : '创意Brief:'}
                  </span>
                  {(sku.productionPrecision.storyboardScript ?? sku.productionPrecision.creativeBrief) === 'available' ? (
                    <span className="text-emerald-600 font-medium flex items-center">
                      可提供 <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium flex items-center">
                      不提供 <XCircle className="w-3.5 h-3.5 ml-0.5 text-rose-500" />
                    </span>
                  )}
                </div>
              </div>

              {/* 4 & 5. 后期包装画面 / 本地化元素 & 设计 */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500">
                    {sku.productionPrecision.postPackagingScreens ? '后期包装:' : '本地化元素:'}
                  </span>
                  {sku.productionPrecision.postPackagingScreens ? (
                    <strong className="text-slate-800 font-semibold">{sku.productionPrecision.postPackagingScreens}</strong>
                  ) : sku.productionPrecision.localizationElements === '不提供' ? (
                    <span className="text-slate-400 font-medium flex items-center">
                      不提供 <XCircle className="w-3.5 h-3.5 ml-0.5 text-rose-500" />
                    </span>
                  ) : (
                    <strong className="text-slate-800 font-semibold">{sku.productionPrecision.localizationElements || '按需'}</strong>
                  )}
                </div>
                <div className="text-right truncate max-w-[140px]">
                  <span className="text-slate-500 mr-1">设计:</span>
                  <strong className="text-slate-800 font-semibold" title={sku.productionPrecision.designSummary}>
                    {sku.productionPrecision.designSummary}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================
            视频规格 (时长镜头 & 分辨率 - 独立专属展示)
        ========================================= */}
        {(sku.durationShots || sku.resolution) && (
          <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100 space-y-1.5 min-h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                <Film className="w-3.5 h-3.5 text-purple-600" />
                <span>视频规格</span>
              </span>
              <span className="text-[11px] text-slate-400">时长镜头与分辨率</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/50">
              <div className="flex items-center space-x-1">
                <span className="text-slate-500">时长镜头:</span>
                <span className="font-semibold text-slate-800 truncate" title={sku.durationShots}>
                  {sku.durationShots || '-'}
                </span>
              </div>
              <div className="flex items-center space-x-1 justify-end text-right">
                <span className="text-slate-500">分辨率:</span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                  {sku.resolution || '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            4. 案例展示 (展示两张图片，点击可放大左右滑动)
        ========================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>案例展示 ({displayImages.length})</span>
            </span>
            <span className="text-[11px] text-slate-400">点击放大支持滑动</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {previewTwoImages.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewImages(displayImages, idx);
                }}
                className="group relative h-22 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer bg-slate-100 transition-all shadow-2xs hover:shadow-xs"
              >
                <img
                  src={imgSrc}
                  alt={`案例缩略图 ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="flex items-center space-x-1 text-[11px] font-semibold bg-black/60 px-2 py-0.5 rounded-full">
                    <ZoomIn className="w-3 h-3" />
                    <span>查看大图</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            5. 二次交互: 展开更多参数与履约交付标准
        ========================================= */}
        <div className="pt-1.5 border-t border-slate-100 mt-auto">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-1.5 px-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center space-x-1">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{isExpanded ? '收起交付规格详情' : '展开品牌规范/交付时效/需提供项'}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-[11px] space-y-2">
                  {/* 品牌规范 */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">品牌规范要求：</span>
                    <div className="flex items-center space-x-1 text-amber-500 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < sku.brandStandard.stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-slate-700 text-[11px] ml-1 font-medium">
                        {sku.brandStandard.desc}
                      </span>
                    </div>
                  </div>

                  {/* 需提供项 */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">需提供资产项：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sku.requiredAssets.map((asset, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-slate-700 px-1.5 py-0.5 rounded text-[11px] border border-slate-200"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 交付参数网格 */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/60 text-[11px]">
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-500">修改次数：</span>
                        <strong className="text-slate-700">{sku.revisionLimit}</strong>
                        <div className="relative group/tooltip inline-flex items-center">
                          <Info className="w-3 h-3 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tooltip:block z-50 w-56 p-2 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-lg text-center pointer-events-none animate-in fade-in duration-150 font-normal">
                            修改次数范围仅在双方确认的脚本范围内进行修改，不包含推翻重新设计
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">交付时效：</span>
                      <strong className="text-slate-700">{sku.deliveryDays}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">工期加急：</span>
                      <span className="text-slate-700">{sku.rushRules}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Toggle Button */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            isSelected
              ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
              : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>已选入清单 (点击可取消)</span>
            </>
          ) : (
            <span>+ 选定该 SKU</span>
          )}
        </button>
      </div>
    </div>
  );
}
