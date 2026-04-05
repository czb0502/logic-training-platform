/**
 * 宠物控制器
 */
const { readJSON, writeJSON } = require('../utils/fileUtils');

// 宠物基础数据
const PETS_DATA = {
  'pet_detective': {
    id: 'pet_detective',
    name: '侦探喵',
    rarity: 'common',
    unlockCondition: '完成1个侦探案件',
    borderColor: '#27ae60',
    avatar: '🐱',
    dialogues: ['喵~有案子要查吗？', '线索在哪里喵？', '让我帮你推理喵~']
  },
  'pet_engineering': {
    id: 'pet_engineering',
    name: '工程小机器人',
    rarity: 'common',
    unlockCondition: '完成1个工程关卡',
    borderColor: '#27ae60',
    avatar: '🤖',
    dialogues: ['系统正常，准备就绪', '产线优化建议已生成', '逻辑运算中...']
  },
  'pet_expression': {
    id: 'pet_expression',
    name: '软萌兔',
    rarity: 'common',
    unlockCondition: '完成1个表达关卡',
    borderColor: '#27ae60',
    avatar: '🐰',
    dialogues: ['要表达清楚哦~', '逻辑要清晰呢', '加油！你可以的！']
  },
  'pet_fox': {
    id: 'pet_fox',
    name: '逻辑小狐',
    rarity: 'rare',
    unlockCondition: '总分达到200分',
    borderColor: '#3498db',
    avatar: '🦊',
    dialogues: ['逻辑是万物的本质', '让我来帮你分析', '思考，然后行动']
  },
  'pet_cheetah': {
    id: 'pet_cheetah',
    name: '机甲猎豹',
    rarity: 'epic',
    unlockCondition: '总分达到500分',
    borderColor: '#9b59b6',
    avatar: '🐆',
    dialogues: ['速度就是力量', '目标锁定', '执行效率最大化']
  },
  'pet_moon': {
    id: 'pet_moon',
    name: '月亮玉兔',
    rarity: 'legend',
    unlockCondition: '需要邀请码解锁',
    unlockCode: '520',
    borderColor: '#ffd700',
    avatar: '🌙',
    dialogues: ['月光指引你的道路', '传说级的智慧在此', '与我一起探索真理']
  }
};

// 食物数据
const FOODS = {
  'carrot': { id: 'carrot', name: '🥕胡萝卜', price: 10, satiety: 15, intimacy: 5 },
  'fish': { id: 'fish', name: '🐟小鱼干', price: 20, satiety: 25, intimacy: 10 },
  'cake': { id: 'cake', name: '🍰小蛋糕', price: 30, satiety: 35, intimacy: 15 },
  'star': { id: 'star', name: '⭐星星糖', price: 50, satiety: 50, intimacy: 30 }
};

/**
 * 初始化宠物数据
 */
function initPetData(petId) {
  return {
    petId,
    level: 1,
    exp: 0,
    intimacy: 0,
    satiety: 100,
    accompanyTime: 0,
    lastFeedTime: Date.now()
  };
}

/**
 * 计算升级所需金币
 */
function getUpgradeCost(level) {
  return Math.floor(50 * Math.pow(level, 1.5));
}

/**
 * 获取用户宠物列表
 */
