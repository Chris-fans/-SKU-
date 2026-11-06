import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  Box,
  Pin,
  History,
  Link2,
  Download,
  PlayCircle,
  MoreHorizontal,
  Calendar,
  X,
  CheckCircle2,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { MOCK_PROJECTS } from './data';
import CreateOrderModal from './components/CreateOrderModal';

interface OrderCardItem {
  id: string;
  orderNumber: string;
  orderSource: '内需' | '外需';
  categoryTag: string;
  unitPrice: number;
  currency?: string;
  opProject?: string;
  deliveryDate?: string;
  requester?: string;
  pm?: string;
  vendorInfo?: string;
  status: '进行中' | '已完成' | '已取消';
  createdAt: string;
}

// Initial 2 order cards exactly matching the user's design screenshot
const INITIAL_SCREENSHOT_ORDERS: OrderCardItem[] = [
  {
    id: 'ord-38418',
    orderNumber: '38418',
    orderSource: '内需',
    categoryTag: '平面 | 品效原创 | APP × 10',
    unitPrice: 3000,
    currency: 'CNY',
    opProject: '',
    deliveryDate: '-',
    requester: 'mason.wang',
    pm: 'mason.wang',
    status: '进行中',
    createdAt: '2026-11-05 14:20'
  },
  {
    id: 'ord-38417',
    orderNumber: '38417',
    orderSource: '内需',
    categoryTag: '平面 | 品效原创 | APP × 10',
    unitPrice: 3000,
    currency: 'CNY',
    opProject: '【项目】【2025-08-29】【永安旅游】',
    deliveryDate: '-',
    requester: 'mason.wang',
    pm: 'mason.wang',
    vendorInfo: '外包: 携程出海_(企业-美元) 国际投放组01、出海素材邮件迁移（已结算 1/5）',
    status: '进行中',
    createdAt: '2026-11-05 11:05'
  }
];

// 携程-trip.com 核心出海业务项目列表 (永安旅游、FB、FB-HK)
const TRIP_PROJECTS = [
  '永安旅游',
  'FB',
  'FB-HK'
];

