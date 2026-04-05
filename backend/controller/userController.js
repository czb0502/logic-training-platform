/**
 * 用户控制器
 */
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileUtils');
const { hashPassword, comparePassword, generateToken } = require('../utils/encrypt');
const { validateAccount, validatePassword, validateUsername } = require('../utils/validator');

// 等级定义
const LEVELS = ['新人入门', '初级探员', '推理高手', '逻辑新星', '逻辑专家', '逻辑大师'];

/**
 * 计算用户等级
 * @param {number} totalScore - 总积分
 * @returns {string} 等级名称
 */
function calculateLevel(totalScore) {
  if (totalScore >= 2000) return LEVELS[5];
  if (totalScore >= 1500) return LEVELS[4];
  if (totalScore >= 1000) return LEVELS[3];
  if (totalScore >= 500) return LEVELS[2];
  if (totalScore >= 200) return LEVELS[1];
  return LEVELS[0];
}

/**
 * 获取今日日期字符串
 */
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 初始化新用户数据
 */
function initUserData(account, hashedPassword) {
  const today = getTodayString();
  return {
    userId: uuidv4(),
    account,
    password: hashedPassword,
    username: `用户${account}`,
    avatar: '',
    level: LEVELS[0],
    totalScore: 0,
    scores: {
      detective: 0,
      engineering: 0,
      expression: 0
    },
    coins: 100, // 初始金币
    completedContent: {
      detectiveCases: [],
      engineeringLevels: [],
      expressionLevels: []
    },
    achievements: [],
    unlockedPets: [],
    activePet: null,
    petData: {},
    dailyTasks: {
      lastLoginDate: today,
      loginStreak: 1,
      todayAnswered: 0,
      todayCorrect: 0,
      todayCoins: 0,
      completedTasks: []
    },
    createTime: Date.now(),
    updateTime: Date.now()
  };
}

/**
 * 用户注册
 */
async function register(req, res) {
  try {
    const { account, password } = req.body;
    
    // 参数校验
    const accountCheck = validateAccount(account);
    if (!accountCheck.valid) {
      return res.json({ success: false, message: accountCheck.message });
    }
    
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.json({ success: false, message: passwordCheck.message });
    }
    
    // 检查账号是否已存在
    const users = readJSON('users.json', []);
    if (users.find(u => u.account === account)) {
      return res.json({ success: false, message: '该账号已被注册' });
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 创建新用户
    const newUser = initUserData(account, hashedPassword);
    users.push(newUser);
    
    // 保存数据
    if (!writeJSON('users.json', users)) {
      return res.json({ success: false, message: '注册失败，请重试' });
    }
    
    // 生成token
    const token = generateToken(newUser.userId);
    
    res.json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          userId: newUser.userId,
          account: newUser.account,
          username: newUser.username,
          level: newUser.level,
          totalScore: newUser.totalScore,
          coins: newUser.coins,
          scores: newUser.scores
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.json({ success: false, message: '注册失败' });
  }
}

/**
 * 用户登录
 */
async function login(req, res) {
  try {
    const { account, password } = req.body;
    
    if (!account || !password) {
      return res.json({ success: false, message: '账号和密码不能为空' });
    }
    
    // 查找用户
    const users = readJSON('users.json', []);
    const user = users.find(u => u.account === account);
    
    if (!user) {
      return res.json({ success: false, message: '账号或密码错误' });
    }
    
    // 验证密码
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.json({ success: false, message: '账号或密码错误' });
    }
    
    // 更新登录信息
    const today = getTodayString();
    const lastLogin = user.dailyTasks.lastLoginDate;
    
    // 计算连续登录天数
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastLogin === yesterdayStr) {
      user.dailyTasks.loginStreak += 1;
    } else if (lastLogin !== today) {
      user.dailyTasks.loginStreak = 1;
    }
    
    user.dailyTasks.lastLoginDate = today;
    user.dailyTasks.todayAnswered = 0;
    user.dailyTasks.todayCorrect = 0;
    user.dailyTasks.todayCoins = 0;
    user.dailyTasks.completedTasks = [];
    user.updateTime = Date.now();
    
    // 签到奖励
    if (!user.dailyTasks.completedTasks.includes('daily_login')) {
      const checkinCoins = 20 + (user.dailyTasks.loginStreak > 1 ? 10 : 0);
      user.coins += checkinCoins;
      user.dailyTasks.todayCoins += checkinCoins;
      user.dailyTasks.completedTasks.push('daily_login');
    }
    
    writeJSON('users.json', users);
    
    // 生成token
    const token = generateToken(user.userId);
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          userId: user.userId,
          account: user.account,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          totalScore: user.totalScore,
          coins: user.coins,
          scores: user.scores,
          dailyTasks: user.dailyTasks
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.json({ success: false, message: '登录失败' });
  }
}

/**
 * 获取用户信息
 */
function getProfile(req, res) {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        userId: user.userId,
        account: user.account,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        totalScore: user.totalScore,
        coins: user.coins,
        scores: user.scores,
        completedContent: user.completedContent,
        achievements: user.achievements,
        unlockedPets: user.unlockedPets,
        activePet: user.activePet,
        petData: user.petData,
        dailyTasks: user.dailyTasks
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.json({ success: false, message: '获取用户信息失败' });
  }
}

/**
 * 更新用户信息
 */
