import React from 'react';
import { List, Checkbox, Typography, Tag, Space, Grid } from 'antd';
import type { Plan } from '../types';
import dayjs from 'dayjs';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface PlanItemProps {
  plan: Plan;
  onStatusChange: (planId: string, completed: boolean) => void;
}

const PlanItem: React.FC<PlanItemProps> = ({ plan, onStatusChange }) => {
  const screens = useBreakpoint();
  
  // 计算计划是否过期
  const isOverdue = () => {
    const endDate = dayjs(plan.endDate);
    const today = dayjs();
    return today.isAfter(endDate) && !plan.completed;
  };

  // 计算计划状态
  const getStatusTag = () => {
    if (plan.completed) {
      return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>;
    } else if (isOverdue()) {
      return <Tag icon={<ClockCircleOutlined />} color="error">已过期</Tag>;
    } else {
      return <Tag icon={<ClockCircleOutlined />} color="processing">进行中</Tag>;
    }
  };

  return (
    <List.Item>
      <Space align="start" style={{ width: '100%' }}>
        <Checkbox 
          checked={plan.completed}
          onChange={(e) => onStatusChange(plan.id, e.target.checked)}
        />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space align="start" wrap>
            <Text 
              strong 
              style={{ 
                textDecoration: plan.completed ? 'line-through' : 'none',
                fontSize: screens.md ? 16 : 14
              }}
            >
              {plan.title}
            </Text>
            {getStatusTag()}
          </Space>
          
          <Text 
            style={{ 
              textDecoration: plan.completed ? 'line-through' : 'none',
              color: plan.completed ? '#00000073' : undefined,
              fontSize: screens.md ? 14 : 13 
            }}
          >
            {plan.description}
          </Text>
          
          <Space 
            size={screens.sm ? "middle" : "small"} 
            wrap
            style={{ fontSize: screens.md ? 14 : 12 }}
          >
            <Text type="secondary">开始日期: {dayjs(plan.startDate).format('YYYY-MM-DD')}</Text>
            <Text type="secondary">截止日期: {dayjs(plan.endDate).format('YYYY-MM-DD')}</Text>
          </Space>
        </Space>
      </Space>
    </List.Item>
  );
};

export default PlanItem;