function getPetList(req, res) {
  try {
    const user = req.user;
    const pets = [];
    
    // 遍历所有宠物，检查解锁状态
    Object.values(PETS_DATA).forEach(petBase => {
      const isUnlocked = user.unlockedPets.includes(petBase.id);
      const petData = user.petData[petBase.id];
      
      pets.push({
        ...petBase,
        isUnlocked,
        isActive: user.activePet === petBase.id,
        data: petData || null
      });
    });
    
    res.json({
      success: true,
      data: {
        pets,
        foods: FOODS,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('获取宠物列表错误:', error);
    res.json({ success: false, message: '获取失败' });
  }
}

/**
 * 解锁宠物
 */
function unlockPet(req, res) {
  try {
    const { petId, unlockCode } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    const petBase = PETS_DATA[petId];
    
    if (!petBase) {
      return res.json({ success: false, message: '宠物不存在' });
    }
    
    // 检查是否已解锁
    if (user.unlockedPets.includes(petId)) {
      return res.json({ success: false, message: '该宠物已解锁' });
    }
    
    // 检查解锁条件
    let canUnlock = false;
    
    switch (petId) {
      case 'pet_detective':
        canUnlock = user.completedContent.detectiveCases.length >= 1;
        break;
      case 'pet_engineering':
        canUnlock = user.completedContent.engineeringLevels.length >= 1;
        break;
      case 'pet_expression':
        canUnlock = user.completedContent.expressionLevels.length >= 1;
        break;
      case 'pet_fox':
        canUnlock = user.totalScore >= 200;
        break;
      case 'pet_cheetah':
        canUnlock = user.totalScore >= 500;
        break;
      case 'pet_moon':
        canUnlock = unlockCode === petBase.unlockCode;
        break;
    }
    
    if (!canUnlock) {
      return res.json({ success: false, message: '未达到解锁条件' });
    }
    
    // 解锁宠物
    user.unlockedPets.push(petId);
    user.petData[petId] = initPetData(petId);
    
    // 如果没有活跃宠物，设为活跃
    if (!user.activePet) {
      user.activePet = petId;
    }
    
    user.updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: `解锁成功！获得${petBase.name}`,
      data: {
        petId,
        petData: user.petData[petId]
      }
    });
  } catch (error) {
    console.error('解锁宠物错误:', error);
    res.json({ success: false, message: '解锁失败' });
  }
}

/**
 * 喂食宠物
 */
function feedPet(req, res) {
  try {
    const { petId, foodId } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    const food = FOODS[foodId];
    
    if (!food) {
      return res.json({ success: false, message: '食物不存在' });
    }
    
    if (!user.unlockedPets.includes(petId)) {
      return res.json({ success: false, message: '宠物未解锁' });
    }
    
    // 检查金币
    if (user.coins < food.price) {
      return res.json({ success: false, message: '金币不足' });
    }
    
    const petData = user.petData[petId];
    
    // 扣除金币
    user.coins -= food.price;
    
    // 增加饱食度和亲密度
    petData.satiety = Math.min(100, petData.satiety + food.satiety);
    petData.intimacy = Math.min(100, petData.intimacy + food.intimacy);
    petData.lastFeedTime = Date.now();
    
    user.updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: `喂食成功！饱食度+${food.satiety}，亲密度+${food.intimacy}`,
      data: {
        petData,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('喂食宠物错误:', error);
    res.json({ success: false, message: '喂食失败' });
  }
}

/**
 * 升级宠物
 */
function upgradePet(req, res) {
  try {
    const { petId } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    
    if (!user.unlockedPets.includes(petId)) {
      return res.json({ success: false, message: '宠物未解锁' });
    }
    
    const petData = user.petData[petId];
    const cost = getUpgradeCost(petData.level);
    
    // 检查金币
    if (user.coins < cost) {
      return res.json({ success: false, message: `升级需要${cost}金币` });
    }
    
    // 扣除金币并升级
    user.coins -= cost;
    petData.level += 1;
    petData.exp = 0;
    
    user.updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: `升级成功！${PETS_DATA[petId].name}达到Lv.${petData.level}`,
      data: {
        petData,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('升级宠物错误:', error);
    res.json({ success: false, message: '升级失败' });
  }
}

/**
 * 设置当前宠物
 */
function setActivePet(req, res) {
  try {
    const { petId } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    
    if (petId && !user.unlockedPets.includes(petId)) {
      return res.json({ success: false, message: '宠物未解锁' });
    }
    
    user.activePet = petId || null;
    user.updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      message: petId ? '宠物已切换' : '已取消宠物跟随',
      data: { activePet: petId }
    });
  } catch (error) {
    console.error('设置宠物错误:', error);
    res.json({ success: false, message: '设置失败' });
  }
}

/**
 * 宠物互动
 */
function interactPet(req, res) {
  try {
    const { petId, type } = req.body;
    const users = readJSON('users.json', []);
    const userIndex = users.findIndex(u => u.userId === req.userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const user = users[userIndex];
    
    if (!user.unlockedPets.includes(petId)) {
      return res.json({ success: false, message: '宠物未解锁' });
    }
    
    const petData = user.petData[petId];
    const petBase = PETS_DATA[petId];
    
    let result = {};
    
    switch (type) {
      case 'perform':
        // 才艺表演 - 5分钟CD
        const lastPerform = petData.lastPerformTime || 0;
        const fiveMinutes = 5 * 60 * 1000;
        
        if (Date.now() - lastPerform < fiveMinutes) {
          const remaining = Math.ceil((fiveMinutes - (Date.now() - lastPerform)) / 1000);
          return res.json({
            success: false,
            message: `才艺表演冷却中，还需${remaining}秒`,
            data: { cooldown: remaining }
          });
        }
        
        petData.lastPerformTime = Date.now();
        petData.intimacy = Math.min(100, petData.intimacy + 5);
        petData.accompanyTime += 300; // 增加陪伴时长
        
        result = {
          message: `${petBase.name}为你表演了才艺！`,
          dialogue: petBase.dialogues[Math.floor(Math.random() * petBase.dialogues.length)],
          intimacyGain: 5
        };
        break;
        
      case 'talk':
        // 对话
        result = {
          message: '对话成功',
          dialogue: petBase.dialogues[Math.floor(Math.random() * petBase.dialogues.length)]
        };
        break;
        
      default:
        return res.json({ success: false, message: '未知的互动类型' });
    }
    
    user.updateTime = Date.now();
    writeJSON('users.json', users);
    
    res.json({
      success: true,
      ...result,
      data: { petData }
    });
  } catch (error) {
    console.error('宠物互动错误:', error);
    res.json({ success: false, message: '互动失败' });
  }
}

module.exports = {
  getPetList,
  unlockPet,
  feedPet,
  upgradePet,
  setActivePet,
  interactPet,
  PETS_DATA,
  FOODS
};
