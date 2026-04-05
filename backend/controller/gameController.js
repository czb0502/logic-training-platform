/**
 * 游戏控制器
 */
const { readJSON, writeJSON } = require('../utils/fileUtils');
const { calculateLevel } = require('./userController');

// 成就定义
const ACHIEVEMENTS = {
  // 侦探成就
  'detective_1': { id: 'detective_1', title: '初出茅庐', desc: '完成第1个侦探案件', reward: 50 },
  'detective_5': { id: 'detective_5', title: '神探', desc: '完成5个侦探案件', reward: 100 },
  'detective_perfect': { id: 'detective_perfect', title: '完美推理', desc: '连续答对3个案件', reward: 150 },
  
  // 工程成就
  'engineering_1': { id: 'engineering_1', title: '初学乍练', desc: '完成第1个工程关卡', reward: 50 },
  'engineering_5': { id: 'engineering_5', title: '工程大师', desc: '完成5个工程关卡', reward: 100 },
  'engineering_optimal': { id: 'engineering_optimal', title: '顺序之王', desc: '用最优方案完成1个关卡', reward: 150 },
  
  // 表达成就
  'expression_1': { id: 'expression_1', title: '开口说话', desc: '完成第1个表达关卡', reward: 50 },
  'expression_5': { id: 'expression_5', title: '逻辑达人', desc: '完成5个表达关卡', reward: 100 },
  
  // 综合成就
  'score_100': { id: 'score_100', title: '百分选手', desc: '总分达到100分', reward: 30 },
  'score_500': { id: 'score_500', title: '逻辑新星', desc: '总分达到500分', reward: 50 },
  'score_1000': { id: 'score_1000', title: '逻辑专家', desc: '总分达到1000分', reward: 100 },
  'grand_slam': { id: 'grand_slam', title: '大满贯', desc: '完成所有案件和关卡', reward: 500 }
};

/**
 * 检查并解锁成就
 */
function checkAchievements(user) {
  const newAchievements = [];
  
  // 侦探成就
  const detectiveCount = user.completedContent.detectiveCases.length;
  if (detectiveCount >= 1 && !user.achievements.includes('detective_1')) {
    newAchievements.push('detective_1');
  }
  if (detectiveCount >= 5 && !user.achievements.includes('detective_5')) {
    newAchievements.push('detective_5');
  }
  
  // 工程成就
  const engineeringCount = user.completedContent.engineeringLevels.length;
  if (engineeringCount >= 1 && !user.achievements.includes('engineering_1')) {
    newAchievements.push('engineering_1');
  }
  if (engineeringCount >= 5 && !user.achievements.includes('engineering_5')) {
    newAchievements.push('engineering_5');
  }
  
  // 表达成就
  const expressionCount = user.completedContent.expressionLevels.length;
  if (expressionCount >= 1 && !user.achievements.includes('expression_1')) {
    newAchievements.push('expression_1');
  }
  if (expressionCount >= 5 && !user.achievements.includes('expression_5')) {
    newAchievements.push('expression_5');
  }
  
  // 综合成就
  if (user.totalScore >= 100 && !user.achievements.includes('score_100')) {
    newAchievements.push('score_100');
  }
  if (user.totalScore >= 500 && !user.achievements.includes('score_500')) {
    newAchievements.push('score_500');
  }
  if (user.totalScore >= 1000 && !user.achievements.includes('score_1000')) {
    newAchievements.push('score_1000');
  }
  
  // 大满贯
  if (detectiveCount >= 6 && engineeringCount >= 6 && expressionCount >= 12) {
    if (!user.achievements.includes('grand_slam')) {
      newAchievements.push('grand_slam');
    }
  }
  
  // 添加新成就并发放奖励
  let totalReward = 0;
  newAchievements.forEach(achId => {
    user.achievements.push(achId);
    const ach = ACHIEVEMENTS[achId];
    if (ach) {
      totalReward += ach.reward;
    }
  });
  
  user.coins += totalReward;
  
  return { newAchievements, totalReward };
}

/**
 * 完成侦探案件
 */
