import { SKU, Project, Order, SecondCategoryInfo } from './types';

export const SECOND_CATEGORIES: SecondCategoryInfo[] = [
  {
    id: '品效创意',
    name: '品效创意',
    description: '兼顾品牌调性与投放效果，在品牌约束下进行效果生产，并持续沉淀可复用的品牌创意资产',
    badgeColor: 'blue',
    thirdCategories: ['品效平面', '品效视频']
  },
  {
    id: '高定创意',
    name: '高定创意',
    description: '面向高价值、非标准创意命题，由垂直领域专家主导策略与创意，提供深度定制和高品质交付',
    badgeColor: 'purple',
    thirdCategories: ['创意高定平面', '创意高定视频']
  },
  {
    id: '效果创意',
    name: '效果创意',
    description: '纯效果导向，以CTR/CVR等效果数据为反馈，通过规模生产、快速测试与持续迭代，提升有效素材供给效率',
    badgeColor: 'emerald',
    thirdCategories: ['效果平面', '效果视频']
  },
  {
    id: '增值服务',
    name: '增值服务',
    description: '围绕客户自身能力缺口，提供策略、本地化、陪跑、培训、顾问、技术等专项专业服务',
    badgeColor: 'amber',
    thirdCategories: ['策略诊断', '本地化专项', 'AI / 顾问', '培训 / 陪跑', '增配项 / Add-on']
  }
];

export const ATTACHED_CASE_IMAGES = [
  '/assets/aistudio/QQ_1793676055266_8eeb765f.png',
  '/assets/aistudio/QQ_1793676099386_6c31b79b.png',
  '/assets/aistudio/QQ_1793676111119_f7e65f98.png',
  '/assets/aistudio/QQ_1793676132357_5b17b623.png',
  '/assets/aistudio/QQ_1793676148084_9010abcc.png'
];

