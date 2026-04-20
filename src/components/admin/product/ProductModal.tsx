import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Divider } from 'antd';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../../types/product';
import { useSupplier } from '../../../hooks/supplier/useSupplier';

interface ProductModalProps {
    open: boolean;
    editingProduct: Product | null;
    loading: boolean;
    onSubmit: (values: CreateProductRequest | UpdateProductRequest) => void;
    onClose: () => void;
}

export default function ProductModal({ open, editingProduct, loading, onSubmit, onClose }: ProductModalProps) {
    const [form] = Form.useForm();
    const { suppliers, fetchSuppliers } = useSupplier();

    useEffect(() => {
        if (open) {
            fetchSuppliers();
            if (editingProduct) {
                form.setFieldsValue({
                    ...editingProduct,
                    status: !!editingProduct.status
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ status: true, stock: 0 });
            }
        }
    }, [open, editingProduct, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    return (
        <Modal
            title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={loading}
            width={700}
            okText={editingProduct ? "Cập nhật" : "Thêm mới"}
            cancelText="Hủy"
            styles={{ body: { paddingTop: 12 } }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ status: true }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input placeholder="Ví dụ: Xi măng Hà Tiên Đa Dụng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="supplier_id"
                            label="Nhà cung cấp"
                            rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn nhà cung cấp"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="unit"
                            label="Đơn vị tính"
                            rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính' }]}
                        >
                            <Input placeholder="Ví dụ: Bao, Khối, Viên..." />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '12px 0' }} />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="import_price"
                            label="Giá nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                addonAfter="VND"
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="sell_price"
                            label="Giá bán"
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                addonAfter="VND"
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="stock"
                            label="Số lượng hiện có"
                        >
                            <InputNumber style={{ width: '100%' }} min={0} disabled={!!editingProduct} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="reorder_level"
                            label="Định mức tồn tối thiểu"
                            tooltip="Cảnh báo khi số lượng sắp hết"
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái kinh doanh"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Đang bán" unCheckedChildren="Ngừng bán" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
