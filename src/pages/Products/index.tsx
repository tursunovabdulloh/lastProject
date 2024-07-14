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
  Popconfirm,
  Image,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { Product } from "../../types";

export default function Products() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [editText, setEditText] = useState(true);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [file, setFile] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]); // New state for sizes

  console.log(file);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData as Product[]);
      } catch (error) {
        console.error("Error fetching products: ", error);
        message.error("Mahsulotlarni olishda xatolik yuz berdi.");
      }
    };

    fetchProducts();
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

  const showModal = (product?: Product) => {
    if (product) {
      setEditText(true);
      setCurrentProduct(product);
      form.setFieldsValue(product);
      setFile(product.image ? [{ url: product.image }] : []);
      setSizes(product.sizes); // Set sizes for edit
    } else {
      setEditText(false);
      setCurrentProduct(null);
      form.resetFields();
      setFile([]);
      setSizes([]); // Reset sizes for new product
    }
    setIsModalVisible(true);
  };

  const showImagePreview = (imageUrl: string) => {
    setImageUrls([imageUrl]);
    setImagePreviewVisible(true);
  };

  const uploadProductImages = async (file: any) => {
    const storage = getStorage();
    const storageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      let imageUrl = values.image;

      if (file && file.length > 0) {
        imageUrl = await uploadProductImages(file[0].originFileObj);
      }

      values.image = imageUrl;
      values.sizes = sizes; // Mahsulotga o'lchamlarni qo'shish

      if (editText && currentProduct) {
        const updatedProducts = products.map((product) =>
          product.id === currentProduct.id
            ? { ...currentProduct, ...values }
            : product
        );
        setProducts(updatedProducts);
        message.success("Mahsulot muvaffaqiyatli yangilandi!");
      } else {
        const newProduct: Product = {
          id: products.length + 1,
          ...values,
        };
        setProducts([...products, newProduct]);
        message.success("Mahsulot muvaffaqiyatli qo'shildi!");

        const docRef = await addDoc(collection(db, "products"), values);
        console.log("Hujjat qo'shildi ID bilan: ", docRef.id);
      }
      setIsModalVisible(false);
    } catch (errorInfo) {
      console.log("Muvaffaqiyatsizlik:", errorInfo);
      message.error("Mahsulotni saqlashda xatolik yuz berdi.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const productDocRef = doc(db, "products", id);
      await deleteDoc(productDocRef);
      setProducts(products.filter((product) => product.id !== id));
      message.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
      message.error("Mahsulotni o'chirishda xatolik yuz berdi.");
    }
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
    {
      title: "Sizes",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes: string[] | undefined) =>
        sizes ? sizes.join(", ") : "N/A", // Display sizes
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Button onClick={() => showImagePreview(image)}>
          <Image src={image} width={50} height={50} preview={false} />
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="primary"
            size="middle"
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="middle" />
          </Popconfirm>
        </div>
      ),
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
          <Button type="primary" onClick={() => showModal()}>
            Create
          </Button>
        </div>
        <hr
          className="bg-gray-300 rounded-lg"
          style={{ height: 4, background: "#001529", borderRadius: "50px" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#40a9ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#d9d9d9")
            }
          />
          <Select
            placeholder="Filter by gender"
            value={filterGender}
            onChange={(value) => setFilterGender(value)}
            style={{
              borderRadius: "5px",
              width: 250,
              borderColor: "#d9d9d9",
              transition: "border-color 0.3s ease",
            }}
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredProducts} rowKey="id" />
      <Modal
        title={editText ? "Edit Product" : "Create Product"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editText ? "Save" : "Create"}
      >
        <Form form={form} layout="vertical">
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
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Sizes">
            <Checkbox.Group
              options={[
                { label: "S", value: "S" },
                { label: "M", value: "M" },
                { label: "L", value: "L" },
                { label: "XL", value: "XL" },
              ]}
              value={sizes}
              onChange={(checkedValues) => setSizes(checkedValues as string[])}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              listType="picture"
              fileList={file}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFile(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
      >
        <Image src={imageUrls[0]} style={{ width: "100%" }} />
      </Modal>
    </div>
  );
}
