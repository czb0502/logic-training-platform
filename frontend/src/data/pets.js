// 宠物数据
export const pets = [
  {
    id: 'pet_detective',
    name: '侦探喵',
    rarity: 'common',
    unlockCondition: '完成1个侦探案件',
    borderColor: '#27ae60',
    avatar: '🐱',
    dialogues: ['喵~有案子要查吗？', '线索在哪里喵？', '让我帮你推理喵~', '真相只有一个喵！']
  },
  {
    id: 'pet_engineering',
    name: '工程小机器人',
    rarity: 'common',
    unlockCondition: '完成1个工程关卡',
    borderColor: '#27ae60',
    avatar: '🤖',
    dialogues: ['系统正常，准备就绪', '产线优化建议已生成', '逻辑运算中...', '效率提升15%']
  },
  {
    id: 'pet_expression',
    name: '软萌兔',
    rarity: 'common',
    unlockCondition: '完成1个表达关卡',
    borderColor: '#27ae60',
    avatar: '🐰',
    dialogues: ['要表达清楚哦~', '逻辑要清晰呢', '加油！你可以的！', '表达力MAX！']
  },
  {
    id: 'pet_fox',
    name: '逻辑小狐',
    rarity: 'rare',
    unlockCondition: '总分达到200分',
    borderColor: '#3498db',
    avatar: '🦊',
    dialogues: ['逻辑是万物的本质', '让我来帮你分析', '思考，然后行动', '推理的艺术']
  },
  {
    id: 'pet_cheetah',
    name: '机甲猎豹',
    rarity: 'epic',
    unlockCondition: '总分达到500分',
    borderColor: '#9b59b6',
    avatar: '🐆',
    dialogues: ['速度就是力量', '目标锁定', '执行效率最大化', '闪电般的思维']
  },
  {
    id: 'pet_moon',
    name: '月亮玉兔',
    rarity: 'legend',
    unlockCondition: '输入邀请码"520"解锁',
    unlockCode: '520',
    borderColor: '#ffd700',
    avatar: '🌙',
    dialogues: ['月光指引你的道路', '传说级的智慧在此', '与我一起探索真理', '星辰大海等你征服']
  }
]

// 食物数据
export const foods = {
  carrot: { id: 'carrot', name: '🥕胡萝卜', price: 10, satiety: 15, intimacy: 5 },
  fish: { id: 'fish', name: '🐟小鱼干', price: 20, satiety: 25, intimacy: 10 },
  cake: { id: 'cake', name: '🍰小蛋糕', price: 30, satiety: 35, intimacy: 15 },
  star: { id: 'star', name: '⭐星星糖', price: 50, satiety: 50, intimacy: 30 }
}
