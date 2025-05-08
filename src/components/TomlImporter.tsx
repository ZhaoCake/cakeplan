import React, { useState } from 'react';
import { Modal, Input, Upload, Button, message, Typography, Space } from 'antd';
import { UploadOutlined, ImportOutlined } from '@ant-design/icons';
import { importGoalFromToml } from '../services/goalService';
import type { UploadProps, UploadFile } from 'antd';
import type { Goal } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

interface TomlImporterProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (goal: Goal) => void;
}

const TomlImporter: React.FC<TomlImporterProps> = ({ visible, onClose, onSuccess }) => {
  const [tomlContent, setTomlContent] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleImport = () => {
    if (!tomlContent.trim()) {
      message.error('请输入或上传TOML内容');
      return;
    }

    try {
      const goal = importGoalFromToml(tomlContent);
      message.success('成功导入目标');
      onSuccess(goal);
      handleCancel();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('导入失败，请检查TOML格式是否正确');
      }
    }
  };

  const handleCancel = () => {
    setTomlContent('');
    setFileList([]);
    onClose();
  };

  // 文件上传属性配置
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setTomlContent(reader.result as string);
      };
      reader.onerror = () => {
        message.error('文件读取失败');
      };
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
      setTomlContent('');
      return true;
    },
    accept: '.toml',
    maxCount: 1
  };

  return (
    <Modal
      title="导入TOML目标"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>取消</Button>,
        <Button
          key="import"
          type="primary"
          icon={<ImportOutlined />}
          onClick={handleImport}
        >
          导入
        </Button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>请输入TOML格式的目标配置，或上传TOML文件：</Text>
        
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传TOML文件</Button>
        </Upload>
        
        <TextArea
          rows={10}
          placeholder={`# 示例TOML格式
[goal]
title = "学习React"
description = "掌握React基础知识和常用库"
start_date = "2025-05-01"
end_date = "2025-06-30"

[[plans]]
title = "学习React基础"
description = "学习React组件、Props、State等概念"
start_date = "2025-05-01"
end_date = "2025-05-15"

[[plans]]
title = "学习React Router"
description = "学习路由配置和页面跳转"
start_date = "2025-05-16"
end_date = "2025-05-30"

[[logs]]
date = "2025-05-01"
content = "开始学习React基础"
related_plans = ["学习React基础"]
`}
          value={tomlContent}
          onChange={(e) => setTomlContent(e.target.value)}
        />
      </Space>
    </Modal>
  );
};

export default TomlImporter;