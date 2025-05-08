import React from 'react';
import { Card, Progress, Tag, Typography, Space, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { Goal } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

// 状态对应的颜色和图标
const statusConfig = {
  'not-started': { color: 'default', icon: <ClockCircleOutlined />, text: '未开始' },
  'in-progress': { color: 'processing', icon: <ClockCircleOutlined />, text: '进行中' },
  'completed': { color: 'success', icon: <CheckCircleOutlined />, text: '已完成' },
  'failed': { color: 'error', icon: <ExclamationCircleOutlined />, text: '未完成' },
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  // 计算剩余天数
  const calculateRemainingDays = () => {
    const endDate = dayjs(goal.endDate);
    const today = dayjs();
    return endDate.diff(today, 'day');
  };

  const remainingDays = calculateRemainingDays();
  const { color, icon, text } = statusConfig[goal.status];

  return (
    <Card 
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>{goal.title}</Title>
          <Tag color={color as any} icon={icon}>{text}</Tag>
        </Space>

        <Text>{goal.description}</Text>
        
        <Space>
          <Text type="secondary">开始日期: {dayjs(goal.startDate).format('YYYY-MM-DD')}</Text>
          <Text type="secondary">结束日期: {dayjs(goal.endDate).format('YYYY-MM-DD')}</Text>
        </Space>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>进度</Text>
            <Text 
              type={remainingDays < 0 && goal.progress < 100 ? 'danger' : 'secondary'}
            >
              {remainingDays >= 0 
                ? `剩余 ${remainingDays} 天` 
                : `已过期 ${Math.abs(remainingDays)} 天`}
            </Text>
          </div>
          <Progress percent={goal.progress} status={goal.status === 'failed' ? 'exception' : undefined} />
        </Space>
      </Space>
    </Card>
  );
};

export default GoalCard;