function completeDetectiveCase(req, res) {
  try {
    const { caseId, score, correct } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    
    // 如果已经通关，不重复计分
    if (!user.completedContent.detectiveCases.includes(caseId)) {
      if (correct) {
        user.completedContent.detectiveCases.push(caseId);
        user.scores.detective += score;
        user.totalScore += score;
        user.dailyTasks.todayCorrect += 1;
        
        // 更新等级
        user.level = calculateLevel(user.totalScore);
      }
    }
    
    user.dailyTasks.todayAnswered += 1;
    user.updateTime = Date.now();
    
    // 检查成就
    const achievementResult = checkAchievements(user);
    
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: correct ? '案件侦破成功！' : '答案错误，请重新推理',
      data: {
        correct,
        score: correct ? score : 0,
        totalScore: user.totalScore,
        level: user.level,
        newAchievements: achievementResult.newAchievements,
        achievementReward: achievementResult.totalReward
      }
    });
  } catch (error) {
    console.error('完成侦探案件错误:', error);
    res.json({ success: false, message: '提交失败' });
  }
}

/**
 * 完成工程关卡
 */
function completeEngineeringLevel(req, res) {
  try {
    const { levelId, score, isOptimal } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    const alreadyCompleted = user.completedContent.engineeringLevels.includes(levelId);
    
    // 金币和经验奖励
    const coinsReward = 20;
    const expReward = 30;
    
    if (!alreadyCompleted) {
      user.completedContent.engineeringLevels.push(levelId);
      user.scores.engineering += score;
      user.totalScore += score;
      user.coins += coinsReward;
      
      // 更新等级
      user.level = calculateLevel(user.totalScore);
    }
    
    user.updateTime = Date.now();
    
    // 检查成就
    const achievementResult = checkAchievements(user);
    
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: '关卡完成！',
      data: {
        score,
        coinsReward: alreadyCompleted ? 0 : coinsReward,
        expReward,
        totalScore: user.totalScore,
        level: user.level,
        isFirstTime: !alreadyCompleted,
        newAchievements: achievementResult.newAchievements,
        achievementReward: achievementResult.totalReward
      }
    });
  } catch (error) {
    console.error('完成工程关卡错误:', error);
    res.json({ success: false, message: '提交失败' });
  }
}

/**
 * 完成表达关卡
 */
function completeExpressionLevel(req, res) {
  try {
    const { levelId, score, analysis } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    const alreadyCompleted = user.completedContent.expressionLevels.includes(levelId);
    
    const coinsReward = 15;
    
    if (!alreadyCompleted) {
      user.completedContent.expressionLevels.push(levelId);
      user.scores.expression += score;
      user.totalScore += score;
      user.coins += coinsReward;
      
      // 更新等级
      user.level = calculateLevel(user.totalScore);
    }
    
    user.dailyTasks.todayAnswered += 1;
    if (score >= 80) {
      user.dailyTasks.todayCorrect += 1;
    }
    
    user.updateTime = Date.now();
    
    // 检查成就
    const achievementResult = checkAchievements(user);
    
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: '关卡完成！',
      data: {
        score,
        analysis,
        coinsReward: alreadyCompleted ? 0 : coinsReward,
        totalScore: user.totalScore,
        level: user.level,
        isFirstTime: !alreadyCompleted,
        newAchievements: achievementResult.newAchievements,
        achievementReward: achievementResult.totalReward
      }
    });
  } catch (error) {
    console.error('完成表达关卡错误:', error);
    res.json({ success: false, message: '提交失败' });
  }
}

/**
 * 获取游戏进度
 */
function getGameProgress(req, res) {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        completedCases: user.completedContent.detectiveCases,
        completedEngineering: user.completedContent.engineeringLevels,
        completedExpression: user.completedContent.expressionLevels,
        scores: user.scores,
        totalScore: user.totalScore,
        achievements: user.achievements
      }
    });
  } catch (error) {
    console.error('获取游戏进度错误:', error);
    res.json({ success: false, message: '获取进度失败' });
  }
}

module.exports = {
  completeDetectiveCase,
  completeEngineeringLevel,
  completeExpressionLevel,
  getGameProgress,
  ACHIEVEMENTS
};
