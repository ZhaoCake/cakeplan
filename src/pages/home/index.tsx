import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Card, Alert, Space, Grid } from 'antd';
import { PlusOutlined, ImportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../../components/GoalCard';
import TomlImporter from '../../components/TomlImporter';
import { getAllGoals } from '../../services/goalService';
import type { Goal } from '../../types';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// 欢迎组件
const WelcomeComponent = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="欢迎使用计划网站"
          description="这是一个帮助您管理目标、计划和进度的工具。您可以通过导入TOML文件或直接创建新目标开始使用。"
          type="info"
          showIcon
        />
        
        <Typography>
          <Title level={screens.md ? 4 : 5}>快速开始</Title>
          <Paragraph>
            1. 点击"导入TOML"按钮导入示例目标，或创建自己的TOML文件
          </Paragraph>
          <Paragraph>
            2. 查看目标详情，管理计划的完成状态
          </Paragraph>
          <Paragraph>
            3. 添加日志记录您的进展
          </Paragraph>
          
          <Button 
            type="link" 
            icon={<QuestionCircleOutlined />}
            onClick={() => navigate('/help')}
          >
            查看详细帮助和TOML格式说明
          </Button>
        </Typography>
      </Space>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // 加载所有目标
  useEffect(() => {
    const loadGoals = () => {
      const allGoals = getAllGoals();
      setGoals(allGoals);
    };
    
    loadGoals();
  }, []);

  // 处理目标卡片点击
  const handleGoalClick = (goalId: string) => {
    navigate(`/goal/${goalId}`);
  };

  // 导入成功后重新加载目标列表
  const handleImportSuccess = (goal: Goal) => {
    setGoals(getAllGoals());
    // 导入成功后导航到新目标的详情页
    navigate(`/goal/${goal.id}`);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: screens.sm ? 'row' : 'column',
          justifyContent: 'space-between', 
          alignItems: screens.sm ? 'center' : 'flex-start',
          gap: screens.sm ? 0 : 16
        }}>
          <Title level={screens.md ? 2 : 3} style={{ margin: screens.sm ? 0 : '0 0 16px 0' }}>
            我的目标
          </Title>
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {/* 待实现：创建新目标功能 */}}
            >
              新增目标
            </Button>
            <Button 
              icon={<ImportOutlined />}
              onClick={() => setImportModalVisible(true)}
            >
              导入TOML
            </Button>
          </Space>
        </div>

        {goals.length > 0 ? (
          <Row gutter={[16, 16]}>
            {goals.map(goal => (
              <Col xs={24} sm={24} md={12} lg={8} xl={8} key={goal.id}>
                <GoalCard 
                  goal={goal} 
                  onClick={() => handleGoalClick(goal.id)} 
                />
              </Col>
            ))}
          </Row>
        ) : (
          <WelcomeComponent />
        )}
      </Space>

      <TomlImporter
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />
    </>
  );
};

export default HomePage;