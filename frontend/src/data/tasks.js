// 日常任务数据
export const dailyTasks = [
  {
    id: 'daily_login',
    title: '每日签到',
    description: '登录并签到',
    reward: 20,
    type: 'login'
  },
  {
    id: 'daily_answer_5',
    title: '答题达人',
    description: '今日答对5道题',
    reward: 30,
    target: 5,
    type: 'answer'
  },
  {
    id: 'daily_complete_case',
    title: '案件侦破',
    description: '完成1个侦探案件',
    reward: 50,
    type: 'detective'
  },
  {
    id: 'daily_engineering',
    title: '产线挑战',
    description: '完成1个工程关卡',
    reward: 50,
    type: 'engineering'
  },
  {
    id: 'daily_expression',
    title: '表达训练',
    description: '完成1个表达关卡',
    reward: 30,
    type: 'expression'
  },
  {
    id: 'daily_feed_pet',
    title: '宠物喂食',
    description: '给宠物喂食1次',
    reward: 20,
    type: 'pet'
  }
]
