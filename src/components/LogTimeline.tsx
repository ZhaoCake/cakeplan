import React from 'react';
import { Timeline, Typography, Grid } from 'antd';
import type { LogEntry, Plan } from '../types';
import dayjs from 'dayjs';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface LogTimelineProps {
  logs: LogEntry[];
  plans: Plan[];
}

const LogTimeline: React.FC<LogTimelineProps> = ({ logs, plans }) => {
  const screens = useBreakpoint();
  
  // 按日期降序排列日志
  const sortedLogs = [...logs].sort((a, b) => 
    dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  // 获取计划标题
  const getPlanTitle = (planId: string): string => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.title : '未知计划';
  };

  return (
    <div style={{ padding: screens.xs ? 0 : 16 }}>
      {sortedLogs.length > 0 ? (
        <Timeline 
          mode={screens.md ? "left" : "right"}
          items={sortedLogs.map(log => ({
            color: log.relatedPlanIds.length > 0 ? 'blue' : 'gray',
            label: screens.sm ? dayjs(log.date).format('YYYY-MM-DD') : null,
            position: screens.sm ? 'left' : 'right',
            children: (
              <div>
                {!screens.sm && (
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                    {dayjs(log.date).format('YYYY-MM-DD')}
                  </Text>
                )}
                <Text style={{ fontSize: screens.md ? 14 : 13 }}>{log.content}</Text>
                {log.relatedPlanIds.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: screens.md ? 13 : 12 }}>相关计划:</Text>
                    <ul style={{ 
                      margin: '4px 0 0 0', 
                      paddingLeft: screens.md ? 20 : 16,
                      fontSize: screens.md ? 13 : 12 
                    }}>
                      {log.relatedPlanIds.map(planId => (
                        <li key={planId}>
                          <Text type="secondary">{getPlanTitle(planId)}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          }))}
        />
      ) : (
        <Text type="secondary">暂无日志记录</Text>
      )}
    </div>
  );
};

export default LogTimeline;