import { useState } from "react";
import {
  AppstoreAddOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
import { useLocation, NavLink, Outlet } from "react-router-dom";
import { MenuProps, GetProp } from "antd";
const { Header, Sider, Content } = Layout;
type MenuItem = GetProp<MenuProps, "items">[number];
const items: MenuItem[] = [
  {
    key: "title",
    label: (
      <h2
        style={{ color: "#FFF", textAlign: "center", fontSize: 20 }}
        className=" text-[10px] pt-2 "
      >
        SHOP.CO
      </h2>
    ),
    disabled: true,
  },
  {
    key: "dashboard",
    icon: <AppstoreAddOutlined style={{ zoom: 1.7 }} />,
    label: (
      <NavLink className=" text-2xl" to="/dashboard">
        Dashboard
      </NavLink>
    ),
  },
  {
    key: "products",
    icon: <CalendarOutlined style={{ zoom: 1.7 }} />,
    label: (
      <NavLink className=" text-2xl" to="/products">
        Products
      </NavLink>
    ),
  },
];

export default function Home() {
  const location = useLocation();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          width: "350",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
      >
        <div className="demo-logo-vertical" />
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHeight: 60,
              },
            },
          }}
        >
          <Menu
            style={{ height: "100vh" }}
            defaultSelectedKeys={[location.pathname.slice(1)]}
            items={items}
            theme="dark"
          />
        </ConfigProvider>
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            gap: 10,
            padding: 0,
            alignItems: "center",
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <span className="mr-2 text-[#a19e9e]">Pages: </span>
          <span className="text-white">
            <HomeOutlined color="white" />
            {"   "}
            <span>{pathname == "/" ? "/dashboard" : pathname}</span>
          </span>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
