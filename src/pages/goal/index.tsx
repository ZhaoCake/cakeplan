import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Card, List, Progress, 
  Space, Divider, Tag, message, Grid, Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getGoalById, updatePlanStatus, addLogEntry, downloadGoalAsToml, deleteGoal } from '../../services/goalService';
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
    loadGoal();
  }, [id]);

  const loadGoal = () => {
    if (!id) return;
    const goalData = getGoalById(id);
    if (goalData) {
      setGoal(goalData);
    } else {
      message.error('找不到目标信息');
      navigate('/');
    }
  };

  // 处理计划完成状态变更
  const handlePlanStatusChange = (planId: string, completed: boolean) => {
    if (!id || !goal) return;
    
    updatePlanStatus(id, planId, completed);
    loadGoal();
  };

  // 处理添加日志
  const handleAddLog = (values: { content: string; date: string; relatedPlanIds: string[] }) => {
    if (!id || !goal) return;
    
    addLogEntry(id, values);
    loadGoal();
    message.success('日志添加成功');
    setShowAddLog(false);
  };

  // 导出TOML
  const handleExportToml = () => {
    if (!id) return;
    
    downloadGoalAsToml(id);
    message.success('TOML文件已下载');
  };

  // 删除目标
  const handleDeleteGoal = () => {
    if (!id) return;
    
    deleteGoal(id);
    message.success('目标已删除');
    navigate('/');
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
    return (
      <div className="full-height-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text>加载中...</Text>
      </div>
    );
  }

  return (
    <div className="full-height-content">
      {/* 返回按钮和标题区域 */}
      <div className="page-title" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginRight: 'auto' }}
        >
          返回首页
        </Button>
        
        <Space size="small" wrap style={{ justifyContent: 'flex-end' }}>
          <Tooltip title="导出TOML">
            <Button 
              icon={<ExportOutlined />} 
              onClick={handleExportToml}
            />
          </Tooltip>
          <Tooltip title="编辑目标">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => message.info('编辑功能将在未来版本中支持')}
            />
          </Tooltip>
          <Tooltip title="删除目标">
            <Button 
              icon={<DeleteOutlined />} 
              danger
              onClick={() => {
                if (window.confirm('确定要删除这个目标吗？此操作不可恢复。')) {
                  handleDeleteGoal();
                }
              }}
            />
          </Tooltip>
        </Space>
      </div>
      
      {/* 目标信息卡片 */}
      <Card className="goal-card goal-detail-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: screens.sm ? 'row' : 'column', 
            justifyContent: 'space-between', 
            alignItems: screens.sm ? 'flex-start' : 'flex-start',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 auto', minWidth: screens.sm ? '60%' : '100%' }}>
              <Space align="center" wrap style={{ marginBottom: '8px' }}>
                <Title level={screens.md ? 3 : 4} style={{ margin: 0 }}>{goal.title}</Title>
                {getStatusTag()}
              </Space>
              <Text>{goal.description}</Text>
            </div>
            
            <div style={{ 
              flex: '0 0 auto', 
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignSelf: screens.sm ? 'flex-start' : 'stretch',
              minWidth: screens.sm ? 'auto' : '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined />
                <Text>开始日期: {dayjs(goal.startDate).format('YYYY-MM-DD')}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined />
                <Text>结束日期: {dayjs(goal.endDate).format('YYYY-MM-DD')}</Text>
              </div>
            </div>
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
              strokeColor={{
                '0%': '#108ee9',
                '100%': goal.status === 'completed' ? '#52c41a' : 
                       goal.status === 'failed' ? '#ff4d4f' : '#108ee9',
              }}
            />
          </div>
        </Space>
      </Card>
      
      {/* 计划列表 */}
      <Card 
        className="goal-detail-card"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>计划列表</span>
            <Tag style={{ marginLeft: 8 }} color="blue">{goal.plans.length}</Tag>
          </div>
        }
      >
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
          <Text type="secondary" style={{ display: 'block', padding: '16px 0', textAlign: 'center' }}>
            暂无计划
          </Text>
        )}
      </Card>
      
      {/* 日志记录 */}
      <Card 
        className="goal-detail-card"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>日志记录</span>
            <Tag style={{ marginLeft: 8 }} color="blue">{goal.logs.length}</Tag>
          </div>
        }
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
        
        {goal.logs.length > 0 ? (
          <LogTimeline logs={goal.logs} plans={goal.plans} />
        ) : (
          <Text type="secondary" style={{ display: 'block', padding: '16px 0', textAlign: 'center' }}>
            暂无日志记录，点击"添加日志"按钮记录你的进展
          </Text>
        )}
      </Card>
    </div>
  );
};

export default GoalDetailPage;