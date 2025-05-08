import type { Goal, LogEntry } from '../types';
import { calculateProgress, determineStatus, createGoalFromToml, parseTomlConfig } from '../utils/tomlParser';
import { v4 as uuidv4 } from 'uuid';

// 本地存储的键名
const GOALS_STORAGE_KEY = 'plan_goals';

/**
 * 获取所有目标
 */
export const getAllGoals = (): Goal[] => {
  const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

/**
 * 通过ID获取单个目标
 */
export const getGoalById = (id: string): Goal | undefined => {
  const goals = getAllGoals();
  return goals.find(goal => goal.id === id);
};

/**
 * 保存所有目标
 */
export const saveGoals = (goals: Goal[]): void => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

/**
 * 添加新目标
 */
export const addGoal = (goal: Goal): void => {
  const goals = getAllGoals();
  saveGoals([...goals, goal]);
};

/**
 * 更新目标
 */
export const updateGoal = (updatedGoal: Goal): void => {
  const goals = getAllGoals();
  const index = goals.findIndex(goal => goal.id === updatedGoal.id);
  
  if (index !== -1) {
    goals[index] = updatedGoal;
    saveGoals(goals);
  }
};

/**
 * 删除目标
 */
export const deleteGoal = (id: string): void => {
  const goals = getAllGoals();
  saveGoals(goals.filter(goal => goal.id !== id));
};

/**
 * 更新计划的完成状态
 */
export const updatePlanStatus = (goalId: string, planId: string, completed: boolean): void => {
  const goals = getAllGoals();
  const goalIndex = goals.findIndex(goal => goal.id === goalId);
  
  if (goalIndex !== -1) {
    const goal = goals[goalIndex];
    const planIndex = goal.plans.findIndex(plan => plan.id === planId);
    
    if (planIndex !== -1) {
      // 更新计划的完成状态
      goal.plans[planIndex].completed = completed;
      
      // 重新计算目标的进度
      goal.progress = calculateProgress(goal.plans);
      
      // 重新确定目标的状态
      goal.status = determineStatus(goal.plans, goal.startDate, goal.endDate);
      
      saveGoals(goals);
    }
  }
};

/**
 * 添加日志记录
 */
export const addLogEntry = (goalId: string, log: Omit<LogEntry, 'id' | 'goalId'>): void => {
  const goals = getAllGoals();
  const goalIndex = goals.findIndex(goal => goal.id === goalId);
  
  if (goalIndex !== -1) {
    const newLog: LogEntry = {
      ...log,
      id: uuidv4(),
      goalId
    };
    
    goals[goalIndex].logs.push(newLog);
    saveGoals(goals);
  }
};

/**
 * 从TOML字符串导入目标
 */
export const importGoalFromToml = (tomlString: string): Goal => {
  const config = parseTomlConfig(tomlString);
  const goal = createGoalFromToml(config);
  addGoal(goal);
  return goal;
};