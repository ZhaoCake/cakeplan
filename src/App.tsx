import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Layout, ConfigProvider, Menu, Grid } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { HomeOutlined, QuestionCircleOutlined, MenuOutlined } from '@ant-design/icons'
import HomePage from './pages/home'
import GoalDetailPage from './pages/goal'
import HelpPage from './pages/help'
import { useState } from 'react'
import './App.css'

const { Header, Content, Footer } = Layout
const { useBreakpoint } = Grid

// 导航菜单组件
const NavigationMenu = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const selectedKey = location.pathname === '/' ? 'home' : 
                      location.pathname.startsWith('/goal') ? 'home' :
                      location.pathname === '/help' ? 'help' : '';
  
  // 移动端显示菜单按钮
  if (!screens.md) {
    return (
      <>
        <MenuOutlined 
          style={{ fontSize: '20px', cursor: 'pointer' }}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
        />
        {mobileMenuVisible && (
          <div className="mobile-menu">
            <Menu 
              mode="vertical" 
              selectedKeys={[selectedKey]}
              style={{ 
                position: 'absolute',
                top: '64px',
                right: '0',
                width: '200px',
                zIndex: 1000,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              onClick={() => setMobileMenuVisible(false)}
            >
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                <Link to="/help">帮助</Link>
              </Menu.Item>
            </Menu>
          </div>
        )}
      </>
    );
  }
  
  // 桌面端显示水平菜单
  return (
    <Menu mode="horizontal" selectedKeys={[selectedKey]} style={{ lineHeight: '64px' }}>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">首页</Link>
      </Menu.Item>
      <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
        <Link to="/help">帮助</Link>
      </Menu.Item>
    </Menu>
  );
}

function App() {
  const screens = useBreakpoint();
  
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Header style={{ 
            background: '#fff', 
            padding: screens.md ? '0 24px' : '0 16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              fontSize: screens.md ? '1.5rem' : '1.2rem', 
              fontWeight: 'bold' 
            }}>
              我的计划网站
            </div>
            <NavigationMenu />
          </Header>
          <Content style={{ 
            padding: screens.md ? '24px 50px' : '16px', 
            transition: 'padding 0.3s' 
          }}>
            <div style={{ 
              background: '#fff', 
              padding: screens.md ? 24 : 16, 
              minHeight: 'calc(100vh - 64px - 70px)' 
            }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/goal/:id" element={<GoalDetailPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ 
            textAlign: 'center', 
            padding: screens.md ? '12px 50px' : '12px 16px' 
          }}>
            计划网站 ©{new Date().getFullYear()} 使用TOML管理目标和计划
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
