import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Alert, Space, Grid, Modal, message, Select } from 'antd';
import { 
  PlusOutlined, 
  ImportOutlined, 
  QuestionCircleOutlined,
  ExportOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../../components/GoalCard';
import TomlImporter from '../../components/TomlImporter';
import CreateGoalForm from '../../components/CreateGoalForm';
import { getAllGoals, downloadGoalAsToml, exportGoalToTomlString } from '../../services/goalService';
import type { Goal } from '../../types';

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;
const { Option } = Select;

// 欢迎组件
const WelcomeComponent = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  return (
    <Card className="goal-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="欢迎使用计划网站"
          description="这是一个帮助您管理目标、计划和进度的工具。您可以通过导入TOML文件或创建新目标开始使用。"
          type="info"
          showIcon
        />
        
        <Typography>
          <Title level={screens.md ? 4 : 5}>快速开始</Title>
          <Paragraph>
            1. 点击"新增目标"按钮创建一个新的目标
          </Paragraph>
          <Paragraph>
            2. 或者点击"导入TOML"按钮导入已有的目标配置
          </Paragraph>
          <Paragraph>
            3. 查看目标详情，管理计划的完成状态和添加日志记录
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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [exportTomlContent, setExportTomlContent] = useState<string>('');
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // 加载所有目标
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const allGoals = getAllGoals();
    setGoals(allGoals);
  };

  // 处理目标卡片点击
  const handleGoalClick = (goalId: string) => {
    navigate(`/goal/${goalId}`);
  };

  // 创建或导入成功后重新加载目标列表
  const handleGoalSuccess = (goal: Goal) => {
    loadGoals();
    // 导航到新目标的详情页
    navigate(`/goal/${goal.id}`);
  };

  // 处理导出TOML
  const handleExportClick = () => {
    if (goals.length === 0) {
      message.warning('当前没有可导出的目标');
      return;
    }
    setExportModalVisible(true);
    // 默认选择第一个目标
    if (goals.length > 0) {
      setSelectedGoalId(goals[0].id);
      const tomlContent = exportGoalToTomlString(goals[0].id);
      if (tomlContent) {
        setExportTomlContent(tomlContent);
      }
    }
  };

  // 处理导出目标变更
  const handleExportGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
    const tomlContent = exportGoalToTomlString(goalId);
    if (tomlContent) {
      setExportTomlContent(tomlContent);
    }
  };

  // 下载TOML文件
  const handleDownloadToml = () => {
    if (selectedGoalId) {
      downloadGoalAsToml(selectedGoalId);
      message.success('TOML文件已下载');
      setExportModalVisible(false);
    }
  };

  // 复制TOML内容到剪贴板
  const handleCopyToml = async () => {
    if (exportTomlContent) {
      try {
        await navigator.clipboard.writeText(exportTomlContent);
        message.success('TOML内容已复制到剪贴板');
      } catch (err) {
        message.error('复制失败，请手动复制');
      }
    }
  };

  return (
    <div className="full-height-content">
      <div className="page-title">
        <Title level={screens.md ? 2 : 3} style={{ marginBottom: 0 }}>我的目标</Title>
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <Space size="middle" wrap style={{ justifyContent: screens.sm ? 'flex-end' : 'center', width: '100%', display: 'flex' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新增目标
          </Button>
          <Button 
            icon={<ImportOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            导入TOML
          </Button>
          <Button 
            icon={<ExportOutlined />}
            onClick={handleExportClick}
            disabled={goals.length === 0}
          >
            导出TOML
          </Button>
        </Space>
      </div>

      {goals.length > 0 ? (
        <div className="goal-grid">
          {goals.map(goal => (
            <div key={goal.id} className="equal-height-col">
              <GoalCard 
                goal={goal} 
                onClick={() => handleGoalClick(goal.id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <WelcomeComponent />
      )}

      {/* 导入TOML模态框 */}
      <TomlImporter
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onSuccess={handleGoalSuccess}
      />
      
      {/* 创建新目标模态框 */}
      <CreateGoalForm
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleGoalSuccess}
      />

      {/* 导出TOML模态框 */}
      <Modal
        title="导出目标为TOML"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="copy" 
            icon={<ExportOutlined />} 
            onClick={handleCopyToml}
          >
            复制内容
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadToml}
          >
            下载TOML文件
          </Button>
        ]}
        width={700}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 16 }}>
            <Text>选择要导出的目标：</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              value={selectedGoalId}
              onChange={handleExportGoalChange}
            >
              {goals.map(goal => (
                <Option key={goal.id} value={goal.id}>
                  {goal.title}
                </Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text>TOML内容预览：</Text>
            <pre
              style={{
                background: '#f5f5f5',
                padding: 16,
                borderRadius: 4,
                overflow: 'auto',
                maxHeight: '300px',
                marginTop: 8
              }}
            >
              {exportTomlContent}
            </pre>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default HomePage;