function updateProfile(req, res) {
  try {
    const { username, avatar } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    // 校验昵称
    if (username) {
      const check = validateUsername(username);
      if (!check.valid) {
        return res.json({ success: false, message: check.message });
      }
      users[userIndex].username = username;
    }
    
    if (avatar !== undefined) {
      users[userIndex].avatar = avatar;
    }
    
    users[userIndex].updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: '更新成功',
      data: {
        username: users[userIndex].username,
        avatar: users[userIndex].avatar
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.json({ success: false, message: '更新失败' });
  }
}

/**
 * 修改密码
 */
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.json({ success: false, message: '旧密码和新密码不能为空' });
    }
    
    const check = validatePassword(newPassword);
    if (!check.valid) {
      return res.json({ success: false, message: check.message });
    }
    
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    // 验证旧密码
    const isValid = await comparePassword(oldPassword, users[userIndex].password);
    if (!isValid) {
      return res.json({ success: false, message: '旧密码错误' });
    }
    
    // 更新密码
    users[userIndex].password = await hashPassword(newPassword);
    users[userIndex].updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.json({ success: false, message: '修改密码失败' });
  }
}

/**
 * 退出登录（客户端清除token即可，这里记录日志）
 */
function logout(req, res) {
  res.json({ success: true, message: '退出登录成功' });
}

/**
 * 注销账号
 */
async function deleteAccount(req, res) {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.json({ success: false, message: '请输入密码确认' });
    }
    
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    // 验证密码
    const isValid = await comparePassword(password, users[userIndex].password);
    if (!isValid) {
      return res.json({ success: false, message: '密码错误' });
    }
    
    // 删除用户
    users.splice(userIndex, 1);
    writeJSON('users.json', users);
    
    res.json({ success: true, message: '账号已注销' });
  } catch (error) {
    console.error('注销账号错误:', error);
    res.json({ success: false, message: '注销失败' });
  }
}

/**
 * 每日签到
 */
function checkin(req, res) {
  try {
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const today = getTodayString();
    const user = users[userIndex];
    
    // 检查今天是否已签到
    if (user.dailyTasks.completedTasks.includes('daily_login')) {
      return res.json({ success: false, message: '今天已经签到过了' });
    }
    
    // 计算连续登录奖励
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (user.dailyTasks.lastLoginDate === yesterdayStr) {
      user.dailyTasks.loginStreak += 1;
    } else {
      user.dailyTasks.loginStreak = 1;
    }
    
    // 签到奖励
    const baseReward = 20;
    const streakReward = Math.min(user.dailyTasks.loginStreak * 5, 50);
    const totalReward = baseReward + streakReward;
    
    user.coins += totalReward;
    user.dailyTasks.todayCoins += totalReward;
    user.dailyTasks.completedTasks.push('daily_login');
    user.dailyTasks.lastLoginDate = today;
    user.updateTime = Date.now();
    
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: `签到成功！获得${totalReward}金币（连续${user.dailyTasks.loginStreak}天）`,
      data: {
        reward: totalReward,
        streak: user.dailyTasks.loginStreak,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('签到错误:', error);
    res.json({ success: false, message: '签到失败' });
  }
}

/**
 * 获取今日任务
 */
function getTasks(req, res) {
  try {
    const user = req.user;
    const today = getTodayString();
    
    // 重置今日任务状态（如果不是今天）
    if (user.dailyTasks.lastLoginDate !== today) {
      user.dailyTasks.todayAnswered = 0;
      user.dailyTasks.todayCorrect = 0;
      user.dailyTasks.todayCoins = 0;
      user.dailyTasks.completedTasks = [];
    }
    
    // 任务定义
    const tasks = [
      {
        id: 'daily_login',
        title: '每日签到',
        description: '登录并签到',
        reward: 20,
        completed: user.dailyTasks.completedTasks.includes('daily_login')
      },
      {
        id: 'daily_answer_5',
        title: '答题达人',
        description: '今日答对5道题',
        reward: 30,
        progress: user.dailyTasks.todayCorrect,
        target: 5,
        completed: user.dailyTasks.completedTasks.includes('daily_answer_5')
      },
      {
        id: 'daily_complete_case',
        title: '案件侦破',
        description: '完成1个侦探案件',
        reward: 50,
        completed: user.dailyTasks.completedTasks.includes('daily_complete_case')
      },
      {
        id: 'daily_engineering',
        title: '产线挑战',
        description: '完成1个工程关卡',
        reward: 50,
        completed: user.dailyTasks.completedTasks.includes('daily_engineering')
      }
    ];
    
    res.json({
      success: true,
      data: {
        tasks,
        streak: user.dailyTasks.loginStreak,
        todayCoins: user.dailyTasks.todayCoins
      }
    });
  } catch (error) {
    console.error('获取任务错误:', error);
    res.json({ success: false, message: '获取任务失败' });
  }
}

/**
 * 完成任务
 */
function completeTask(req, res) {
  try {
    const { taskId } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    
    // 检查是否已完成
    if (user.dailyTasks.completedTasks.includes(taskId)) {
      return res.json({ success: false, message: '该任务已完成' });
    }
    
    // 任务奖励
    const taskRewards = {
      'daily_login': 20,
      'daily_answer_5': 30,
      'daily_complete_case': 50,
      'daily_engineering': 50
    };
    
    const reward = taskRewards[taskId] || 10;
    user.coins += reward;
    user.dailyTasks.todayCoins += reward;
    user.dailyTasks.completedTasks.push(taskId);
    user.updateTime = Date.now();
    
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: `任务完成！获得${reward}金币`,
      data: { reward, coins: user.coins }
    });
  } catch (error) {
    console.error('完成任务错误:', error);
    res.json({ success: false, message: '完成任务失败' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  deleteAccount,
  checkin,
  getTasks,
  completeTask,
  calculateLevel
};
