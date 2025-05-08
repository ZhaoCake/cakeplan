import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Card, List, Progress, 
  Space, Divider, Tag, message, Grid
} from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getGoalById, updatePlanStatus, addLogEntry } from '../../services/goalService';
import type { Goal } from '../../types';
import PlanItem from '../../components/PlanItem';
import LogTimeline from '../../components/LogTimeline';
import AddLogForm from '../../components/AddLogForm';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [showAddLog, setShowAddLog] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // 加载目标数据
  useEffect(() => {
    if (!id) return;
    
    const loadGoal = () => {
      const goalData = getGoalById(id);
      if (goalData) {
        setGoal(goalData);
      } else {
        message.error('找不到目标信息');
        navigate('/');
      }
    };
    
    loadGoal();
  }, [id, navigate]);

  // 处理计划完成状态变更
  const handlePlanStatusChange = (planId: string, completed: boolean) => {
    if (!id || !goal) return;
    
    updatePlanStatus(id, planId, completed);
    
    // 重新加载目标数据
    const updatedGoal = getGoalById(id);
    if (updatedGoal) {
      setGoal(updatedGoal);
    }
  };

  // 处理添加日志
  const handleAddLog = (values: { content: string; date: string; relatedPlanIds: string[] }) => {
    if (!id || !goal) return;
    
    addLogEntry(id, values);
    
    // 重新加载目标数据
    const updatedGoal = getGoalById(id);
    if (updatedGoal) {
      setGoal(updatedGoal);
      message.success('日志添加成功');
      setShowAddLog(false);
    }
  };

  // 状态对应的颜色和文本
  const getStatusTag = () => {
    if (!goal) return null;
    
    const statusMap = {
      'not-started': { color: 'default', text: '未开始' },
      'in-progress': { color: 'processing', text: '进行中' },
      'completed': { color: 'success', text: '已完成' },
      'failed': { color: 'error', text: '未完成' }
    };
    
    const { color, text } = statusMap[goal.status];
    return <Tag color={color as any}>{text}</Tag>;
  };

  if (!goal) {
    return <div>加载中...</div>;
  }

  return (
    <Space direction="vertical" size={screens.md ? "large" : "middle"} style={{ width: '100%' }}>
      {/* 返回按钮和标题 */}
      <div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginBottom: 16 }}
        >
          返回首页
        </Button>
        
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: screens.sm ? 'row' : 'column', 
              justifyContent: 'space-between', 
              alignItems: screens.sm ? 'flex-start' : 'stretch',
              gap: screens.sm ? 0 : 16
            }}>
              <div>
                <Space align="center" wrap>
                  <Title level={screens.md ? 3 : 4} style={{ marginBottom: 0 }}>{goal.title}</Title>
                  {getStatusTag()}
                </Space>
                <Text>{goal.description}</Text>
              </div>
              <Space 
                direction={screens.sm ? "vertical" : "horizontal"} 
                align={screens.sm ? "end" : "start"}
                style={{ marginTop: screens.sm ? 0 : 8 }}
              >
                <Space>
                  <CalendarOutlined />
                  <Text>开始日期: {dayjs(goal.startDate).format('YYYY-MM-DD')}</Text>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <Text>结束日期: {dayjs(goal.endDate).format('YYYY-MM-DD')}</Text>
                </Space>
              </Space>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            {/* 进度条 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>总体进度</Title>
                <Text strong>{goal.progress}%</Text>
              </div>
              <Progress 
                percent={goal.progress} 
                status={goal.status === 'failed' ? 'exception' : undefined}
              />
            </div>
          </Space>
        </Card>
      </div>
      
      {/* 计划列表 */}
      <Card title={`计划列表 (${goal.plans.length})`}>
        {goal.plans.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={goal.plans}
            renderItem={plan => (
              <PlanItem 
                plan={plan} 
                onStatusChange={handlePlanStatusChange} 
              />
            )}
          />
        ) : (
          <Text type="secondary">暂无计划</Text>
        )}
      </Card>
      
      {/* 日志记录 */}
      <Card 
        title={`日志记录 (${goal.logs.length})`}
        extra={
          <Button 
            type={showAddLog ? "default" : "primary"} 
            icon={<PlusOutlined />}
            onClick={() => setShowAddLog(!showAddLog)}
            size={screens.md ? "middle" : "small"}
          >
            {showAddLog ? '取消' : '添加日志'}
          </Button>
        }
      >
        {showAddLog && (
          <div style={{ marginBottom: 16 }}>
            <Card type="inner" title="添加新日志">
              <AddLogForm plans={goal.plans} onAddLog={handleAddLog} />
            </Card>
          </div>
        )}
        
        <LogTimeline logs={goal.logs} plans={goal.plans} />
      </Card>
    </Space>
  );
};

export default GoalDetailPage;