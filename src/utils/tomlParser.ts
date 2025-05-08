import { parse } from 'toml';
import type { Goal, LogEntry, Plan, TomlGoalConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 从TOML字符串解析目标配置
 * @param tomlString TOML格式的字符串
 * @returns 解析后的目标配置
 */
export const parseTomlConfig = (tomlString: string): TomlGoalConfig => {
  try {
    return parse(tomlString) as TomlGoalConfig;
  } catch (error) {
    console.error('解析TOML失败:', error);
    throw new Error('TOML解析失败，请检查格式是否正确');
  }
};

/**
 * 从TOML配置创建新目标
 * @param config TOML配置对象
 * @returns 新创建的目标对象
 */
export const createGoalFromToml = (config: TomlGoalConfig): Goal => {
  const goalId = uuidv4();
  
  // 创建计划列表
  const plans: Plan[] = config.plans.map(plan => ({
    id: uuidv4(),
    title: plan.title,
    description: plan.description,
    startDate: plan.start_date,
    endDate: plan.end_date,
    completed: false,
    goalId
  }));
  
  // 创建日志列表（如果有）
  const logs: LogEntry[] = (config.logs || []).map(log => ({
    id: uuidv4(),
    date: log.date,
    content: log.content,
    goalId,
    relatedPlanIds: log.related_plans 
      ? plans
          .filter(plan => log.related_plans?.includes(plan.title))
          .map(plan => plan.id)
      : []
  }));
  
  // 创建目标对象
  const goal: Goal = {
    id: goalId,
    title: config.goal.title,
    description: config.goal.description,
    startDate: config.goal.start_date,
    endDate: config.goal.end_date,
    progress: calculateProgress(plans),
    status: determineStatus(plans, config.goal.start_date, config.goal.end_date),
    plans,
    logs
  };
  
  return goal;
};

/**
 * 计算目标进度
 * @param plans 计划列表
 * @returns 进度百分比（0-100）
 */
export const calculateProgress = (plans: Plan[]): number => {
  if (plans.length === 0) return 0;
  
  const completedCount = plans.filter(plan => plan.completed).length;
  return Math.round((completedCount / plans.length) * 100);
};

/**
 * 确定目标状态
 * @param plans 计划列表
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 目标状态
 */
export const determineStatus = (
  plans: Plan[], 
  startDate: string, 
  endDate: string
): Goal['status'] => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 如果结束日期已过
  if (now > end) {
    // 是否所有计划都已完成
    return plans.every(plan => plan.completed) ? 'completed' : 'failed';
  }
  
  // 如果还未到开始日期
  if (now < start) {
    return 'not-started';
  }
  
  // 如果在日期范围内
  return 'in-progress';
};

/**
 * 将目标导出为TOML格式字符串
 * @param goal 目标对象
 * @returns TOML格式的字符串
 */
export const exportGoalToToml = (goal: Goal): string => {
  // 目标基本信息
  let tomlString = `[goal]
title = "${escapeToml(goal.title)}"
description = "${escapeToml(goal.description)}"
start_date = "${goal.startDate}"
end_date = "${goal.endDate}"

`;

  // 计划列表
  goal.plans.forEach(plan => {
    tomlString += `[[plans]]
title = "${escapeToml(plan.title)}"
description = "${escapeToml(plan.description)}"
start_date = "${plan.startDate}"
end_date = "${plan.endDate}"

`;
  });

  // 日志记录
  if (goal.logs.length > 0) {
    goal.logs.forEach(log => {
      // 查找与该日志相关的计划标题
      const relatedPlanTitles = log.relatedPlanIds
        .map(planId => goal.plans.find(p => p.id === planId)?.title || '')
        .filter(title => title !== '');
      
      tomlString += `[[logs]]
date = "${log.date}"
content = "${escapeToml(log.content)}"
`;
      
      if (relatedPlanTitles.length > 0) {
        tomlString += `related_plans = [${relatedPlanTitles.map(title => `"${escapeToml(title)}"`).join(', ')}]

`;
      } else {
        tomlString += `
`;
      }
    });
  }

  return tomlString;
};

/**
 * 转义TOML中的特殊字符
 */
const escapeToml = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')  // 反斜杠
    .replace(/"/g, '\\"')    // 双引号
    .replace(/\n/g, '\\n');  // 换行符
};