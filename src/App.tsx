import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Layers,
  Filter,
  CheckCircle,
  Clock,
  Briefcase,
  DollarSign,
  ChevronRight,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Sliders,
  Check,
  Search,
  BookOpen,
  Info,
  ExternalLink,
  RefreshCw,
  Mail,
  User,
  Sparkles,
  X
} from 'lucide-react';
import { Project, Order, SKU } from './types';
import { MOCK_PROJECTS, INITIAL_ORDERS, MOCK_SKUS, SECOND_CATEGORIES } from './data';
import CreateOrderModal from './components/CreateOrderModal';

const CURRENCY_SYMBOLS: Record<string, string> = { CNY: '¥', USD: '$', MC: '🪙' };

const formatOrderTotal = (order: Order) => {
  const totals: Record<string, number> = {};
  order.items.forEach(item => {
    const curr = item.currency || 'CNY';
    totals[curr] = (totals[curr] || 0) + (item.quantity * item.unitPrice);
  });
  
  return Object.entries(totals).map(([curr, amt]) => {
    const symbol = CURRENCY_SYMBOLS[curr] || '¥';
    return `${symbol}${amt.toLocaleString()}`;
  }).join(' + ');
};

export default function App() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
  const [preselectedProjId, setPreselectedProjId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show automatic temporary toast notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Create new order handler (submits from Modal)
  const handleCreateOrder = (orderData: {
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
      specs?: {
        language?: string;
        dimensions?: string;
        fileFormat?: string;
        namingConvention?: string;
        copywriting?: string;
        storyboard?: string;
        specialRequirements?: string;
      };
    }[];
    notes: string;
    totalAmount: number;
  }) => {
    const parentProj = projects.find(p => p.id === orderData.projectId);
    const newOrder: Order = {
      id: `order-${Math.floor(100 + Math.random() * 900)}`,
      projectId: orderData.projectId,
      projectName: orderData.opProject || (parentProj ? parentProj.name : '未知投放项目'),
      orderSource: orderData.orderSource,
      opProject: orderData.opProject,
      items: orderData.items,
      notes: orderData.notes,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsModalOpen(false);
    triggerToast(`🎉 订单 ${newOrder.id} 新建成功！已成功合并下单 ${orderData.items.length} 个创意 SKU！`);
  };

  // Delete an order
  const handleDeleteOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要取消并移出该订单吗？ (ID: ${orderId})`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedDetailOrder?.id === orderId) {
        setSelectedDetailOrder(null);
      }
      triggerToast('🗑️ 订单已被成功取消移出。');
    }
  };

  // Update Status of an order for demonstration of state modification
  const handleUpdateStatus = (orderId: string, nextStatus: 'pending' | 'processing' | 'completed') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    }));
    if (selectedDetailOrder?.id === orderId) {
      setSelectedDetailOrder(prev => prev ? { ...prev, status: nextStatus } : null);
    }
    const statusMap = {
      pending: '待确认',
      processing: '制作交付中',
      completed: '已完成/已交付'
    };
    triggerToast(`✅ 订单状态已更新为 [${statusMap[nextStatus]}]`);
  };

  // Filter orders based on user inputs
  const filteredOrders = orders.filter(o => {
    const matchesProject = selectedProjectFilter === 'all' || o.projectId === selectedProjectFilter;
    
    // Search in project brand, main instruction, or SKU titles
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      o.projectName.toLowerCase().includes(normalizedQuery) ||
      o.id.toLowerCase().includes(normalizedQuery) ||
      (o.notes && o.notes.toLowerCase().includes(normalizedQuery)) ||
      o.items.some(item => item.skuTitle.toLowerCase().includes(normalizedQuery));

    return matchesProject && matchesSearch;
  });

  // Calculate Metrics from reactive react state
  const totalAmountSum = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing').length;
  
  // Collect how many unique SKU specs have been ordered
  const uniqueSKUCount = Array.from(new Set(orders.flatMap(o => o.items.map(item => item.skuId)))).length;

  // Help generate simulated custom Automate QC list for detail drawer matching screenshot's notes
  const getAutomatedQCRules = (category: string, title: string) => {
    const rules: string[] = [];
    if (category.includes('高定') || title.includes('Ultra') || title.includes('TVC')) {
      rules.push('【专家级策略深度QC】通过垂直领域专家人工审查，确认符合全球战略调性');
      rules.push('【4K/超写实光影标准】画面无噪点，色调符合全球影音母带级色彩空间');
    }
    if (title.includes('平面') || category.includes('平面')) {
      rules.push('【平面硬通QC】文案边缘腾退 5% 安全区；不含虚假绝对化宣传敏感词汇（如最、第一等）');
      rules.push('【视觉色彩与VI核对】检查色彩配置文件，严格遵循品牌色卡与通用移动端推荐展示色调');
    } else if (title.includes('视频') || category.includes('视频') || title.includes('剪辑')) {
      rules.push('【黄金3秒完播法则】头3秒嵌入高冲击力视觉 Hook，不含静止画面或不规则硬切');
      rules.push('【音频声轨配音】音量基准在 -14 LUFS，双声道左右耳无反相或音画不同步问题');
    }
    if (title.includes('尺寸') || title.includes('修改')) {
      rules.push('【尺寸比例审核】多格式画布（9:16、4:5、1:1等）中心聚焦和边缘硬裁切，确保文案不穿帮');
      rules.push('【本地化翻译QC】小语种字符数溢出换行校对，确保字体集支持所有对应语系符号');
    }
    if (category.includes('增值服务') || title.includes('诊断') || title.includes('顾问')) {
      rules.push('【策略洞察可落地性】交付物附带完整数据归因溯源与可执行动作清单');
    }
    if (rules.length === 0) {
      rules.push('【通用质检QC】符合品牌 VI 基础规范与交付格式校验');
    }
    return rules;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans flex flex-col antialiased">
      {/* Toast Notifier */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-800"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00c087] animate-pulse" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand info */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-violet-200">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-950 font-display tracking-tight">创意星链多SKU下单舱</span>
                <span className="bg-violet-50 text-violet-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-violet-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                  <span>交互增强版</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">智能合并订单规格数量，一键对接自动化 QC 流水线审核体系</p>
            </div>
          </div>

          {/* Real-time Environment status & User profile info */}
          <div className="flex items-center space-x-5 text-xs text-slate-500">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">账户:</span>
              <span className="font-mono text-slate-600">rivantqf@gmail.com</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>标准北京时间: 2026-06-16</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Pane */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Dynamic Metric overview cards block */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">累计下单总额</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xs text-slate-500 font-semibold">¥</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {totalAmountSum.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 flex items-center space-x-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>实时运算更新</span>
              </p>
            </div>
            <div className="p-3.5 bg-violet-50 text-violet-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">活动中项目数量</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {projects.length} <span className="text-sm font-medium text-slate-400">个</span>
              </div>
              <p className="text-[11px] text-slate-400">涵盖 Dreame, Ecovacs 等知名品牌</p>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">已定创意 SKU 种数</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {uniqueSKUCount} <span className="text-sm font-medium text-slate-400">种</span>
              </div>
              <p className="text-[11px] text-slate-400">
                涉及 {orders.flatMap(o => o.items).length} 条具体配置规范
              </p>
            </div>
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">待审核 & 加工订单</span>
              <div className="flex space-x-3 text-2xl font-black text-slate-900 font-mono">
                <div>
                  {pendingOrdersCount} <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">待审核</span>
                </div>
                <div>
                  {processingOrdersCount} <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">制作中</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">合并交付能提效超过 35%</p>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Dashboard Orders grid row actions & filters */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-2xs overflow-hidden">
          {/* Actions & query filter toolbar */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Project Filter Tab Pill & Search combo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Filter className="w-4 h-4" />
                </span>
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="bg-white border border-slate-200 focus:border-violet-500 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 transition-all pointer"
                >
                  <option value="all">📁 全部项目视图</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name.length > 20 ? `${p.name.slice(0, 20)}...` : p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword query search */}
              <div className="relative flex-1 sm:w-60">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="搜索订单ID、规格或备注..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 transition-all"
                />
              </div>

              {/* Reset Filters helper */}
              {(selectedProjectFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => { setSelectedProjectFilter('all'); setSearchQuery(''); }}
                  className="p-2 text-xs text-slate-500 hover:text-violet-600 font-medium flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>清除筛选</span>
                </button>
              )}
            </div>

            {/* Crucial Create Button (triggers multi-select modal) */}
            <button
              onClick={() => {
                setPreselectedProjId(selectedProjectFilter !== 'all' ? selectedProjectFilter : '');
                setIsModalOpen(true);
              }}
              className="bg-[#00c087] hover:bg-[#00ab78] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 pointer self-end md:self-auto"
              id="dashboard-create-order-btn"
            >
              <Plus className="w-4.5 h-4.5 stroke-[3]" />
              <span>新建订单</span>
            </button>
          </div>

          {/* Orders Listing */}
          <div className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
                <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-500">
                  {searchQuery || selectedProjectFilter !== 'all' ? '没有匹配上述筛选条件的订单' : '当前没有任何订单'}
                </p>
                <p className="text-xs text-slate-400 mt-1">您可以点击右上方 “新建订单” 开始进行多 SKU 创意并合单提交</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const statusConfig = {
                  pending: { label: '待确认', bg: 'bg-amber-50 text-amber-700 border-amber-100' },
                  processing: { label: '制作中', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                  completed: { label: '已交付', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
                };
                const currentStatus = statusConfig[order.status];

                return (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-slate-50/70 transition-all cursor-pointer"
                    onClick={() => setSelectedDetailOrder(order)}
                    id={`order-row-${order.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Project title & overall order ID details */}
                      <div className="space-y-1.5 flex-1 select-none">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            ID: {order.id}
                          </span>
                          <span className="text-[13px] font-bold text-slate-800 hover:text-violet-700 transition-colors">
                            {order.projectName}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 border rounded-md ${currentStatus.bg}`}>
                            {currentStatus.label}
                          </span>
                        </div>

                        {/* Creative Brief instruction / summary note snippet */}
                        {order.notes && (
                          <p className="text-[12px] text-slate-400 italic line-clamp-1 ml-1 max-w-2xl">
                            " {order.notes} "
                          </p>
                        )}

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 ml-1">
                          <span>创建时间: {order.createdAt}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-600 bg-violet-50/70 text-violet-700 px-1.5 py-0.2 rounded-sm text-[11px]">
                            合并 {order.items.length} 种 SKU
                          </span>
                        </div>
                      </div>

                      {/* Middle: Grid list showing all selected SKUs in the order (Highlighting Multi-SKU selection) */}
                      <div className="w-full lg:w-1/3 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs">
                        <span className="text-[11px] uppercase tracking-wide font-bold text-slate-400 block mb-1.5 ml-1">
                          下单 SKU 参数明细
                        </span>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
                              <div className="flex items-center space-x-1.5 truncate">
                                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                                  item.category.includes('品效') ? 'bg-blue-100 text-blue-700' :
                                  item.category.includes('高定') ? 'bg-purple-100 text-purple-700' :
                                  item.category.includes('效果') ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.category}
                                </span>
                                <span className="font-medium truncate max-w-[130px]">{item.skuTitle}</span>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-2 font-mono text-[11px]">
                                <span className="font-semibold text-slate-800">{item.quantity} 件</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-500">
                                  {CURRENCY_SYMBOLS[item.currency || 'CNY'] || '¥'}{item.unitPrice}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Total Price sum & Navigation Trigger arrow */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <span className="block text-[11px] text-slate-400">一并下单总金额</span>
                          <span className="text-sm font-black text-violet-700 font-mono bg-violet-50 border border-violet-100/50 rounded-lg px-2 py-1 block mt-0.5">
                            {formatOrderTotal(order)}
                          </span>
                        </div>

                        {/* Action buttons list */}
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setSelectedDetailOrder(order)}
                            className="p-2 rounded-xl text-slate-600 hover:text-violet-750 hover:bg-slate-100 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteOrder(order.id, e)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                            title="取消订单"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-slate-300 hidden sm:block" />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ECBR Category Hierarchy Guide */}
        <section className="bg-slate-100/60 p-6 rounded-3xl border border-slate-200/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                <span>ECBR 创意库类目体系与规范指南</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                以品牌资产沉淀与投放效果为双核驱动，多层级精细化分工，匹配自动化 QC 与专属履约标准
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {SECOND_CATEGORIES.map(c => {
                const count = MOCK_SKUS.filter(s => s.secondCategory === c.id).length;
                return (
                  <span key={c.id} className="bg-white py-1 px-2.5 rounded-lg font-semibold text-slate-600 border border-slate-200 shadow-2xs">
                    {c.name} {count} 种规格
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECOND_CATEGORIES.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      c.badgeColor === 'blue' ? 'bg-blue-600' :
                      c.badgeColor === 'purple' ? 'bg-purple-600' :
                      c.badgeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`} />
                    <h5 className="font-bold text-xs text-slate-900">{c.name}</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                  三级类目: {c.thirdCategories.join('、')}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating detail drawer slide-over panel */}
      <AnimatePresence>
        {selectedDetailOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailOrder(null)}
              className="fixed inset-0 bg-black z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-md font-mono">
                      订单 {selectedDetailOrder.id}
                    </span>
                    <span className="text-xs text-slate-400">详细状态</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1 truncate max-w-[320px]">
                    {selectedDetailOrder.projectName}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedDetailOrder(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Drawer scrollable list details */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* 1. Status picker card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    修改创意进度
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pending', 'processing', 'completed'] as const).map((st) => {
                      const isActive = selectedDetailOrder.status === st;
                      const labels = { pending: '待确认', processing: '制作中', completed: '已交付' };
                      
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedDetailOrder.id, st)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border pointer ${
                            isActive
                              ? st === 'pending' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                                st === 'processing' ? 'bg-indigo-100 border-indigo-300 text-indigo-800' :
                                'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          {labels[st]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. List of merged SKUs configs in detail */}
                <div className="space-y-3">
                  <h5 className="text-[13px] font-bold text-slate-800 border-l-2 border-violet-600 pl-2">
                    合并下单之创意 SKU 明细清单
                  </h5>
                  
                  <div className="space-y-3">
                    {selectedDetailOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-zinc-50/50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-slate-200 text-slate-700 font-bold text-[11px] px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">子项 #{idx + 1}</span>
                        </div>
                        <h6 className="font-bold text-slate-800 text-sm">{item.skuTitle}</h6>
                        
                        {/* Parameters details */}
                        <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 text-center">
                          <div>
                            <span className="block text-[11px] text-slate-400">订购数量</span>
                            <span className="font-bold text-slate-700 font-mono text-xs">{item.quantity} 件</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-slate-400">创意单价</span>
                            <span className="font-bold text-slate-700 font-mono text-xs">
                              {CURRENCY_SYMBOLS[item.currency || 'CNY'] || '¥'}{item.unitPrice}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-slate-400">小计金额</span>
                            <span className="font-bold text-violet-700 font-mono text-xs">
                              {CURRENCY_SYMBOLS[item.currency || 'CNY'] || '¥'}{(item.quantity * item.unitPrice).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Delivery date */}
                        <div className="flex items-center space-x-1.5 text-xs text-slate-550 pt-1 border-t border-dotted border-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>期望交付期: <strong className="text-slate-700 font-semibold">{item.deliveryDate}</strong></span>
                        </div>

                        {/* Extra Specs / Non-mandatory details if present */}
                        {item.specs && Object.values(item.specs).some(v => typeof v === 'string' && v.trim().length > 0) && (
                          <div className="mt-1.5 p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5 text-[11px]">
                            <span className="font-bold text-blue-900 block">补充交付标准与参数：</span>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
                              {item.specs.language && <div><span className="text-slate-400">语言: </span>{item.specs.language}</div>}
                              {item.specs.dimensions && <div><span className="text-slate-400">尺寸/比例: </span>{item.specs.dimensions}</div>}
                              {item.specs.fileFormat && <div><span className="text-slate-400">格式: </span>{item.specs.fileFormat}</div>}
                              {item.specs.namingConvention && <div><span className="text-slate-400">命名: </span>{item.specs.namingConvention}</div>}
                            </div>
                            {item.specs.copywriting && (
                              <div className="text-slate-600 pt-1 border-t border-blue-100/60">
                                <span className="text-slate-400">文案: </span>{item.specs.copywriting}
                              </div>
                            )}
                            {item.specs.storyboard && (
                              <div className="text-slate-600">
                                <span className="text-slate-400">脚本/分镜: </span>{item.specs.storyboard}
                              </div>
                            )}
                            {item.specs.specialRequirements && (
                              <div className="text-slate-600">
                                <span className="text-slate-400">特殊要求: </span>{item.specs.specialRequirements}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Price change reason */}
                        {item.priceChangeReason && (
                          <div className="mt-1.5 p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start space-x-1.5 text-[11px] text-amber-800 leading-relaxed">
                            <span className="font-bold flex-shrink-0">改价原因:</span>
                            <span>{item.priceChangeReason}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Simulated Automatic QC Hard Conditions (Critical match back to screenshot 2 description) */}
                <div className="space-y-3 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50">
                  <div className="flex items-center space-x-1.5 text-indigo-900">
                    <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
                    <h5 className="font-bold text-xs uppercase tracking-wide">
                      本项目自动化 QC 应通项核质清单 (AI质检)
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    创意星链依据您合并下的 SKU，定制在交付时核心的机器审核过滤规程。只有所有硬通项通过审核后方执行支付。
                  </p>

                  <div className="space-y-2 mt-2">
                    {selectedDetailOrder.items.map((item, mainIdx) => {
                      const ruleSet = getAutomatedQCRules(item.category, item.skuTitle);
                      return ruleSet.map((rule, ruleIdx) => (
                        <div key={`${mainIdx}-${ruleIdx}`} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                          <div className="w-4 h-4 rounded-full bg-violet-100 text-violet-750 flex items-center justify-center font-bold text-[11px] mt-0.5 flex-shrink-0">
                            ✓
                          </div>
                          <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            {rule}
                          </span>
                        </div>
                      ));
                    })}
                  </div>
                </div>

                {/* 4. Notes and requirements */}
                {selectedDetailOrder.notes && (
                  <div className="space-y-1.5">
                    <h5 className="text-[13px] font-bold text-slate-800">Brief 及制作要求备注</h5>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
                      "{selectedDetailOrder.notes}"
                    </div>
                  </div>
                )}

                {/* Total amount sum label */}
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-2xl border border-violet-150">
                  <span className="text-xs font-bold text-violet-800">总预估应付金额:</span>
                  <span className="font-mono font-black text-sm text-violet-800 bg-white px-3 py-1 rounded-xl border border-violet-100 shadow-3xs">
                    {formatOrderTotal(selectedDetailOrder)}
                  </span>
                </div>

              </div>
              
              {/* Drawer Footer actions */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedDetailOrder.id, { stopPropagation: () => {} } as any)}
                  className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>作废该订单</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDetailOrder(null)}
                    className="px-5 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold pointer transition-all border border-transparent hover:border-slate-200"
                  >
                    关闭窗口
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast('📝 已导出该合并订单的标准化 Brief 文件包！');
                    }}
                    className="py-2 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold pointer transition-all flex items-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>导出 Brief</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main interactive SKU selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateOrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            projects={projects}
            activeProjectId={preselectedProjId}
            onSubmit={handleCreateOrder}
          />
        )}
      </AnimatePresence>

      {/* Modern footer details */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p className="font-semibold text-slate-300">多SKU并流下单智能创意控制舱</p>
          <p className="text-slate-500 font-mono">
            ID: {`Applet 386ba674`} • 登录用户: rivantqf@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}
