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
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
  const [sizes, setSizes] = useState<string[]>([]);

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
      setFile(
        product.image ? product.image.map((url: string) => ({ url })) : []
      );
      setSizes(product.sizes);
    } else {
      setEditText(false);
      setCurrentProduct(null);
      form.resetFields();
      setFile([]);
      setSizes([]);
    }
    setIsModalVisible(true);
  };

  const showImagePreview = (imageUrls: string[]) => {
    setImageUrls(imageUrls);
    setImagePreviewVisible(true);
  };

  const uploadProductImages = async (files: any[]) => {
    const storage = getStorage();
    const urls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return urls;
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      let imageUrls = values.image;

      if (file && file.length > 0) {
        imageUrls = await uploadProductImages(file.map((f) => f.originFileObj));
      }

      values.image = imageUrls;
      values.sizes = sizes;

      if (editText && currentProduct) {
        const productsDocRef = doc(db, "products", currentProduct.id);
        await updateDoc(productsDocRef, values);

        const updateProducts = products.map((product) =>
          product.id === currentProduct.id
            ? { ...currentProduct, ...values }
            : product
        );
        setProducts(updateProducts);
        message.success("Mahsulot muvaffaqiyatli yangilandi!");
      } else {
        const newProduct: Product = {
          id: products.length + 1,
          ...values,
        };
        const docRef = await addDoc(collection(db, "products"), values);
        newProduct.id = docRef.id;
        setProducts([...products, newProduct]);
        message.success("Mahsulot muvaffaqiyatli qo'shildi!");
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
      const productSnapshot = await getDoc(productDocRef);
      const productData = productSnapshot.data() as Product;

      await deleteDoc(productDocRef);

      if (productData.image && productData.image.length > 0) {
        const storage = getStorage();
        await Promise.all(
          productData.image.map(async (imageUrl: string) => {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          })
        );
      }

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
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Sizes",
      dataIndex: "sizes",
      key: "sizes",
      width: 100,
      render: (sizes: string[] | undefined) =>
        sizes ? sizes.join(", ") : "N/A",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (images: string[]) => (
        <Button onClick={() => showImagePreview(images)}>
          <Image src={images[0]} width={50} height={50} preview={false} />
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
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
            suffix={
              <SearchOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
            }
            placeholder="Search products"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              borderRadius: "5px",
              width: 250,
              borderColor: "#d9d9d9",
              transition: "border 0.3s",
              backgroundColor: "#fafafa", // Yengil fon rangi
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Yengil soya effekti
            }}
          />
          <Select
            placeholder="Filter by gender"
            value={filterGender}
            onChange={(value) => setFilterGender(value)}
            style={{ width: 150 }}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </div>
      </div>
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        size="middle"
      />
      <Modal
        title={editText ? "Edit Product" : "Create Product"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered // Center the modal
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              { required: true, message: "Please select product gender" },
            ]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Sizes">
            <Checkbox.Group
              options={[
                { label: "XS", value: "XS" },
                { label: "S", value: "S" },
                { label: "M", value: "M" },
                { label: "L", value: "L" },
                { label: "XL", value: "XL" },
                { label: "XXL", value: "XXL" },
              ]}
              value={sizes}
              onChange={(checkedValues) => setSizes(checkedValues as string[])}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Product Images"
            rules={[
              { required: true, message: "Please upload product images" },
            ]}
          >
            <Upload
              multiple // Allow multiple uploads
              listType="picture-card"
              fileList={file}
              onChange={({ fileList }) => setFile(fileList)}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined /> Upload
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Image Preview"
        visible={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        centered // Center the modal
      >
        {imageUrls.map((url, index) => (
          <Image key={index} src={url} style={{ marginBottom: 10 }} />
        ))}
      </Modal>
    </div>
  );
}
