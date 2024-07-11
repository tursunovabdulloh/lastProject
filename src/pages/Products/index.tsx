import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Radio,
  message,
  Select,
  Table,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Product } from "../../types";

export default function Products() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterGender, setFilterGender] = useState("");

  useEffect(() => {
    // Bu qismda mahsulotlarni yuklashingiz kerak, masalan Firebase yoki boshqa bir API dan
    // Masalan, bu qismda API chaqiruvi qilish kerak:
    // const fetchProducts = async () => {
    //   const response = await fetch("API_URL");
    //   const data = await response.json();
    //   setProducts(data);
    // };
    // fetchProducts();
    // Hozircha mahsulotlar uchun qiyosiy ma'lumotlar qo'shamiz
    setProducts([
      {
        id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 100,
        gender: "male",
      },
      {
        id: 2,
        name: "Product 2",
        description: "Description 2",
        price: 200,
        gender: "female",
      },
    ]);
  }, []);

  useEffect(() => {
    const filterAndSearchProducts = () => {
      let filtered = products;

      if (filterGender) {
        filtered = filtered.filter(
          (product) => product.gender === filterGender
        );
      }

      if (searchText) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterAndSearchProducts();
  }, [searchText, filterGender, products]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const newProduct: Product = {
        id: products.length + 1,
        ...values,
      };
      console.log("Form values:", values);
      message.success("Product added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setProducts([...products, newProduct]);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      message.error("Failed to add product.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
      <div className="mb-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <p className="text-2xl font-bold mb-4">
            Total Products: {filteredProducts.length}
          </p>
          <Button type="primary" onClick={showModal}>
            Create
          </Button>
        </div>
        <hr className="mb-4 border-0 h-1 bg-gray-300 rounded-lg" />
        <div
          className="flex gap-10 mb-4"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 25,
          }}
        >
          <Input
            placeholder="Search products"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              borderRadius: "5px",
              width: 250,
              borderColor: "#d9d9d9",
              transition: "border-color 0.3s ease",
            }}
            prefix={
              <SearchOutlined
                style={{
                  color: "#000",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
              />
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#40a9ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          />
          <Select
            placeholder="Filter by gender"
            value={filterGender}
            onChange={(value) => setFilterGender(value)}
            className=""
            style={{ borderRadius: "5px", width: 250 }}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </div>
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-red-500"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }
        />
      </div>

      <Modal
        title="Add New Product"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Product"
        cancelText="Cancel"
        maskClosable={false}
        centered
        width={400}
      >
        <Form
          form={form}
          name="add_product"
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Product Description"
            rules={[
              {
                required: true,
                message: "Please input the product description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Product Price"
            rules={[
              { required: true, message: "Please input the product price!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              name="logo"
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