export default function App() {
  const [orderCards, setOrderCards] = useState<OrderCardItem[]>(INITIAL_SCREENSHOT_ORDERS);
  const [newCardIds, setNewCardIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Left sidebar tree states
  const [searchTree, setSearchTree] = useState<string>('');
  const [onlyMine, setOnlyMine] = useState<boolean>(true);
  const [activeProjectName, setActiveProjectName] = useState<string>('永安旅游');
  const [activeProjectId] = useState<string>('p-trip-ya');

  // Trigger toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Create new order handler (submits from CreateOrderModal)
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
    }[];
    notes: string;
    totalAmount: number;
  }) => {
    // Generate 1 or multiple cards directly in the order list based on selected SKUs
    const newCards: OrderCardItem[] = orderData.items.map((item, idx) => {
      const highestNum = orderCards.reduce((max, c) => Math.max(max, parseInt(c.orderNumber) || 38418), 38418);
      const nextNum = String(highestNum + idx + 1);
      const catPrefix = item.category.includes('平面') ? '平面' : item.category.includes('视频') ? '视频' : '创意';

      return {
        id: `ord-${nextNum}-${Date.now()}-${idx}`,
        orderNumber: nextNum,
        orderSource: (orderData.orderSource as '内需' | '外需') || '内需',
        categoryTag: `${catPrefix} | ${item.skuTitle} | APP × ${item.quantity}`,
        unitPrice: item.unitPrice,
        currency: item.currency || 'CNY',
        opProject: orderData.opProject ? `【项目】【${new Date().toISOString().slice(0, 10)}】【${orderData.opProject}】` : `【项目】【${new Date().toISOString().slice(0, 10)}】【${activeProjectName}】`,
        deliveryDate: item.deliveryDate || '-',
        requester: 'mason.wang',
        pm: 'mason.wang',
        status: '进行中',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    });

    const createdIds = newCards.map(c => c.id);
    setNewCardIds(prev => [...createdIds, ...prev]);

    // Keep highlight active for 8 seconds, then smoothly transition back to standard style
    setTimeout(() => {
      setNewCardIds(prev => prev.filter(id => !createdIds.includes(id)));
    }, 8000);

    setOrderCards(prev => [...newCards, ...prev]);
    setIsModalOpen(false);
    triggerToast(`🎉 订单创建成功！已新增 ${newCards.length} 个订单项卡片至当前项目订单列表中。`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans antialiased">
      {/* ========================================================
          1. 顶部全局导航栏 (Top Navbar) - 1:1 对齐设计稿
      ======================================================== */}
      <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center space-x-6">
          {/* 系统 Logo & 标题 */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              素材订单系统
            </span>
          </div>

          {/* 导航标签 */}
          <nav className="flex items-center space-x-1.5 pl-2">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#EBF3FF] text-[#1D68F2] transition-colors"
            >
              订单管理
            </button>
            <div className="relative">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                我的待办
              </button>
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </div>
          </nav>
        </div>

        {/* 右侧用户个人信息 */}
        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-85 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 flex items-center justify-center text-white text-[11px] font-bold">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-slate-700">飞书深诺</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </header>

      {/* ========================================================
          2. 主体内容布局: 左侧侧边栏 + 右侧主工作区
      ======================================================== */}
      <div className="flex-1 p-4 flex gap-4 max-w-[1920px] w-full mx-auto">
        {/* ========================================================
            左侧导航树面板 (Left Sidebar) - 1:1 对齐设计稿
        ======================================================== */}
        <aside className="w-[260px] flex-shrink-0 bg-white rounded-2xl border border-slate-200/80 p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-3">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索产品/项目"
                value={searchTree}
                onChange={(e) => setSearchTree(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* 筛选与新建产品行 */}
            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={onlyMine}
                  onChange={(e) => setOnlyMine(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>仅我参与</span>
              </label>
              <button
                type="button"
                className="text-slate-600 hover:text-blue-600 flex items-center space-x-0.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建出海产品</span>
              </button>
            </div>

            {/* 置顶分类 */}
            <div className="pt-1">
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 px-1 mb-1.5">
                <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>已置顶</span>
              </div>

              {/* 树节点列表 */}
              <div className="space-y-1 text-xs">
                {/* 节点 1 */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                  <div className="flex items-center space-x-1.5 truncate">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">飞书测试专用-结构化-A...</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100">APP</span>
                    <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </div>
                </div>

                {/* 节点 2: 追觅扫地机 (展开) */}
                <div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                    <div className="flex items-center space-x-1.5 truncate">
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">追觅扫地机</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100">APP</span>
                      <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </div>
                  </div>
                  <div className="pl-6 py-1 flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                    <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>演示项目</span>
                  </div>
                </div>

                {/* 节点 3: Rivan的出海产品 */}
                <div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                    <div className="flex items-center space-x-1.5 truncate">
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">Rivan的出海产品</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100 flex-shrink-0">APP</span>
                  </div>
                  <div className="pl-6 py-1 flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                    <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>rivan</span>
                  </div>
                </div>

                {/* 节点 4: 蔡洪洋的测试产品 */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                  <div className="flex items-center space-x-1.5 truncate">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">蔡洪洋的测试产品</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100 flex-shrink-0">APP</span>
                </div>

                {/* 节点 5: 测试rivan-PolyBuzz */}
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                  <div className="flex items-center space-x-1.5 truncate">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">测试rivan-PolyBuzz</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100 flex-shrink-0">APP</span>
                </div>

                {/* 真实出海产品节点: 携程-trip.com (APP) - 来源于设计截图 */}
                <div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-800">
                    <div className="flex items-center space-x-1.5 truncate">
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <Box className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate font-semibold text-slate-800">携程-trip.com</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100 flex-shrink-0">APP</span>
                  </div>

                  {/* 真实项目子列表 */}
                  <div className="space-y-0.5 mt-0.5">
                    {TRIP_PROJECTS.map((proj) => {
                      const isSelected = activeProjectName === proj;
                      return (
                        <div
                          key={proj}
                          onClick={() => setActiveProjectName(proj)}
                          className={`pl-5 py-1.5 pr-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#EBF3FF] text-[#1D68F2] font-bold border-r-3 border-blue-600'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 truncate">
                            <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'fill-[#1D68F2] text-[#1D68F2]' : 'fill-amber-400 text-amber-500'}`} />
                            <span className="truncate">{proj}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 节点 7: 追觅吸尘器 */}
                <div>
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                    <div className="flex items-center space-x-1.5 truncate">
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <Box className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">追觅吸尘器</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-100 flex-shrink-0">APP</span>
                  </div>
                  <div className="pl-6 py-1 flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                    <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>演示项目0714</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部没有更多提示 */}
          <div className="pt-4 text-center text-xs text-slate-400 border-t border-slate-100">
            没有更多了
          </div>
        </aside>

        {/* ========================================================
            右侧主内容区 (Right Main Content) - 1:1 对齐设计稿
        ======================================================== */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col shadow-2xs min-w-0">
          {/* 项目头部卡片 (Header) */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            {/* 项目名称与代号 */}
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 font-bold text-base shadow-2xs flex-shrink-0">
                🗂️
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
                  {activeProjectName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  携程-trip.com · 出海APP全渠道营销项目 · {activeProjectName}
                </p>
              </div>
            </div>

            {/* 右侧动作栏: 历史、关联素材库、[+ 新建订单]、人员头像群 */}
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              {/* 操作历史 */}
              <button
                type="button"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
                title="操作日志"
              >
                <History className="w-4 h-4" />
              </button>

              {/* 关联素材库 */}
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>关联素材库</span>
              </button>

              {/* ★ 新建订单核心触发按钮 (点击唤起弹框) ★ */}
              <button
                type="button"
                id="btn-create-order-trigger"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-[#00B96B] hover:bg-[#00a35e] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs hover:shadow cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>新建订单</span>
              </button>

              {/* 团队成员头像堆叠 */}
              <div className="flex items-center space-x-1 pl-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  h
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  r
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  m
                </div>
                <button
                  type="button"
                  className="w-6 h-6 rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-600 flex items-center justify-center text-[11px] transition-colors cursor-pointer"
                  title="添加协作者"
                >
                  <UserPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 选项卡栏 (Tabs) */}
          <div className="mt-4 border-b border-slate-200 flex space-x-8 text-sm">
            <button
              type="button"
              className="pb-3 text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors"
            >
              项目资料
            </button>
            <button
              type="button"
              className="pb-3 text-blue-600 font-bold border-b-2 border-blue-600 cursor-pointer flex items-center"
            >
              项目下订单
            </button>
          </div>

          {/* 订单列表工具栏 (Toolbar) */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-800">
                订单列表
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {orderCards.length}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              {/* 订单状态筛选 */}
              <div className="relative">
                <select className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs text-slate-500 cursor-pointer focus:outline-none">
                  <option>订单状态</option>
                  <option>进行中</option>
                  <option>已完成</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 导出明细 */}
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>导出项目订单明细</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              订单卡片列表 (Order Card List) - 1:1 对齐设计稿
          ======================================================== */}
          <div className="mt-4 space-y-3.5 flex-1">
            <AnimatePresence initial={false}>
              {orderCards.map((card) => {
                const isNew = newCardIds.includes(card.id);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: -24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, y: -12 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                    className={`rounded-2xl border transition-all duration-700 p-4 space-y-2.5 relative overflow-hidden ${
                      isNew
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-[#f8f9fc] ring-3 ring-blue-500/20 shadow-md'
                        : 'border-slate-200/90 bg-[#f8f9fc] hover:border-blue-300 hover:shadow-xs'
                    }`}
                  >
                    {/* 卡片上层核心参数行 */}
                    <div className="flex items-center justify-between flex-wrap gap-2.5">
                      <div className="flex items-center flex-wrap gap-2.5">
                        {/* 内需/外需标签 */}
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded flex items-center space-x-0.5">
                          <span>{card.orderSource}</span>
                          <ChevronDown className="w-3 h-3 text-blue-500" />
                        </span>

                        {/* 订单编号 & 刚刚创建提示 */}
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 tracking-tight">
                            订单 {card.orderNumber}
                          </span>
                          {isNew && (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-700 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span>刚刚创建</span>
                            </span>
                          )}
                        </div>

                        {/* 规格标签 (紫色高亮) */}
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                          {card.categoryTag}
                        </span>

                      {/* 单价 */}
                      <span className="text-xs text-slate-500">
                        单价<strong className="text-slate-900 font-bold ml-0.5 font-mono">¥{card.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </span>

                      {/* 绑定 OP 项目 */}
                      {card.opProject ? (
                        <span className="inline-flex items-center space-x-1 text-xs text-blue-700 bg-blue-50/70 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                          <Link2 className="w-3 h-3 text-blue-500" />
                          <span className="truncate max-w-[280px]">{card.opProject}</span>
                          <X className="w-3 h-3 text-blue-400 hover:text-blue-600 cursor-pointer ml-0.5" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-300 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>绑定OP项目</span>
                        </button>
                      )}
                    </div>

                    {/* 右侧状态 & 动作 */}
                    <div className="flex items-center space-x-3">
                      {/* 状态徽标 */}
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{card.status}</span>
                      </span>

                      {/* 任务详情按钮 */}
                      <button
                        type="button"
                        className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-3 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>任务详情</span>
                      </button>

                      {/* 更多菜单 */}
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 卡片下层辅助信息行 */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 pt-1 border-t border-slate-100/80">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>期望交付时间: {card.deliveryDate || '-'}</span>
                    </div>
                    <span>|</span>
                    <div>
                      <span>需求方: {card.requester || 'mason.wang'}</span>
                    </div>
                    <span>|</span>
                    <div>
                      <span>PM: {card.pm || 'mason.wang'}</span>
                    </div>
                    {card.vendorInfo && (
                      <>
                        <span>|</span>
                        <div className="text-slate-400 truncate max-w-[500px]">
                          <span>{card.vendorInfo}</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ========================================================
          3. 新建订单弹窗 (CreateOrderModal)
      ======================================================== */}
      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={MOCK_PROJECTS}
        activeProjectId={activeProjectId}
        onSubmit={handleCreateOrder}
      />

      {/* ========================================================
          4. Toast 提示通知
      ======================================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
