import React from 'react';
import { Form, Input, DatePicker, Button, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Plan } from '../types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface AddLogFormProps {
  plans: Plan[];
  onAddLog: (values: { content: string; date: string; relatedPlanIds: string[] }) => void;
}

const AddLogForm: React.FC<AddLogFormProps> = ({ plans, onAddLog }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onAddLog({
      content: values.content,
      date: values.date.format('YYYY-MM-DD'),
      relatedPlanIds: values.relatedPlanIds || []
    });
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        name="content"
        label="日志内容"
        rules={[{ required: true, message: '请输入日志内容' }]}
      >
        <TextArea rows={4} placeholder="请输入今天的进展..." />
      </Form.Item>

      <Space style={{ width: '100%' }} align="start">
        <Form.Item
          name="date"
          label="日期"
          initialValue={dayjs()}
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="relatedPlanIds"
          label="相关计划"
          style={{ width: '100%' }}
        >
          <Select
            mode="multiple"
            placeholder="选择相关的计划（可选）"
            style={{ width: '100%' }}
            optionFilterProp="children"
          >
            {plans.map(plan => (
              <Option key={plan.id} value={plan.id}>
                {plan.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Space>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          添加日志
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddLogForm;