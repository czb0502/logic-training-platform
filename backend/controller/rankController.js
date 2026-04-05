/**
 * 排行榜控制器
 */
const { readJSON } = require('../utils/fileUtils');

/**
 * 获取排行榜数据
 * @param {string} type - 榜单类型: total/detective/engineering/expression
 * @param {number} limit - 返回数量
 */
function getRankings(type, limit = 20) {
  const users = readJSON('users.json', []);
  
  // 根据类型排序
  let sortedUsers = users.map(u => ({
    userId: u.userId,
    username: u.username,
    avatar: u.avatar,
    level: u.level,
    score: type === 'total' ? u.totalScore : u.scores[type]
  }));
  
  sortedUsers.sort((a, b) => b.score - a.score);
  
  // 只返回前limit名
  return sortedUsers.slice(0, limit).map((u, index) => ({
    rank: index + 1,
    ...u
  }));
}

/**
 * 获取用户排名
 */
function getUserRank(userId, type) {
  const users = readJSON('users.json', []);
  
  // 排序
  let sortedUsers = users.map(u => ({
    userId: u.userId,
    score: type === 'total' ? u.totalScore : u.scores[type]
  }));
  
  sortedUsers.sort((a, b) => b.score - a.score);
  
  // 查找用户排名
  const userIndex = sortedUsers.findIndex(u => u.userId === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  return {
    rank: userIndex + 1,
    score: sortedUsers[userIndex].score
  };
}

/**
 * 总分榜
 */
function getTotalRank(req, res) {
  try {
    const rankings = getRankings('total');
    const myRank = getUserRank(req.userId, 'total');
    
    res.json({
      success: true,
      data: {
        rankings,
        myRank
      }
    });
  } catch (error) {
    console.error('获取总分榜错误:', error);
    res.json({ success: false, message: '获取失败' });
  }
}

/**
 * 侦探榜
 */
function getDetectiveRank(req, res) {
  try {
    const rankings = getRankings('detective');
    const myRank = getUserRank(req.userId, 'detective');
    
    res.json({
      success: true,
      data: {
        rankings,
        myRank
      }
    });
  } catch (error) {
    console.error('获取侦探榜错误:', error);
    res.json({ success: false, message: '获取失败' });
  }
}

/**
 * 工程榜
 */
function getEngineeringRank(req, res) {
  try {
    const rankings = getRankings('engineering');
    const myRank = getUserRank(req.userId, 'engineering');
    
    res.json({
      success: true,
      data: {
        rankings,
        myRank
      }
    });
  } catch (error) {
    console.error('获取工程榜错误:', error);
    res.json({ success: false, message: '获取失败' });
  }
}

/**
 * 表达榜
 */
function getExpressionRank(req, res) {
  try {
    const rankings = getRankings('expression');
    const myRank = getUserRank(req.userId, 'expression');
    
    res.json({
      success: true,
      data: {
        rankings,
        myRank
      }
    });
  } catch (error) {
    console.error('获取表达榜错误:', error);
    res.json({ success: false, message: '获取失败' });
  }
}

module.exports = {
  getTotalRank,
  getDetectiveRank,
  getEngineeringRank,
  getExpressionRank
};
