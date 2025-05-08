/**
 * 目标类型定义
 */
export interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  plans: Plan[];
  logs: LogEntry[];
}

/**
 * 计划类型定义
 */
export interface Plan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  goalId: string;
}

/**
 * 日志记录类型定义
 */
export interface LogEntry {
  id: string;
  date: string;
  content: string;
  goalId: string;
  relatedPlanIds: string[];
}

/**
 * TOML配置类型定义
 */
export interface TomlGoalConfig {
  goal: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
  };
  plans: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
  }[];
  logs?: {
    date: string;
    content: string;
    related_plans?: string[];
  }[];
}