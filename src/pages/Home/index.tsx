import { Layout, Menu } from "antd";
import { HomeOutlined, ShopOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [selectedPage, setSelectedPage] = useState<"dashboard" | "products">(
    "dashboard"
  );

  const renderContent = () => {
    switch (selectedPage) {
      case "dashboard":
        return (
          <div className="h-full">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-base leading-relaxed">
              Welcome to the Dashboard page. Add your dashboard content here.
            </p>
          </div>
        );
      case "products":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <p className="text-base leading-relaxed">
              Welcome to the Products page. Add your products content here.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        className="fixed h-full bg-dark text-white"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo p-4 text-white text-center">Logo</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedPage]}
          onClick={({ key }) =>
            setSelectedPage(key as "dashboard" | "products")
          }
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="products" icon={<ShopOutlined />}>
            Products
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 300 }}>
        <Header className="bg-white shadow p-4">Header</Header>
        <Content
          className="m-4 p-4 bg-white shadow overflow-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
