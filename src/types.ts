export interface ProductionPrecision {
  humanAIPercent?: string; // e.g. "5:5", "3:7", "7:3"
  viCompliant?: boolean;
  creativeDirection?: 'available' | 'none'; // 可提供 / 不提供
  creativeBrief?: 'available' | 'none'; // 可提供 / 不提供
  storyboardScript?: 'available' | 'none'; // 分镜脚本: 提供 / 不提供
  postPackagingScreens?: string; // 后期包装画面: e.g. "≤1个", "≤2个"
  localizationElements?: string; // e.g. "≤1个", "≤2个", "不提供"
  designSummary?: string; // e.g. "基础合成 + 常规排版"
  customNotes?: string[];
  descriptionPoints?: string[]; // for text bullets in resize / copy / modify SKUs
}

export interface SKUCase {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  tags?: string[];
}

export interface SKU {
  id: string;
  title: string;
  subtitle: string;
  // ECBR Hierarchy
  secondCategory: '高定创意' | '品效创意' | '效果创意' | '增值服务';
  thirdCategory: string; // e.g. '品效平面', '品效视频', '创意高定平面', etc.
  fourthCategory: '原创' | '修改' | '剪辑' | '实拍' | '专项';
  tier?: 'Ultra版' | 'Pro版' | '标准版' | 'Lite版' | '尺寸拓展' | '文案修改' | '常规';
  isRecommended?: boolean;
  maturity: 'L1' | 'L2' | 'L3'; // 成熟度
  defaultPrice: number; // 执行参考价 (CNY)
  priceUnit: string; // e.g. "张", "条", "组", "单"

  // Video specifications (独立展示)
  durationShots?: string; // 时长镜头 e.g. "15-30s / 5-10个镜头", "15s内 / 4个镜头以内", "40s内", "30s内", "-"
  resolution?: string; // 分辨率 e.g. "1080P", "720P", "与物料一致", "与物料相同"

  // Pricing details from Image 2
  cbPriceCNY: string; // e.g. "¥240/张（需要额外付税点）"
  cbPriceUSD: string; // e.g. "$35/张（无需税点）"
  marketPrice?: string; // e.g. "蓝标: $35-50组 / 直客广告公司: ¥500/张"

  // Brand Standard (品牌规范)
  brandStandard: {
    stars: number; // 1 to 5
    desc: string; // e.g. "保障符合品牌调性", "遵循 VI + Playbook，兼顾美术调性"
  };

  // 需提供项
  requiredAssets: string[]; // e.g. ["品牌规范", "产品白底图", "字体", "Logo", "主推卖点", "文案", "参考图"]

  // 策略深度 / 策略精度
  strategyDepth: {
    level: string; // e.g. "2W1H精简策略", "1W1H简易策略", "3W1H标准策略", "无策略"
    desc: string; // e.g. "视觉风格本地化（配色、排版、视觉元素适配本地审美）"
  };

  // 制作精度
  productionPrecision: ProductionPrecision;

  // 履约交付参数
  revisionLimit: string; // e.g. "≤2次", "≤1次", "≤3次", "0次"
  deliveryDays: string; // e.g. "T+3工作日", "T+2工作日", "T+5工作日", "T+1工作日"
  rushRules: string; // e.g. "T+2 工作日+30%, T+1 工作日+50%"
  minOrder: string; // e.g. "20张", "50张", "10张", "按需"

  // 案例列表
  cases: SKUCase[];
  caseImages?: string[];
}

export interface SKUExtraSpecs {
  language?: string;
  dimensions?: string;
  fileFormat?: string;
  namingConvention?: string;
  copywriting?: string;
  storyboard?: string;
  specialRequirements?: string;
}

export interface SelectedSKUConfig {
  sku: SKU;
  quantity: number;
  unitPrice: number;
  deliveryDate: string;
  currency?: string;
  priceChangeReason?: string;
  priceChangeType?: string;
  specs?: SKUExtraSpecs;
}

export interface OrderItem {
  skuId: string;
  skuTitle: string;
  category: string;
  quantity: number;
  unitPrice: number;
  deliveryDate: string;
  currency?: string;
  priceChangeReason?: string;
  specs?: SKUExtraSpecs;
}

export interface Order {
  id: string;
  projectId: string;
  projectName: string;
  orderSource?: string;
  opProject?: string;
  items: OrderItem[];
  notes?: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  manager: string;
  brand: string;
}

export interface SecondCategoryInfo {
  id: '高定创意' | '品效创意' | '效果创意' | '增值服务';
  name: string;
  description: string;
  badgeColor: string;
  thirdCategories: string[];
}
