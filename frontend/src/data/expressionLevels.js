// 12个逻辑表达关卡
export const expressionLevels = [
  // 第一梯度：拖放式结构搭建（1-5关）
  {
    id: 'exp_001',
    title: '基础表达结构',
    type: 'drag',
    difficulty: 1,
    score: 50,
    description: '学习最基本的表达结构：结论先行，论据支撑。',
    content: '请按照正确的逻辑顺序排列以下表达模块：',
    modules: ['因此，我们应该...', '首先，数据显示...', '综上所述...', '其次，案例分析表明...'],
    correctOrder: [2, 1, 3, 0],
    analysis: '正确的表达结构是：先给出结论（综上所述），然后用论据支撑（首先...其次...），最后重申行动建议（因此...）。'
  },
  {
    id: 'exp_002',
    title: '问题分析表达',
    type: 'drag',
    difficulty: 1,
    score: 50,
    description: '掌握问题分析的表达结构：问题-原因-解决方案。',
    content: '请排列以下问题分析表达模块：',
    modules: ['针对以上问题，我们建议...', '主要原因是以下三点...', '目前面临的主要问题是...', '具体而言...'],
    correctOrder: [2, 1, 3, 0],
    analysis: '问题分析的标准结构：先指出问题，再分析原因，然后详细说明，最后给出解决方案。'
  },
  {
    id: 'exp_003',
    title: '数据论证表达',
    type: 'drag',
    difficulty: 2,
    score: 60,
    description: '学习用数据进行论证的表达结构。',
    content: '请排列数据论证的表达模块：',
    modules: ['根据最新统计数据...', '这一数据说明...', '具体来看...', '因此可以得出结论...'],
    correctOrder: [0, 2, 1, 3],
    analysis: '数据论证结构：引用数据→详细解读→分析含义→得出结论。'
  },
  {
    id: 'exp_004',
    title: '对比分析表达',
    type: 'drag',
    difficulty: 2,
    score: 60,
    description: '掌握对比分析的表达结构。',
    content: '请排列对比分析的表达模块：',
    modules: ['相比之下，方案B...', '从成本角度分析...', '方案A的优势在于...', '综合考虑，建议选择...'],
    correctOrder: [2, 0, 1, 3],
    analysis: '对比分析结构：分别说明各方案特点→对比差异→分析维度→给出选择建议。'
  },
  {
    id: 'exp_005',
    title: '总结汇报表达',
    type: 'drag',
    difficulty: 3,
    score: 80,
    description: '学习工作总结的完整表达结构。',
    content: '请排列工作总结的表达模块：',
    modules: ['下一步工作计划...', '主要工作成果包括...', '本季度工作总结如下...', '存在的问题与改进...'],
    correctOrder: [2, 1, 3, 0],
    analysis: '工作总结结构：开场白→主要成果→问题反思→未来计划。'
  },
  // 第二梯度：自由输入分析（6-12关）
  {
    id: 'exp_006',
    title: '观点陈述',
    type: 'input',
    difficulty: 2,
    score: 80,
    description: '针对给定话题，清晰陈述你的观点并给出理由。',
    scenario: '话题：远程办公是否应该成为常态？',
    target: '请用100-200字清晰表达你的观点，包含明确的立场和至少2个论据。',
    keywords: ['效率', '沟通', '成本', '灵活', '协作'],
    rubric: {
      clarity: '观点是否明确',
      evidence: '论据是否充分',
      logic: '逻辑是否连贯'
    }
  },
  {
    id: 'exp_007',
    title: '方案建议',
    type: 'input',
    difficulty: 3,
    score: 100,
    description: '针对问题提出解决方案。',
    scenario: '场景：公司销售额连续三个月下滑，作为销售经理，你需要向CEO汇报并提出改进方案。',
    target: '请用150-250字分析问题原因并提出具体解决方案。',
    keywords: ['市场', '客户', '策略', '团队', '目标'],
    rubric: {
      clarity: '问题分析是否清晰',
      evidence: '方案是否具体可行',
      logic: '逻辑结构是否完整'
    }
  },
  {
    id: 'exp_008',
    title: '数据分析',
    type: 'input',
    difficulty: 3,
    score: 100,
    description: '基于数据进行分析和解读。',
    scenario: '数据：某产品用户留存率第一周80%，第二周60%，第三周45%，第四周35%。',
    target: '请分析数据反映的问题，并提出改进建议（150-200字）。',
    keywords: ['留存', '流失', '体验', '优化', '用户'],
    rubric: {
      clarity: '数据解读是否准确',
      evidence: '建议是否有针对性',
      logic: '分析逻辑是否严密'
    }
  },
  {
    id: 'exp_009',
    title: '冲突调解',
    type: 'input',
    difficulty: 4,
    score: 120,
    description: '处理团队冲突的表达。',
    scenario: '场景：两位核心员工因工作分工问题产生矛盾，影响团队氛围，作为主管你需要进行调解。',
    target: '请设计你的调解话术，体现公平公正并促进和解（150-200字）。',
    keywords: ['理解', '共赢', '分工', '协作', '目标'],
    rubric: {
      clarity: '立场是否公正',
      evidence: '方案是否合理',
      logic: '表达是否有说服力'
    }
  },
  {
    id: 'exp_010',
    title: '危机应对',
    type: 'input',
    difficulty: 4,
    score: 120,
    description: '危机情况下的表达应对。',
    scenario: '场景：公司产品出现质量问题，引发用户投诉和媒体关注，需要你代表公司发布声明。',
    target: '请撰写一份危机公关声明，体现责任担当并提出解决措施（200-300字）。',
    keywords: ['责任', '解决', '改进', '信任', '用户'],
    rubric: {
      clarity: '态度是否诚恳',
      evidence: '措施是否具体',
      logic: '逻辑是否清晰'
    }
  },
  {
    id: 'exp_011',
    title: '战略规划',
    type: 'input',
    difficulty: 5,
    score: 150,
    description: '制定战略规划的表达。',
    scenario: '场景：公司计划进入新市场，需要你向董事会汇报战略规划。',
    target: '请阐述进入新市场的战略规划，包含市场分析、目标设定、实施步骤（250-350字）。',
    keywords: ['市场', '竞争', '目标', '策略', '执行'],
    rubric: {
      clarity: '战略是否清晰',
      evidence: '分析是否深入',
      logic: '规划是否可行'
    }
  },
  {
    id: 'exp_012',
    title: '综合表达挑战',
    type: 'input',
    difficulty: 5,
    score: 150,
    description: '综合运用所有表达技巧。',
    scenario: '场景：你获得了年度优秀员工奖，需要在公司年会上发表获奖感言，同时激励团队。',
    target: '请撰写获奖感言，体现感恩、分享经验、激励团队（200-300字）。',
    keywords: ['感谢', '成长', '团队', '未来', '努力'],
    rubric: {
      clarity: '情感是否真挚',
      evidence: '内容是否有价值',
      logic: '结构是否完整'
    }
  }
]