export const MOCK_SKUS: SKU[] = [
  // ==========================================
  // 【品效创意】 - 品效平面
  // ==========================================
  {
    id: 'sku-px-pm-std',
    title: '品效平面（标准版）',
    subtitle: '品牌一致性 + 视觉风格本地化。配色、排版、视觉元素适配本地审美',
    secondCategory: '品效创意',
    thirdCategory: '品效平面',
    fourthCategory: '原创',
    tier: '标准版',
    isRecommended: true,
    maturity: 'L2',
    defaultPrice: 240,
    priceUnit: '张',
    cbPriceCNY: '¥210-300/张',
    cbPriceUSD: '$35/张（无需税点）',
    marketPrice: '蓝标: $35-50组 / 直客广告公司: ¥500/张',
    brandStandard: {
      stars: 2,
      desc: '保障符合品牌调性'
    },
    requiredAssets: ['品牌规范', '产品白底图', '字体', 'Logo', '主推卖点', '文案', '参考图'],
    strategyDepth: {
      level: '2W1H精简策略',
      desc: '视觉风格本地化（配色、排版、视觉元素适配本地审美）'
    },
    productionPrecision: {
      humanAIPercent: '5:5',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'none',
      localizationElements: '≤1个',
      designSummary: '基础合成 + 常规排版',
      customNotes: ['严格遵循品牌 VI 规范', '支持常规视觉元素重组']
    },
    revisionLimit: '≤2次',
    deliveryDays: 'T+3工作日',
    rushRules: 'T+2 工作日+30%, T+1 工作日+50%',
    minOrder: '20张',
    cases: [
      {
        id: 'c1',
        title: '北美吸尘器海报',
        subtitle: '本土居室场景调色与卖点排版',
        tags: ['北美市场', '居家痛点', '本土化审美']
      },
      {
        id: 'c2',
        title: '欧洲夏季促销海报',
        subtitle: '德法双语排版，符合当地折扣法案',
        tags: ['欧洲市场', '促销活动', '合规排版']
      },
      {
        id: 'c3',
        title: '扫地机核心参数图',
        subtitle: '毛发防缠绕特写与结构标注',
        tags: ['功能分解', 'VI强化', '高CTR']
      }
    ]
  },
  {
    id: 'sku-px-pm-lite',
    title: '品效平面（Lite版）',
    subtitle: '品牌模板批量设计，不含本地化。客户自备文案和翻译，适合有in-house 本地化能力的客户',
    secondCategory: '品效创意',
    thirdCategory: '品效平面',
    fourthCategory: '原创',
    tier: 'Lite版',
    isRecommended: false,
    maturity: 'L3',
    defaultPrice: 160,
    priceUnit: '张',
    cbPriceCNY: '¥140-200/张',
    cbPriceUSD: '$20/张（无需税点）',
    marketPrice: '暂无直客对标',
    brandStandard: {
      stars: 1,
      desc: '保障品牌基础 VI 正确'
    },
    requiredAssets: ['品牌规范', '产品白底图', '字体', 'Logo', '主推卖点', '文案', '参考图'],
    strategyDepth: {
      level: '1W1H简易策略',
      desc: '不含本地化，客户自备文案和翻译'
    },
    productionPrecision: {
      humanAIPercent: '3:7',
      viCompliant: true,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '模板套用 + 简单排版',
      customNotes: ['高吞吐批量出图', '适合海量SKU矩阵投放']
    },
    revisionLimit: '≤1次',
    deliveryDays: 'T+2工作日',
    rushRules: 'T+1 工作日+30%, 当天加急+50%',
    minOrder: '50张',
    cases: [
      {
        id: 'c4',
        title: '多型号配件模板套用',
        subtitle: '标准背景框，批量替换商品图',
        tags: ['模板套用', '快速上新', '高吞吐']
      },
      {
        id: 'c5',
        title: '电商多规格对比图',
        subtitle: '规整栅格参数排布',
        tags: ['批量制作', '电商矩阵']
      }
    ]
  },
  {
    id: 'sku-px-pm-pro',
    title: '品效平面（Pro版）',
    subtitle: '品牌一致性 + 风格、人群文化本地化。在视觉适配基础上，融入目标人群的价值观和文化偏好',
    secondCategory: '品效创意',
    thirdCategory: '品效平面',
    fourthCategory: '原创',
    tier: 'Pro版',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 500,
    priceUnit: '张',
    cbPriceCNY: '¥300-700/张',
    cbPriceUSD: '$50-100/张（无需税点）',
    marketPrice: '直客高端设计所: ¥1,200/张起',
    brandStandard: {
      stars: 4,
      desc: '遵循 VI + Playbook，兼顾美术调性'
    },
    requiredAssets: ['品牌规范', '多角度产品高清图', 'UI', '字体', 'Logo', '主推卖点'],
    strategyDepth: {
      level: '3W1H标准策略',
      desc: '风格、人群文化本地化。在视觉适配基础上，融入目标人群的价值观和文化偏好'
    },
    productionPrecision: {
      humanAIPercent: '7:3',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '≤2个',
      designSummary: '标准合成 + 卖点可视化',
      customNotes: ['资深美术指导把控', '提供专属创意Brief与方案']
    },
    revisionLimit: '≤3次',
    deliveryDays: 'T+5工作日',
    rushRules: 'T+4 工作日+30%, T+3 工作日+50%',
    minOrder: '10张',
    cases: [
      {
        id: 'c6',
        title: '旗舰新品全球首发主视觉',
        subtitle: '电影感光影与人群情绪价值渲染',
        tags: ['主视觉KeyVision', '3D合成', '文化深度']
      },
      {
        id: 'c7',
        title: '高端储能户外探险场景',
        subtitle: '真实极地环境与严苛耐用性具象化',
        tags: ['深度合成', '品牌资产沉淀']
      }
    ]
  },
  {
    id: 'sku-px-pm-resize',
    title: '平面尺寸拓展',
    subtitle: '基于已有素材进行尺寸调整以适配不同投放渠道，仅调整尺寸，不对设计内容进行调整',
    secondCategory: '品效创意',
    thirdCategory: '品效平面',
    fourthCategory: '修改',
    tier: '尺寸拓展',
    isRecommended: false,
    maturity: 'L3',
    defaultPrice: 35,
    priceUnit: '张',
    cbPriceCNY: '¥25-50/张',
    cbPriceUSD: '$4/张（无需税点）',
    marketPrice: '蓝标: $12-18/张',
    brandStandard: {
      stars: 1,
      desc: '保障品牌基础 VI 正确'
    },
    requiredAssets: ['figma链接 / psd文件 / 原图', '字体', 'Logo', '品牌规范'],
    strategyDepth: {
      level: '无策略',
      desc: '仅按版位进行构图适配'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: false,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '仅调整尺寸，不对设计内容进行调整。',
      descriptionPoints: [
        '1. 基于已有素材进行尺寸调整以适配不同投放渠道。',
        '2. 仅调整尺寸，不对设计内容进行调整。'
      ],
      customNotes: ['适配 9:16 / 1:1 / 16:9 / 4:5 等各大媒体版位']
    },
    revisionLimit: '0次',
    deliveryDays: 'T+1工作日',
    rushRules: '当天加急+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'c8',
        title: 'Meta Story / Feed 跨版位延展',
        subtitle: '1:1 主图延展至 9:16 全屏自适应安全区',
        tags: ['尺寸拓展', '版位适配', '当日交付']
      }
    ]
  },
  {
    id: 'sku-px-pm-copy',
    title: '平面文案修改',
    subtitle: '基于已有素材进行文案调整以适配不同投放计划，仅替换原素材文字信息，不调整产品视觉',
    secondCategory: '品效创意',
    thirdCategory: '品效平面',
    fourthCategory: '修改',
    tier: '文案修改',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 20,
    priceUnit: '张',
    cbPriceCNY: '¥15-30/张',
    cbPriceUSD: '$4/张（无需税点）',
    marketPrice: '行业均价: ¥30-50/张',
    brandStandard: {
      stars: 1,
      desc: '保障品牌基础 VI 正确'
    },
    requiredAssets: ['figma链接 / psd文件', '文案内容', '字体', 'Logo', '品牌规范'],
    strategyDepth: {
      level: '无策略',
      desc: '纯文字信息替换与排版微调'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: false,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '仅替换原素材中的文字信息，不调整产品、背景、主体视觉',
      descriptionPoints: [
        '1. 基于已有素材进行文案调整以适配不同投放计划。',
        '2. 仅替换原素材中的文字信息，不调整产品、背景、主体视觉'
      ],
      customNotes: ['保证字体版权合规与字距呼吸感']
    },
    revisionLimit: '0次',
    deliveryDays: 'T+1工作日',
    rushRules: '当天加急+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'c9',
        title: 'Prime Day 促销文案多语言换字',
        subtitle: '保留全部背景，替换西、德、法、意四国语言文案',
        tags: ['多语言换字', '原图无损', '闪电交图']
      }
    ]
  },

  // ==========================================
  // 【品效创意】 - 品效视频
  // ==========================================
  {
    id: 'sku-px-sp-pro',
    title: '品效视频（Pro版）',
    subtitle: '品牌一致性 + 场景设置、内容本地化。在视觉适配基础上，融入目标人群的价值观和文化偏好',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '原创',
    tier: 'Pro版',
    isRecommended: true,
    maturity: 'L1',
    defaultPrice: 800,
    priceUnit: '条',
    durationShots: '15-30s / 5个镜头 - 10个镜头',
    resolution: '1080P',
    cbPriceCNY: '¥600-1500/条',
    cbPriceUSD: '$90-220/条',
    marketPrice: '易点: ¥680-4000/条',
    brandStandard: {
      stars: 4,
      desc: '遵循品牌 VI + Playbook，兼顾美术调性'
    },
    requiredAssets: ['产品图', '字体', 'Logo', '主推卖点', 'UI', '利益点'],
    strategyDepth: {
      level: '3W1H',
      desc: '卖点与场景设置、内容本地化。在视觉适配基础上，融入目标人群的价值观和文化偏好'
    },
    productionPrecision: {
      humanAIPercent: '7:3',
      viCompliant: true,
      creativeDirection: 'available',
      storyboardScript: 'available',
      postPackagingScreens: '≤2个',
      designSummary: 'AI生成+后期包装',
      customNotes: ['使用市面前沿AI模型']
    },
    revisionLimit: '3次',
    deliveryDays: 'T+6工作日',
    rushRules: 'T+5 工作日+30%, T+4 工作日+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'cv1',
        title: '洗地机北美高转化视频广告',
        subtitle: '厨房顽固污渍即拖即净实机特效演示',
        tags: ['高完播率', '卖点Hook', '本地配音']
      }
    ]
  },
  {
    id: 'sku-px-sp-std',
    title: '品效视频（标准版）',
    subtitle: '品牌一致性 + 场景设置本地化。文案字幕、风格适配本地审美',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '原创',
    tier: '标准版',
    isRecommended: true,
    maturity: 'L2',
    defaultPrice: 450,
    priceUnit: '条',
    durationShots: '15s内 / 4个镜头以内',
    resolution: '720P',
    cbPriceCNY: '¥400-550/条',
    cbPriceUSD: '$60-80/条',
    marketPrice: '蓝标: ¥600/条（200条起做）',
    brandStandard: {
      stars: 2,
      desc: '保障品牌基础 VI 正确'
    },
    requiredAssets: ['产品图', '字体', 'Logo', '主推卖点', 'UI', '利益点'],
    strategyDepth: {
      level: '2W1H标准策略',
      desc: '卖点与场景设置本地化，文案字幕、风格适配本地审美'
    },
    productionPrecision: {
      humanAIPercent: '5:5',
      viCompliant: true,
      creativeDirection: 'available',
      storyboardScript: 'none',
      postPackagingScreens: '≤1个',
      designSummary: '视觉设计最低执行标准',
      customNotes: ['使用市面前沿AI模型']
    },
    revisionLimit: '2次',
    deliveryDays: 'T+3工作日',
    rushRules: 'T+2 工作日+30%, T+1 工作日+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'cv2',
        title: '扫地机多场景快剪',
        subtitle: '快节奏转场与重点参数弹出动效',
        tags: ['快剪', '强节奏', '高产出']
      }
    ]
  },
  {
    id: 'sku-px-sp-lite',
    title: '品效二创剪辑（Lite版）',
    subtitle: '品牌一致性 + 视频物料二创利用，不含本地化，客户自备文案和翻译',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '剪辑',
    tier: 'Lite版',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 220,
    priceUnit: '条',
    durationShots: '40s内',
    resolution: '与物料一致',
    cbPriceCNY: '¥180-300/条',
    cbPriceUSD: '$25-45/条',
    marketPrice: '蓝标: ¥350/条 200条起',
    brandStandard: {
      stars: 1,
      desc: '保障品牌基础 VI 正确'
    },
    requiredAssets: ['原视频物料', 'Logo', '字体'],
    strategyDepth: {
      level: '1W1H精简策略',
      desc: '视频物料二创利用，不含本地化，客户自备文案和翻译'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: true,
      creativeDirection: 'available',
      storyboardScript: 'none',
      postPackagingScreens: '≤2个',
      designSummary: '多内容混剪或长剪短',
      customNotes: ['AI生成或添加免费素材: ≤2个']
    },
    revisionLimit: '1次',
    deliveryDays: 'T+3工作日',
    rushRules: 'T+2工作日+30%, T+1工作日加急+50%（需写脚本的需求不支持）',
    minOrder: '按需',
    cases: [
      {
        id: 'cv3',
        title: 'KOL测评长视频二创Cut',
        subtitle: '从20分钟实测截取15秒爆款切片',
        tags: ['KOL二次剪辑', '信息流切片']
      }
    ]
  },
  {
    id: 'sku-px-sp-modify',
    title: '视频本地化修改',
    subtitle: '在原视频的基础上，使用AI工具将视频部分内容进行修改，以适配新的投放市场',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '修改',
    tier: '常规',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 150,
    priceUnit: '条',
    durationShots: '30s内',
    resolution: '与物料一致',
    cbPriceCNY: '¥150/条',
    cbPriceUSD: '$22/条',
    marketPrice: '(暂无信息)',
    brandStandard: {
      stars: 0,
      desc: '-'
    },
    requiredAssets: ['视频', '文案'],
    strategyDepth: {
      level: '无策略',
      desc: '无策略'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: false,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '在原视频的基础上，使用AI工具进行修改',
      descriptionPoints: [
        '1. 在原视频的基础上，使用AI工具将视频部分内容进行修改，以适配新的投放市场。',
        '2. 包含以下（4选2）：AI换脸、AI换场景、AI擦除原字幕、AI换旁白配音'
      ],
      customNotes: ['海外本地化AI换脸换声', '快速跨市场投放测试']
    },
    revisionLimit: '1次',
    deliveryDays: 'T+1工作日',
    rushRules: '当天加急+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'cv4',
        title: '日韩双语本地化配音换字',
        subtitle: '无字母带快速对齐日语CV及片假名字幕',
        tags: ['出海本地化', '多语言配音']
      }
    ]
  },
  {
    id: 'sku-px-sp-resize',
    title: '视频尺寸拓展',
    subtitle: '以原素材为基础，黑边/模糊/使用已有包框图方式等拓尺寸，以适配新的尺寸版式',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '修改',
    tier: '尺寸拓展',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 75,
    priceUnit: '条',
    durationShots: '-',
    resolution: '与物料相同',
    cbPriceCNY: '¥75/条',
    cbPriceUSD: '$11/条',
    marketPrice: '(暂无信息)',
    brandStandard: {
      stars: 0,
      desc: '-'
    },
    requiredAssets: ['原视频'],
    strategyDepth: {
      level: '无策略',
      desc: '无策略'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: false,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '尺寸版式拓展',
      descriptionPoints: [
        '1. 以原素材为基础，黑边/模糊/使用已有包框图方式等拓尺寸，以适配新的尺寸版式。非我方制作内容需客户提供源文件。',
        '2. *拍摄画面如需原画拓尺可参考视频剪辑；*不支持AI视频原画拓尺'
      ],
      customNotes: ['适配 9:16 / 16:9 / 1:1 / 4:5 跨媒体版位']
    },
    revisionLimit: '0次',
    deliveryDays: 'T+1工作日',
    rushRules: '当天加急+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'cv5',
        title: '9:16竖屏短视频跨版位拓尺',
        subtitle: '原画质黑边羽化与16:9转9:16安全区重排',
        tags: ['视频拓尺', '安全区适配', '快速交付']
      }
    ]
  },
  {
    id: 'sku-px-sp-content',
    title: '视频内容修改',
    subtitle: '在原视频的基础上，针对视频中的单一元素进行修改，以适配新的投放方案',
    secondCategory: '品效创意',
    thirdCategory: '品效视频',
    fourthCategory: '修改',
    tier: '常规',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 50,
    priceUnit: '条',
    durationShots: '-',
    resolution: '与物料相同',
    cbPriceCNY: '¥50/条',
    cbPriceUSD: '$8/条',
    marketPrice: '(暂无信息)',
    brandStandard: {
      stars: 0,
      desc: '-'
    },
    requiredAssets: ['文案'],
    strategyDepth: {
      level: '无策略',
      desc: '无策略'
    },
    productionPrecision: {
      humanAIPercent: '',
      viCompliant: false,
      creativeDirection: 'none',
      creativeBrief: 'none',
      localizationElements: '不提供',
      designSummary: '单一元素修改',
      descriptionPoints: [
        '1. 在原视频的基础上，针对视频中的单一元素进行修改，以适配新的投放方案。非我方制作内容需客户提供源文件。',
        '2. 包含以下（4选1）：增加字幕/产品名称等文字信息、修改价格、裁切/替换尾版、换包框贴片'
      ],
      customNotes: ['极速替换，非我方制作内容需客户提供源文件']
    },
    revisionLimit: '0次',
    deliveryDays: 'T+1工作日',
    rushRules: '当天加急+50%',
    minOrder: '按需',
    cases: [
      {
        id: 'cv6',
        title: '大促价格字幕与片尾CTA替换',
        subtitle: '保留原视频核心画面，更新促销价格与下载引导',
        tags: ['单元素修改', '尾版替换', '极速交图']
      }
    ]
  },

  // ==========================================
  // 【高定创意】
  // ==========================================
  {
    id: 'sku-gd-pm-ultra',
    title: '创意高定平面（Ultra版）',
    subtitle: '面向国际顶奢或S级发布会命题，行业顶尖创意总监操刀，全球化视觉艺术大师深度共创',
    secondCategory: '高定创意',
    thirdCategory: '创意高定平面',
    fourthCategory: '原创',
    tier: 'Ultra版',
    isRecommended: true,
    maturity: 'L1',
    defaultPrice: 3200,
    priceUnit: '张',
    cbPriceCNY: '¥3,200/张（需要额外付税点）',
    cbPriceUSD: '$460/张（无需税点）',
    marketPrice: '4A广告公司: ¥10,000+/张',
    brandStandard: {
      stars: 5,
      desc: '全球顶尖品牌哲学与 Playbook 深度共鸣'
    },
    requiredAssets: ['品牌宏观规划书', '产品保密工程图', '品牌主张手册'],
    strategyDepth: {
      level: '顶层品牌心智构筑策略',
      desc: '跨越文化偏见的全球统一符号化视觉表达'
    },
    productionPrecision: {
      humanAIPercent: '9:1',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '全量定制',
      designSummary: '超写实3D渲染 + 艺术大师级合成与修图'
    },
    revisionLimit: '≤3次',
    deliveryDays: 'T+10工作日',
    rushRules: '按排期协商',
    minOrder: '3张',
    cases: [
      {
        id: 'c-gd-1',
        title: '旗舰极客概念主视觉KV',
        subtitle: '超越消费电子的先锋艺术空间叙事',
        tags: ['顶级KV', '全球发布会', '4A水准']
      }
    ]
  },
  {
    id: 'sku-gd-sp-tvc',
    title: '实拍TVC（Ultra版）',
    subtitle: '全外籍顶尖摄制团队，大片级灯光置景与电影机拍摄，全流程商业TVC大制作交付',
    secondCategory: '高定创意',
    thirdCategory: '创意高定视频',
    fourthCategory: '实拍',
    tier: 'Ultra版',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 65000,
    priceUnit: '条',
    cbPriceCNY: '¥65,000/条起（按分镜核算）',
    cbPriceUSD: '$9,300/条起',
    marketPrice: '国际影视制作机构: ¥150,000+起',
    brandStandard: {
      stars: 5,
      desc: '电影级影像调色与大师级光影构图'
    },
    requiredAssets: ['品牌年度Brief', '样机样机实体及出海合规手续'],
    strategyDepth: {
      level: '故事线剧情化情感共鸣',
      desc: '以角色情感旅程锚定科技产品带来的生活方式革新'
    },
    productionPrecision: {
      humanAIPercent: '9:1',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '海外当地真实置景拍摄',
      designSummary: '电影级摄影机 + 调色大师DaVinci调色 + 好莱坞级声效混音'
    },
    revisionLimit: '≤2次',
    deliveryDays: 'T+25工作日',
    rushRules: '不可加急',
    minOrder: '1条',
    cases: [
      {
        id: 'c-tvc-1',
        title: '欧美家庭温馨TVC故事片',
        subtitle: '伦敦实地取景，全外籍演员家庭生活温情叙事',
        tags: ['TVC大片', '海外实拍', '顶级调色']
      }
    ]
  },
  {
    id: 'sku-gd-sp-actor-pro',
    title: '素人剧情（Pro版）',
    subtitle: '真实海外本地素人出镜，围绕海外家庭真实痛点展开情景剧演绎，强种草、高互动',
    secondCategory: '高定创意',
    thirdCategory: '创意高定视频',
    fourthCategory: '实拍',
    tier: 'Pro版',
    isRecommended: false,
    maturity: 'L2',
    defaultPrice: 8500,
    priceUnit: '条',
    cbPriceCNY: '¥8,500/条（需要额外付税点）',
    cbPriceUSD: '$1,200/条（无需税点）',
    marketPrice: 'MCN机构: ¥12,000/条',
    brandStandard: {
      stars: 3,
      desc: '符合海外主流短视频原生调性'
    },
    requiredAssets: ['产品样品', '卖点脚本大纲', '目标演员画像需求'],
    strategyDepth: {
      level: '情景反差与痛点共情',
      desc: '通过反转剧情快速唤起受众代入感'
    },
    productionPrecision: {
      humanAIPercent: '8:2',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '海外原生家庭取景',
      designSummary: '专业4K录制 + 原生母语对白 + 动态字幕'
    },
    revisionLimit: '≤2次',
    deliveryDays: 'T+12工作日',
    rushRules: 'T+8 工作日+40%',
    minOrder: '2条',
    cases: [
      {
        id: 'c-sr-1',
        title: '养宠家庭清洁困扰反转情景剧',
        subtitle: '洛杉矶真实宠物博主入户实测拍摄',
        tags: ['素人出镜', '真实种草', '高CTR']
      }
    ]
  },

  // ==========================================
  // 【效果创意】
  // ==========================================
  {
    id: 'sku-xg-pm-std',
    title: '效果平面（标准版）',
    subtitle: '纯效果导向，以CTR/CVR等效果数据为核心驱动，高频测试与快速跑量',
    secondCategory: '效果创意',
    thirdCategory: '效果平面',
    fourthCategory: '原创',
    tier: '标准版',
    isRecommended: true,
    maturity: 'L2',
    defaultPrice: 180,
    priceUnit: '张',
    cbPriceCNY: '¥180/张（需要额外付税点）',
    cbPriceUSD: '$26/张（无需税点）',
    marketPrice: '行业均价: ¥220/张',
    brandStandard: {
      stars: 2,
      desc: '基础调性底线保障，侧重转化元素'
    },
    requiredAssets: ['产品高清图', '折扣促销信息', '核心竞品差异卖点'],
    strategyDepth: {
      level: '买量高转化诱饵策略',
      desc: '大字号利益点突出、价格击穿与信任背书标签'
    },
    productionPrecision: {
      humanAIPercent: '4:6',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'none',
      localizationElements: '≤1个',
      designSummary: '大色块撞色 + 抢眼价格徽章 + 突出按钮引导'
    },
    revisionLimit: '≤1次',
    deliveryDays: 'T+2工作日',
    rushRules: '当天加急+50%',
    minOrder: '30张',
    cases: [
      {
        id: 'c-xg-1',
        title: '黑五狂欢高转化信息流横幅',
        subtitle: '红色强对比底色，立省100刀标签直击眼球',
        tags: ['黑五大促', '高点击率', '价格击穿']
      }
    ]
  },
  {
    id: 'sku-xg-sp-std',
    title: '效果视频（标准版）',
    subtitle: '高冲击力效果视频，首帧夸张画面，密集展示使用爽点，专为快速放量打造',
    secondCategory: '效果创意',
    thirdCategory: '效果视频',
    fourthCategory: '原创',
    tier: '标准版',
    isRecommended: true,
    maturity: 'L2',
    defaultPrice: 950,
    priceUnit: '条',
    cbPriceCNY: '¥950/条（需要额外付税点）',
    cbPriceUSD: '$135/条（无需税点）',
    marketPrice: '买量外包商: ¥1,200/条',
    brandStandard: {
      stars: 2,
      desc: '保障产品外观真实准确'
    },
    requiredAssets: ['产品实机功能片段', '价格促销信息'],
    strategyDepth: {
      level: '强刺激爽感视觉算法',
      desc: '首秒即展示解压清洁对比，大幅拉升信息流停留时间'
    },
    productionPrecision: {
      humanAIPercent: '4:6',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'none',
      localizationElements: '≤1个',
      designSummary: '高频节奏剪切 + 震撼音效 + 倒计时优惠角标'
    },
    revisionLimit: '≤1次',
    deliveryDays: 'T+3工作日',
    rushRules: 'T+2 工作日+30%',
    minOrder: '10条',
    cases: [
      {
        id: 'c-xg-v1',
        title: '沉浸式解压地毯吸尘对比',
        subtitle: '污渍瞬间消失对比，引发自然冲动购买',
        tags: ['解压爽感', '爆款模型', '放量首选']
      }
    ]
  },

  // ==========================================
  // 【增值服务】
  // ==========================================
  {
    id: 'sku-zz-cl-zd',
    title: '创意诊断与素材规划',
    subtitle: '由资深出海创意总监介入，复盘过去90天素材表现，产出下一季度创意放量策略报告',
    secondCategory: '增值服务',
    thirdCategory: '策略诊断',
    fourthCategory: '专项',
    tier: '常规',
    isRecommended: true,
    maturity: 'L1',
    defaultPrice: 8000,
    priceUnit: '份',
    cbPriceCNY: '¥8,000/份（需要额外付税点）',
    cbPriceUSD: '$1,150/份',
    marketPrice: '咨询公司: ¥20,000+/份',
    brandStandard: {
      stars: 4,
      desc: '资深行业研究标准与数据洞察'
    },
    requiredAssets: ['近期投放消耗及CTR/CVR报表', '目标竞品库清单'],
    strategyDepth: {
      level: '全域创意数据归因分析',
      desc: '剖析行业Top 100爆款结构，诊断品牌当前创意疲劳拐点'
    },
    productionPrecision: {
      humanAIPercent: '8:2',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '全球多区域',
      designSummary: '深度PPT交付 + 1对1线上策略答疑会'
    },
    revisionLimit: '≤2次',
    deliveryDays: 'T+7工作日',
    rushRules: '不适用',
    minOrder: '1份',
    cases: [
      {
        id: 'c-zz-1',
        title: '吸尘器欧美三季度策略白皮书',
        subtitle: '拆解20款大热竞品，规划3大全新卖点故事线',
        tags: ['策略报告', '竞品透视', '季度规划']
      }
    ]
  },
  {
    id: 'sku-zz-ai-wf',
    title: 'AI创意工作流搭建',
    subtitle: '定制企业内部AI生图/生视频模型与ComfyUI专属流水线，沉淀品牌风格LorA',
    secondCategory: '增值服务',
    thirdCategory: 'AI / 顾问',
    fourthCategory: '专项',
    tier: '常规',
    isRecommended: false,
    maturity: 'L1',
    defaultPrice: 15000,
    priceUnit: '套',
    cbPriceCNY: '¥15,000/套（需要额外付税点）',
    cbPriceUSD: '$2,150/套',
    marketPrice: 'AI集成商: ¥30,000+/套',
    brandStandard: {
      stars: 4,
      desc: '严格锁死品牌产品结构特征'
    },
    requiredAssets: ['产品3D CAD模型/高清图库（≥50张）', '标准VI色卡'],
    strategyDepth: {
      level: '品牌数字资产模型化',
      desc: '打造一键换背景、一致性人物形象的生产管线'
    },
    productionPrecision: {
      humanAIPercent: '7:3',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'available',
      localizationElements: '内置多国人种LorA',
      designSummary: 'ComfyUI工程包 + LorA权重 + 内部培训实操'
    },
    revisionLimit: '验收通过',
    deliveryDays: 'T+14工作日',
    rushRules: '不适用',
    minOrder: '1套',
    cases: [
      {
        id: 'c-ai-1',
        title: '扫地机多场景AI工作流',
        subtitle: '无需摄影棚即可一键生成全球百种地貌居室图',
        tags: ['AI提效', 'LorA定制', '工作流']
      }
    ]
  },
  {
    id: 'sku-zz-bdfy',
    title: '本地化真人翻译&配音',
    subtitle: '全球母语译员与专业录音棚母语音频师，告别机械生硬机翻，符合当地口语俚语',
    secondCategory: '增值服务',
    thirdCategory: '增配项 / Add-on',
    fourthCategory: '专项',
    tier: '常规',
    isRecommended: false,
    maturity: 'L2',
    defaultPrice: 350,
    priceUnit: '条',
    cbPriceCNY: '¥350/条（含翻译+配音）',
    cbPriceUSD: '$50/条',
    marketPrice: '专业配音公司: ¥500/条',
    brandStandard: {
      stars: 3,
      desc: '母语自然语感，纯正发音'
    },
    requiredAssets: ['原文稿件', '参考语速/情绪说明'],
    strategyDepth: {
      level: '本土文化润色语感',
      desc: '消除直译硬伤，转换为当地受众最容易吸收的口语表达'
    },
    productionPrecision: {
      humanAIPercent: '9:1',
      viCompliant: true,
      creativeDirection: 'available',
      creativeBrief: 'none',
      localizationElements: '目标国原生语系',
      designSummary: '专业降噪 + 48kHz WAV源音轨输出'
    },
    revisionLimit: '≤1次',
    deliveryDays: 'T+2工作日',
    rushRules: '当天加急+50%',
    minOrder: '5条',
    cases: [
      {
        id: 'c-fy-1',
        title: '西德法语母语配音样例',
        subtitle: '符合当地日常消费习惯的口播语调',
        tags: ['母语配音', '地道表达']
      }
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: '【项目】追觅北美-空净线-FB+GG-26代',
    code: 'ZM-US-AP-26',
    manager: '张伟',
    brand: 'Dreame'
  },
  {
    id: 'proj-2',
    name: '【项目】科沃斯全球-扫地机线-FB+GG-05代',
    code: 'KWS-GL-SR-05',
    manager: '王芳',
    brand: 'Ecovacs'
  },
  {
    id: 'proj-3',
    name: '【项目】安克创新-便携充电储能-海外站-12代',
    code: 'ANK-EU-PB-12',
    manager: '李明',
    brand: 'Anker'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-101',
    projectId: 'proj-1',
    projectName: '【项目】追觅北美-空净线-FB+GG-26代',
    orderSource: '内需',
    opProject: '追觅北美-空净线-FB+GG-26代',
    items: [
      {
        skuId: 'sku-px-pm-std',
        skuTitle: '品效平面（标准版）',
        category: '品效创意',
        quantity: 20,
        unitPrice: 240,
        deliveryDate: '2026-06-25',
        currency: 'CNY',
        specs: {
          language: '英语 (美式)',
          dimensions: '1:1, 9:16',
          fileFormat: 'PSD + PNG'
        }
      },
      {
        skuId: 'sku-px-sp-std',
        skuTitle: '品效视频（标准版）',
        category: '品效创意',
        quantity: 10,
        unitPrice: 1200,
        deliveryDate: '2026-06-28',
        currency: 'CNY',
        specs: {
          language: '英语',
          dimensions: '9:16',
          fileFormat: 'MP4 (4K)'
        }
      }
    ],
    notes: '核心突出HEPA滤网的强力过滤效能与低噪音寝室场景。',
    totalAmount: 16800,
    status: 'processing',
    createdAt: '2026-06-15 14:32'
  },
  {
    id: 'order-102',
    projectId: 'proj-2',
    projectName: '【项目】科沃斯全球-扫地机线-FB+GG-05代',
    orderSource: '外需',
    opProject: '科沃斯全球-扫地机线-FB+GG-05代',
    items: [
      {
        skuId: 'sku-px-pm-resize',
        skuTitle: '平面尺寸拓展',
        category: '品效创意',
        quantity: 40,
        unitPrice: 25,
        deliveryDate: '2026-06-20',
        currency: 'CNY',
        specs: {
          dimensions: '9:16, 4:5, 1.91:1'
        }
      }
    ],
    notes: '需要延展 9:16 和 4:5 尺寸，投放于 Instagram Reel 和 TikTok 平台。',
    totalAmount: 1000,
    status: 'pending',
    createdAt: '2026-06-16 09:12'
  }
];
