import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Space, Divider, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addGoal } from '../services/goalService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

interface CreateGoalFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (goal: Goal) => void;
}

interface PlanFormValues {
  title: string;
  description: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

interface GoalFormValues {
  title: string;
  description: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  plans: PlanFormValues[];
}

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm<GoalFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      // 创建新目标ID
      const goalId = uuidv4();
      
      // 转换计划数据
      const plans = values.plans.map(plan => ({
        id: uuidv4(),
        title: plan.title,
        description: plan.description,
        startDate: plan.startDate.format('YYYY-MM-DD'),
        endDate: plan.endDate.format('YYYY-MM-DD'),
        completed: false,
        goalId
      }));
      
      // 创建新目标
      const newGoal: Goal = {
        id: goalId,
        title: values.title,
        description: values.description,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        progress: 0, // 新目标进度为0
        status: 'not-started',
        plans,
        logs: []
      };
      
      // 添加到存储
      addGoal(newGoal);
      
      // 重置表单并关闭
      form.resetFields();
      onSuccess(newGoal);
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const disabledStartDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const disabledEndDate = (current: dayjs.Dayjs) => {
    const startDate = form.getFieldValue('startDate');
    return (current && current < dayjs().startOf('day')) || (startDate && current < startDate);
  };

  const disabledPlanStartDate = (current: dayjs.Dayjs, index: number) => {
    const goalStartDate = form.getFieldValue('startDate');
    const goalEndDate = form.getFieldValue('endDate');
    
    if (!goalStartDate || !goalEndDate) return true;
    
    return current < goalStartDate || current > goalEndDate;
  };

  const disabledPlanEndDate = (current: dayjs.Dayjs, index: number) => {
    const goalStartDate = form.getFieldValue('startDate');
    const goalEndDate = form.getFieldValue('endDate');
    const planStartDate = form.getFieldValue(['plans', index, 'startDate']);
    
    if (!goalStartDate || !goalEndDate) return true;
    if (!planStartDate) return current < goalStartDate || current > goalEndDate;
    
    return current < planStartDate || current > goalEndDate;
  };

  return (
    <Modal
      title="创建新目标"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={650}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="form-spacing"
        initialValues={{
          startDate: dayjs(),
          endDate: dayjs().add(30, 'day'),
          plans: [{ title: '', description: '', startDate: dayjs(), endDate: dayjs().add(7, 'day') }]
        }}
      >
        <Title level={5}>目标信息</Title>
        <Form.Item
          name="title"
          label="目标标题"
          rules={[{ required: true, message: '请输入目标标题' }]}
        >
          <Input placeholder="请输入目标标题" />
        </Form.Item>

        <Form.Item
          name="description"
          label="目标描述"
          rules={[{ required: true, message: '请输入目标描述' }]}
        >
          <TextArea rows={3} placeholder="请输入目标的详细描述" />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
            style={{ width: '48%' }}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              disabledDate={disabledStartDate}
              onChange={() => {
                // 重置计划的日期
                const plans = form.getFieldValue('plans');
                if (plans && plans.length > 0) {
                  const updatedPlans = plans.map((plan: any) => ({
                    ...plan,
                    startDate: form.getFieldValue('startDate'),
                    endDate: form.getFieldValue('endDate')
                  }));
                  form.setFieldsValue({ plans: updatedPlans });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期' }]}
            style={{ width: '48%' }}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              disabledDate={disabledEndDate}
            />
          </Form.Item>
        </Space>

        <Divider />
        <Title level={5}>计划列表</Title>

        <Form.List name="plans">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: 24, border: '1px dashed #d9d9d9', padding: 16, borderRadius: 8 }}>
                  <Space align="baseline" style={{ marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
                    <Title level={5} style={{ margin: 0 }}>计划 {index + 1}</Title>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        删除此计划
                      </Button>
                    )}
                  </Space>

                  <Form.Item
                    {...field}
                    name={[field.name, 'title']}
                    label="计划标题"
                    rules={[{ required: true, message: '请输入计划标题' }]}
                  >
                    <Input placeholder="请输入计划标题" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'description']}
                    label="计划描述"
                    rules={[{ required: true, message: '请输入计划描述' }]}
                  >
                    <TextArea rows={2} placeholder="请输入计划的详细描述" />
                  </Form.Item>

                  <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'startDate']}
                      label="开始日期"
                      rules={[{ required: true, message: '请选择开始日期' }]}
                      style={{ width: '48%' }}
                    >
                      <DatePicker 
                        style={{ width: '100%' }} 
                        format="YYYY-MM-DD"
                        disabledDate={(current) => disabledPlanStartDate(current, field.name)}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'endDate']}
                      label="结束日期"
                      rules={[{ required: true, message: '请选择结束日期' }]}
                      style={{ width: '48%' }}
                    >
                      <DatePicker 
                        style={{ width: '100%' }} 
                        format="YYYY-MM-DD"
                        disabledDate={(current) => disabledPlanEndDate(current, field.name)}
                      />
                    </Form.Item>
                  </Space>
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    const goalStartDate = form.getFieldValue('startDate');
                    const goalEndDate = form.getFieldValue('endDate');
                    
                    add({
                      title: '',
                      description: '',
                      startDate: goalStartDate,
                      endDate: goalEndDate
                    });
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  添加计划
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              创建目标
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGoalForm;