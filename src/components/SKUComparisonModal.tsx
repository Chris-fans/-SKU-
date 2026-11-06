import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Star, CheckCircle2, XCircle, SlidersHorizontal, Image as ImageIcon, Info } from 'lucide-react';
import { SKU } from '../types';
import { ATTACHED_CASE_IMAGES } from '../data';
import MaturityBadge from './MaturityBadge';

interface SKUComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  skus: SKU[];
  selectedSKUIds: string[];
  onToggleSKU: (sku: SKU) => void;
  onPreviewImages: (images: string[], initialIndex: number) => void;
}

export default function SKUComparisonModal({
  isOpen,
  onClose,
  skus,
  selectedSKUIds,
  onToggleSKU,
  onPreviewImages
}: SKUComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4.5 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  单 SKU 全维度规格对照表
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  横向对齐价格、品牌规范、策略精度、制作精度与交付履约标准
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Container - Horizontal scroll for full side-by-side comparison */}
          <div className="overflow-x-auto overflow-y-auto flex-1 p-6">
            <table className="w-full text-left border-collapse min-w-[920px] text-xs">
              <thead>
                {/* Row 1: SKU Title & Details */}
                <tr className="border-b border-slate-200">
                  <th className="py-3.5 px-4 font-bold text-slate-500 bg-slate-50/80 w-[140px] sticky left-0 z-10 border-r border-slate-200 align-top">
                    字段维度
                  </th>
                  {skus.map((sku) => {
                    const isSelected = selectedSKUIds.includes(sku.id);
                    return (
                      <th
                        key={sku.id}
                        className={`py-3.5 px-4 font-bold text-slate-900 min-w-[220px] align-top transition-colors border-r border-slate-100 ${
                          isSelected ? 'bg-blue-50/40' : 'bg-white'
                        }`}
                      >
                        <div className="space-y-1.5 min-h-[64px] flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              {sku.isRecommended && (
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                                  荐
                                </span>
                              )}
                              <span className="font-bold text-sm text-slate-900">{sku.title}</span>
                            </div>
                            <MaturityBadge maturity={sku.maturity} showPrefix={false} align="right" />
                          </div>
                          <p className="text-[11px] font-normal text-slate-500 leading-relaxed line-clamp-2">
                            {sku.subtitle}
                          </p>
                        </div>
                      </th>
                    );
                  })}
                </tr>

                {/* Row 2: Dedicated Selection Action Row - Strictly On The Same Horizontal Line! */}
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-2.5 px-4 font-bold text-slate-700 bg-slate-100/90 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    选品操作
                  </th>
                  {skus.map((sku) => {
                    const isSelected = selectedSKUIds.includes(sku.id);
                    return (
                      <th
                        key={sku.id}
                        className={`py-2.5 px-4 border-r border-slate-100 align-middle ${
                          isSelected ? 'bg-blue-50/50' : 'bg-slate-50/30'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleSKU(sku)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                              : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-300'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>已勾选规格</span>
                            </>
                          ) : (
                            <span>选择该规格</span>
                          )}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* 1. CB 刊例价 (只展示人民币，去掉税点说明) */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    CB 刊例价
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 text-slate-800 border-r border-slate-100 text-xs">
                      <div className="font-bold text-blue-600 font-mono text-sm">
                        {s.cbPriceCNY.replace(/（.*）/, '').trim()}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. 执行参考价 (只展示人民币) */}
                <tr className="bg-slate-50/20">
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    执行参考价
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 text-slate-800 border-r border-slate-100 text-xs">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        ¥{s.defaultPrice.toLocaleString()}/{s.priceUnit}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. 品牌规范 */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    品牌规范
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 border-r border-slate-100 text-xs">
                      <div className="flex items-center text-amber-500 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < s.brandStandard.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-700 leading-snug text-[11px]">{s.brandStandard.desc}</span>
                    </td>
                  ))}
                </tr>

                {/* 4. 需提供项 */}
                <tr className="bg-slate-50/20">
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    需提供项
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 border-r border-slate-100 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.requiredAssets.map((asset, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. 策略精度 */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    策略精度
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 border-r border-slate-100 text-xs">
                      <div className="font-bold text-slate-900 text-[11px] mb-1">
                        {s.strategyDepth.level}
                      </div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">
                        {s.strategyDepth.desc}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 6. 制作精度 */}
                <tr className="bg-slate-50/20">
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    <div className="flex items-center space-x-1">
                      <span>制作精度</span>
                      <div className="relative group/tooltip inline-flex items-center">
                        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover/tooltip:block z-50 w-56 p-2 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-lg pointer-events-none animate-in fade-in duration-150 font-normal">
                          如有额外需求，可在区间价内上浮
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                        </div>
                      </div>
                    </div>
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 border-r border-slate-100 text-xs align-top">
                      {s.productionPrecision.descriptionPoints && s.productionPrecision.descriptionPoints.length > 0 ? (
                        <div className="space-y-1.5 text-[11px] text-slate-700">
                          {s.productionPrecision.descriptionPoints.map((point, idx) => (
                            <div key={idx} className="leading-relaxed font-medium">
                              {point}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-[11px]">
                          {s.productionPrecision.humanAIPercent && (
                            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              <span>人机比例 {s.productionPrecision.humanAIPercent}</span>
                            </div>
                          )}
                          <div className="pl-3 space-y-1 text-slate-600 border-l border-slate-200">
                            <span className="text-slate-400 font-semibold block text-[11px]">视觉设计:</span>
                            {s.productionPrecision.viCompliant && (
                              <div className="flex items-center space-x-1 text-slate-800 font-medium">
                                <span className="text-slate-300">•</span>
                                <span>遵循品牌 VI 规范</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">
                                {s.thirdCategory.includes('视频') && s.tier === 'Lite版' ? '方案方向:' : '创意方向:'}
                              </span>
                              {s.productionPrecision.creativeDirection === 'available' ? (
                                <span className="text-emerald-600 font-medium flex items-center">
                                  可提供 <CheckCircle2 className="w-3 h-3 ml-0.5" />
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium flex items-center">
                                  不提供 <XCircle className="w-3 h-3 ml-0.5 text-rose-500" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">
                                {s.thirdCategory.includes('视频') ? '分镜脚本:' : '创意Brief:'}
                              </span>
                              {(s.productionPrecision.storyboardScript ?? s.productionPrecision.creativeBrief) === 'available' ? (
                                <span className="text-emerald-600 font-medium flex items-center">
                                  可提供 <CheckCircle2 className="w-3 h-3 ml-0.5" />
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium flex items-center">
                                  不提供 <XCircle className="w-3 h-3 ml-0.5 text-rose-500" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">
                                {s.productionPrecision.postPackagingScreens ? '后期包装:' : '本地化元素:'}
                              </span>
                              {s.productionPrecision.postPackagingScreens ? (
                                <span className="text-slate-800 font-medium">{s.productionPrecision.postPackagingScreens}</span>
                              ) : s.productionPrecision.localizationElements === '不提供' ? (
                                <span className="text-slate-400 font-medium flex items-center">
                                  不提供 <XCircle className="w-3 h-3 ml-0.5 text-rose-500" />
                                </span>
                              ) : (
                                <span className="text-slate-800 font-medium">
                                  {s.productionPrecision.localizationElements || '按需'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">设计:</span>
                              <span className="text-slate-800 font-medium">
                                {s.productionPrecision.designSummary}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6.1 时长镜头 (有视频规格时独立展示) */}
                {skus.some(s => s.durationShots) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                      时长镜头
                    </td>
                    {skus.map((s) => (
                      <td key={s.id} className="py-3 px-4 font-medium text-slate-800 border-r border-slate-100 text-xs">
                        {s.durationShots || '-'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* 6.2 分辨率 (有视频规格时独立展示) */}
                {skus.some(s => s.resolution) && (
                  <tr className="bg-slate-50/20">
                    <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                      分辨率
                    </td>
                    {skus.map((s) => (
                      <td key={s.id} className="py-3 px-4 font-medium text-slate-800 border-r border-slate-100 text-xs">
                        {s.resolution ? (
                          <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                            {s.resolution}
                          </span>
                        ) : '-'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* 7. 修改次数 */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    <div className="flex items-center space-x-1">
                      <span>修改次数</span>
                      <div className="relative group/tooltip inline-flex items-center">
                        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover/tooltip:block z-50 w-60 p-2 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-lg pointer-events-none animate-in fade-in duration-150 font-normal">
                          修改次数范围仅在双方确认的脚本范围内进行修改，不包含推翻重新设计
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                        </div>
                      </div>
                    </div>
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 font-semibold text-slate-800 border-r border-slate-100 text-xs">
                      {s.revisionLimit}
                    </td>
                  ))}
                </tr>

                {/* 8. 交付时效 */}
                <tr className="bg-slate-50/20">
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    交付时效
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 font-semibold text-slate-800 border-r border-slate-100 text-xs">
                      {s.deliveryDays}
                    </td>
                  ))}
                </tr>

                {/* 9. 工期加急 */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    工期加急
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 text-slate-700 border-r border-slate-100 text-[11px]">
                      {s.rushRules}
                    </td>
                  ))}
                </tr>

                {/* 10. 起购数量 */}
                <tr className="bg-slate-50/20">
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    起购数量
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 text-xs">
                      {s.minOrder}
                    </td>
                  ))}
                </tr>

                {/* 11. 案例 */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200 text-xs">
                    案例展示
                  </td>
                  {skus.map((s) => (
                    <td key={s.id} className="py-3 px-4 border-r border-slate-100">
                      <div className="flex items-center space-x-2">
                        {ATTACHED_CASE_IMAGES.slice(0, 2).map((img, i) => (
                          <div
                            key={i}
                            onClick={() => onPreviewImages(ATTACHED_CASE_IMAGES, i)}
                            className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer transition-all shadow-2xs hover:scale-105 flex-shrink-0"
                            title="点击查看大图"
                          >
                            <img src={img} alt="案例图" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-slate-600 font-medium">
              当前已选定 <strong className="text-slate-900 font-bold">{selectedSKUIds.length}</strong> 个创意规格
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              完成对照返回
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
