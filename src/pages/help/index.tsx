import React from 'react';
import { Typography, Card, Divider, Space, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const HelpPage: React.FC = () => {
  return (
    <Card>
      <Typography>
        <Title level={2}>使用帮助</Title>
        
        <Paragraph>
          本网站是一个计划管理工具，可以帮助您跟踪目标、计划和进度。您可以通过TOML文件格式来定义目标、计划和日志。
        </Paragraph>
        
        <Divider />
        
        <Title level={3}>TOML格式说明</Title>
        
        <Title level={4}>1. 目标定义</Title>
        <Paragraph>
          使用<Text code>[goal]</Text>部分来定义目标的基本信息：
        </Paragraph>

        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
{`[goal]
title = "目标标题"
description = "目标的详细描述"
start_date = "2025-05-10"  # 格式：YYYY-MM-DD
end_date = "2025-06-10"    # 格式：YYYY-MM-DD`}
        </pre>
        
        <Title level={4}>2. 计划列表</Title>
        <Paragraph>
          使用<Text code>[[plans]]</Text>部分来定义目标下的具体计划项。您可以定义多个计划：
        </Paragraph>

        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
{`[[plans]]
title = "计划1标题"
description = "计划1的详细描述"
start_date = "2025-05-10"
end_date = "2025-05-15"

[[plans]]
title = "计划2标题"
description = "计划2的详细描述"
start_date = "2025-05-16"
end_date = "2025-05-25"`}
        </pre>
        
        <Title level={4}>3. 日志记录</Title>
        <Paragraph>
          使用<Text code>[[logs]]</Text>部分来定义日志记录。您可以关联日志到特定的计划：
        </Paragraph>

        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
{`[[logs]]
date = "2025-05-10"
content = "日志内容描述"
related_plans = ["计划1标题", "计划2标题"]  # 可选，关联到特定计划

[[logs]]
date = "2025-05-12"
content = "另一条日志记录"`}
        </pre>
        
        <Divider />
        
        <Title level={3}>完整示例</Title>
        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
{`[goal]
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

[[plans]]
title = "学习Redux"
description = "学习状态管理库Redux的使用"
start_date = "2025-06-01"
end_date = "2025-06-15"

[[logs]]
date = "2025-05-01"
content = "今天开始学习React，安装了开发环境"
related_plans = ["学习React基础"]

[[logs]]
date = "2025-05-05"
content = "学习了React组件和Props，做了一些小练习"
related_plans = ["学习React基础"]`}
        </pre>
        
        <Divider />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="提示"
            description="您可以在导入页面中直接粘贴TOML内容，也可以上传TOML文件。导入后，您可以在网站上查看和管理您的目标、计划和进度。"
            type="info"
            showIcon
          />
        </Space>
      </Typography>
    </Card>
  );
};

export default HelpPage;