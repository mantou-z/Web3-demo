export const CATEGORY_ORDER = ['knowledge', 'exercise', 'growth']

export const DIMENSION_MAP = {
  knowledge: 'Wisdom',
  exercise: 'Will',
  growth: 'Creation',
}

export const CATEGORY_CONTENT_CONFIG = {
  knowledge: {
    label: '知识',
    assetFolder: '知识',
    keywords: [
      '学习', '读书', '阅读', '课程', '笔记', '知识', '理解', '研究', '论文', '算法',
      '思考', '分析', '总结', '复盘', '训练营', '作业', '考试', '记忆', '写作', '英语',
      '数学', '物理', '编程', '代码', '开发', '调试', '黑客松',
    ],
    orePrefixes: ['启明', '洞见', '求索', '明理', '识海'],
    oreSuffixes: ['碎晶', '灵屑', '微光', '棱片', '之砂'],
    cardTitles: ['黑客松比赛', '黑客松'],
    cardDescriptions: [
      '这张卡片记录了你在{label}方向上积累出的阶段性成果。',
      '你把零散的理解收束成了可回望的{label}节点。',
      '这是一段属于{label}成长的清晰留痕。',
    ],
    medalTitles: ['Web3 Developer',],
    medalDescriptions: [
      '你将持续求索凝成可被看见的光。这枚徽章来自你在{label}方向上的持续投入。',
      '一次次理解与总结，最终沉淀成了这枚{label}徽章。',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
  },
  exercise: {
    label: '运动',
    assetFolder: '运动',
    keywords: [
      '运动', '跑步', '健身', '训练', '锻炼', '瑜伽', '骑行', '游泳', '羽毛球', '篮球',
      '足球', '力量', '耐力', '体能', '减脂', '增肌', '拉伸', '步数', '早起', '作息',
      '晨跑', '爬山', '散步', '俯卧撑', '深蹲', '跳绳',
    ],
    orePrefixes: ['燃心', '疾行', '铁意', '跃动', '脉冲'],
    oreSuffixes: ['碎晶', '灵核', '微光', '刻片', '之火'],
    cardTitles: ['运动之证', '耐力刻印', '热血篇章', '自律里程碑', '力量札记'],
    cardDescriptions: [
      '这张卡片见证了你在{label}方向上的稳定推进。',
      '重复的练习被熔成了属于你的{label}成果。',
      '你把一次次出汗与坚持，留成了{label}节点。',
    ],
    medalTitles: ['毅行之证', '锻体之印', '热血徽章', '恒毅之冠', '跃动觉章'],
    medalDescriptions: [
      '你把反复坚持熔铸成了清晰可见的力量。这枚徽章来自你在{label}方向上的持续投入。',
      '每一次训练都没有消失，它们汇聚成了这枚{label}徽章。',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
  },
  growth: {
    label: '成长',
    assetFolder: '成长',
    keywords: [
      '成长', '计划', '目标', '习惯', '行动', '突破', '改变', '坚持', '执行', '完成',
      '效率', '管理', '沟通', '表达', '生活', '整理', '家务', '实践', '项目', '合作',
      '社交', '分享', '习惯养成', '反思', '情绪', '自我',
    ],
    orePrefixes: ['新生', '蜕变', '沉淀', '远志', '恒心'],
    oreSuffixes: ['碎晶', '灵屑', '刻片', '微芒', '之尘'],
    cardTitles: ['成长之证', '蜕变刻印', '远志篇章', '自省札记', '进阶里程碑'],
    cardDescriptions: [
      '这张卡片记录了你在{label}方向上的真实推进。',
      '你把具体行动沉淀成了一个清晰的{label}节点。',
      '一段稳定的自我推进，被保存在这张{label}卡片里。',
    ],
    medalTitles: ['成长之证', '蜕变之印', '远志徽章', '自持之冠', '进阶觉章'],
    medalDescriptions: [
      '你把一次次具体行动沉淀成了真正的改变。这枚徽章来自你在{label}方向上的持续投入。',
      '那些没有中断的努力，最终汇成了这枚{label}徽章。',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
  },
}

export const DEMO_SEED_DATA = {
  ores: [
    {
      rawInput: '完成算法课程复盘并整理了二叉树笔记',
      refinedData: {
        id: 1,
        text: '洞见微光：完成算法课程复盘',
        dimension: 'Wisdom',
        score: 5,
        category: '知识',
        categoryId: 'knowledge',
        assetCategory: '知识',
      },
    },
    {
      rawInput: '阅读了一章产品设计书并输出了关键框架',
      refinedData: {
        id: 2,
        text: '启明晶砂：提炼产品设计框架',
        dimension: 'Wisdom',
        score: 4,
        category: '知识',
        categoryId: 'knowledge',
        assetCategory: '知识',
      },
    },
    {
      rawInput: '晨跑3公里并完成拉伸训练',
      refinedData: {
        id: 3,
        text: '跃动灵核：晨跑三公里',
        dimension: 'Will',
        score: 4,
        category: '运动',
        categoryId: 'exercise',
        assetCategory: '运动',
      },
    },
    {
      rawInput: '完成全身力量训练并记录动作表现',
      refinedData: {
        id: 4,
        text: '燃心之火：完成力量训练',
        dimension: 'Will',
        score: 5,
        category: '运动',
        categoryId: 'exercise',
        assetCategory: '运动',
      },
    },
    {
      rawInput: '推进个人项目计划并整理了下周行动清单',
      refinedData: {
        id: 5,
        text: '远志微芒：推进个人项目计划',
        dimension: 'Creation',
        score: 4,
        category: '成长',
        categoryId: 'growth',
        assetCategory: '成长',
      },
    },
  ],
  cards: [
    {
      title: '完成30天Solidity学习',
      categoryId: 'knowledge',
      imageIndex: 0,
      oreIndexes: [0, 1],
    },
    {
      title: '完成Web3 project A',
      categoryId: 'knowledge',
      imageIndex: 1,
      oreIndexes: [0, 1],
    },
    {
      title: '坚持健身30天',
      categoryId: 'exercise',
      imageIndex: 1,
      oreIndexes: [2, 3],
    },
    {
      title: '探索15个城市',
      categoryId: 'growth',
      imageIndex: 4,
      oreIndexes: [4],
    },
  ],
  medal: {
    title: '旅行达人',
    description: '这枚勋章见证了你探索世界的足迹',
    categoryId: 'growth',
    imageIndex: 2,
    tokenId: 1,
  },
}

export function getCategoryContentConfig(categoryId = 'growth') {
  return CATEGORY_CONTENT_CONFIG[categoryId] || CATEGORY_CONTENT_CONFIG.growth
}
