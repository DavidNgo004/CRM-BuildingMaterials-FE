import { useState, useRef } from 'react';
import {
    Modal, Button, Typography, Space, Alert,
    Divider, Progress, Tooltip,
} from 'antd';
import {
    FileExcelOutlined,
    UploadOutlined,
    DownloadOutlined,
    CloseCircleOutlined,
    CheckCircleFilled,
    InboxOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ImportExcelModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onSubmit: (file: File) => Promise<boolean>;
    onDownloadTemplate: () => void;
}

export default function ImportExcelModal({
    open,
    loading,
    onClose,
    onSubmit,
    onDownloadTemplate,
}: ImportExcelModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setFile(null);
        setDragging(false);
        setUploadProgress(0);
        setDone(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const acceptFile = (f: File | undefined) => {
        if (!f) return;
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (ext !== 'xlsx' && ext !== 'xls') {
            import('antd').then(({ message }) => message.error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
            return;
        }
        setFile(f);
        setDone(false);
        setUploadProgress(0);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        acceptFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        acceptFile(e.target.files?.[0]);
        e.target.value = '';
    };

    const handleSubmit = async () => {
        if (!file) return;

        // Fake progress animation
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 85) { clearInterval(interval); return 85; }
                return prev + Math.random() * 15;
            });
        }, 120);

        const success = await onSubmit(file);
        clearInterval(interval);

        if (success) {
            setUploadProgress(100);
            setDone(true);
            setTimeout(() => handleClose(), 1500);
        } else {
            setUploadProgress(0);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            width={520}
            centered
            destroyOnClose
            styles={{
                content: {
                    borderRadius: 20,
                    padding: 0,
                    overflow: 'hidden',
                    background: '#0f172a',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                }
            }}
        >
            {/* ── Header ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
                padding: '28px 28px 20px',
                position: 'relative',
            }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 150, height: 150, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <Space align="center" size={14}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
                    }}>
                        <FileExcelOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    <div>
                        <Title level={5} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 17 }}>
                            Import kho bằng Excel
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                            Upload file .xlsx / .xls để nhập hàng loạt
                        </Text>
                    </div>
                </Space>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: '24px 28px 28px', background: '#0f172a' }}>

                {/* Download template */}
                <div style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 12, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 20,
                }}>
                    <Space size={10}>
                        <InfoCircleOutlined style={{ color: '#10b981', fontSize: 16 }} />
                        <div>
                            <Text style={{ color: '#d1fae5', fontSize: 13, fontWeight: 600 }}>
                                File mẫu chuẩn
                            </Text>
                            <br />
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                                Cột: Tên sản phẩm | Số lượng | Đơn giá nhập
                            </Text>
                        </div>
                    </Space>
                    <Button
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={onDownloadTemplate}
                        style={{
                            background: 'rgba(16,185,129,0.15)',
                            border: '1px solid rgba(16,185,129,0.4)',
                            color: '#10b981',
                            borderRadius: 8,
                            fontWeight: 600,
                        }}
                    >
                        Tải mẫu
                    </Button>
                </div>

                {/* Drop Zone */}
                <div
                    onClick={() => !loading && inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{
                        border: `2px dashed ${dragging ? '#6366f1' : file ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: 16,
                        padding: '32px 20px',
                        textAlign: 'center',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: dragging
                            ? 'rgba(99,102,241,0.08)'
                            : file
                                ? 'rgba(99,102,241,0.05)'
                                : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.25s ease',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Glow when dragging */}
                    {dragging && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }} />
                    )}

                    {!file ? (
                        <Space direction="vertical" size={8}>
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%',
                                background: 'rgba(99,102,241,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto',
                                border: '1.5px dashed rgba(99,102,241,0.4)',
                                transition: 'all 0.25s',
                                transform: dragging ? 'scale(1.1)' : 'scale(1)',
                            }}>
                                <InboxOutlined style={{ fontSize: 28, color: '#6366f1' }} />
                            </div>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                                Kéo thả file vào đây
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                                hoặc <span style={{ color: '#6366f1', textDecoration: 'underline' }}>chọn từ máy tính</span>
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                                Hỗ trợ: .xlsx, .xls · Tối đa 10MB
                            </Text>
                        </Space>
                    ) : (
                        <Space direction="vertical" size={6} style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                                padding: '10px 14px',
                            }}>
                                <Space size={12}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: 'linear-gradient(135deg, #059669, #10b981)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <FileExcelOutlined style={{ fontSize: 20, color: '#fff' }} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <Text style={{ color: '#fff', fontWeight: 600, display: 'block', fontSize: 14 }}>
                                            {file.name}
                                        </Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                                            {formatBytes(file.size)}
                                        </Text>
                                    </div>
                                </Space>
                                <Tooltip title="Xóa file">
                                    <Button
                                        type="text" size="small" danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={(e) => { e.stopPropagation(); reset(); }}
                                        style={{ color: '#f87171' }}
                                    />
                                </Tooltip>
                            </div>

                            {/* Progress */}
                            {(loading || done) && (
                                <div style={{ padding: '4px 0' }}>
                                    <Progress
                                        percent={Math.round(uploadProgress)}
                                        strokeColor={done
                                            ? { '0%': '#10b981', '100%': '#34d399' }
                                            : { '0%': '#6366f1', '100%': '#a78bfa' }
                                        }
                                        trailColor="rgba(255,255,255,0.1)"
                                        size="small"
                                        format={p => done
                                            ? <CheckCircleFilled style={{ color: '#10b981' }} />
                                            : <span style={{ color: '#a5b4fc', fontSize: 11 }}>{p}%</span>
                                        }
                                    />
                                    {done && (
                                        <Text style={{ color: '#10b981', fontSize: 13, display: 'block', textAlign: 'center', marginTop: 4 }}>
                                            ✅ Import thành công!
                                        </Text>
                                    )}
                                </div>
                            )}
                        </Space>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {/* Guidelines */}
                <Alert
                    showIcon
                    type="info"
                    style={{
                        marginTop: 16, borderRadius: 10,
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                    }}
                    message={
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                            Hàng đầu tiên là tiêu đề (bỏ qua), dữ liệu bắt đầu từ hàng 2.
                            Tên sản phẩm phải khớp chính xác với hệ thống.
                        </Text>
                    }
                />

                <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

                {/* Actions */}
                <Space style={{ width: '100%', justifyContent: 'flex-end' }} size={10}>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        style={{
                            borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.7)', background: 'transparent',
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={loading}
                        disabled={!file || done}
                        onClick={handleSubmit}
                        style={{
                            borderRadius: 10, border: 'none', fontWeight: 600,
                            background: file && !done
                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                : undefined,
                            boxShadow: file && !done ? '0 4px 16px rgba(99,102,241,0.4)' : undefined,
                        }}
                    >
                        {loading ? 'Đang import...' : 'Import ngay'}
                    </Button>
                </Space>
            </div>
        </Modal>
    );
}
