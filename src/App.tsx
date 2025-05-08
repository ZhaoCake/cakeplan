import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Layout, ConfigProvider, Menu, Grid } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { HomeOutlined, QuestionCircleOutlined, MenuOutlined } from '@ant-design/icons'
import HomePage from './pages/home'
import GoalDetailPage from './pages/goal'
import HelpPage from './pages/help'
import { useState, useEffect } from 'react'
import './App.css'

const { Header, Content, Footer } = Layout
const { useBreakpoint } = Grid

// 导航菜单组件
const NavigationMenu = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  // 关闭移动菜单的处理函数
  const closeMenu = () => {
    setMobileMenuVisible(false);
  };

  // 当窗口调整大小到桌面视图时，自动关闭移动菜单
  useEffect(() => {
    if (screens.md) {
      closeMenu();
    }
  }, [screens.md]);
  
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
                width: '200px',
                zIndex: 1000,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              onClick={closeMenu}
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
    <Menu mode="horizontal" selectedKeys={[selectedKey]} style={{ lineHeight: '64px', border: 'none' }}>
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
        <Layout className="layout site-layout-background" style={{ minHeight: '100vh' }}>
          <Header style={{ 
            background: '#fff', 
            padding: '0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            height: '64px',
            lineHeight: '64px'
          }}>
            <div className="site-container" style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}>
              <div style={{ 
                fontSize: screens.md ? '1.5rem' : '1.2rem', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginRight: '16px'
              }}>
                蛋糕计划
              </div>
              <NavigationMenu />
            </div>
          </Header>
          
          <Content style={{ width: '100%' }}>
            <div style={{ 
              padding: screens.md ? '24px 0' : '16px 0',
              transition: 'padding 0.3s'
            }}>
              <div className="site-container">
                <div style={{ 
                  background: '#fff', 
                  padding: screens.md ? 24 : 16, 
                  minHeight: 'calc(100vh - 64px - 70px)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
                }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/goal/:id" element={<GoalDetailPage />} />
                    <Route path="/help" element={<HelpPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </Content>
          
          <Footer style={{ 
            padding: 0,
            background: '#fff',
            boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.05)',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="site-container" style={{ textAlign: 'center' }}>
              蛋糕计划 ©{new Date().getFullYear()} 使用TOML管理目标和计划
            </div>
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
