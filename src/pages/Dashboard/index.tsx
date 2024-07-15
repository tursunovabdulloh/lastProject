import { useState, useEffect } from "react";
import { Card, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Dashboard = () => {
  const [mensClothesCount, setMensClothesCount] = useState(0);
  const [womensClothesCount, setWomensClothesCount] = useState(0);
  const [totalClothesCount, setTotalClothesCount] = useState(0);
  const [todaysAddedClothesCount, setTodaysAddedClothesCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => doc.data());

        const mensClothes = products.filter(
          (product) => product.gender === "male"
        ).length;
        const womensClothes = products.filter(
          (product) => product.gender === "female"
        ).length;
        const totalClothes = products.length;

        const today = new Date().toISOString().split("T")[0];
        const todaysAddedClothes = products.filter(
          (product) => product.date === today
        ).length;

        const previousTotal = 340;

        ((totalClothes - previousTotal) / previousTotal) * 100;

        setMensClothesCount(mensClothes);
        setWomensClothesCount(womensClothes);
        setTotalClothesCount(totalClothes);
        setTodaysAddedClothesCount(todaysAddedClothes);
      }
    );

    return () => unsubscribe();
  }, []);
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  };

  const cardStyle = {
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const cardHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  };
  return (
    <div style={gridStyle}>
      <Card
        style={cardStyle}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = cardHoverStyle.transform;
          e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <UserOutlined style={{ fontSize: "24px", color: "#08c" }} />
        <Statistic
          title="Men's Clothes"
          value={mensClothesCount}
          precision={0}
          valueStyle={{
            color: mensClothesCount > 0 ? "#3f8600" : "#cf1322",
          }}
          prefix={
            mensClothesCount > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
          }
          suffix="items"
        />
      </Card>
      <Card
        style={cardStyle}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = cardHoverStyle.transform;
          e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <TeamOutlined style={{ fontSize: "24px", color: "#08c" }} />
        <Statistic
          title="Women's Clothes"
          value={womensClothesCount}
          precision={0}
          valueStyle={{
            color: womensClothesCount > 0 ? "#3f8600" : "#cf1322",
          }}
          prefix={
            womensClothesCount > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
          }
          suffix="items"
        />
      </Card>
      <Card
        style={cardStyle}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = cardHoverStyle.transform;
          e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <ShopOutlined style={{ fontSize: "24px", color: "#08c" }} />
        <Statistic
          title="Total Clothes"
          value={totalClothesCount}
          precision={0}
          valueStyle={{
            color: totalClothesCount > 0 ? "#3f8600" : "#cf1322",
          }}
          prefix={
            totalClothesCount > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
          }
          suffix="items"
        />
      </Card>
      <Card
        style={cardStyle}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = cardHoverStyle.transform;
          e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <CalendarOutlined style={{ fontSize: "24px", color: "#08c" }} />
        <Statistic
          title="Today's Added Clothes"
          value={todaysAddedClothesCount}
          precision={0}
          valueStyle={{
            color: todaysAddedClothesCount > 0 ? "#3f8600" : "#cf1322",
          }}
          prefix={
            todaysAddedClothesCount > 0 ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )
          }
          suffix="items"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
