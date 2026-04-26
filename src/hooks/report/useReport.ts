import { useState, useCallback } from 'react';
import { message } from 'antd';
import { reportApi, type Report } from '../../api/report/reportApi';

export const useReport = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await reportApi.getAll({ per_page: 100 });
            const data = res.data?.data || res.data || [];
            setReports(Array.isArray(data) ? data : []);
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể tải danh sách báo cáo');
        } finally {
            setLoading(false);
        }
    }, []);

    const createReport = useCallback(async (data: { title: string; content: string; type: string }) => {
        setSubmitLoading(true);
        try {
            await reportApi.create(data);
            message.success('Gửi báo cáo thành công!');
            await fetchReports();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể gửi báo cáo');
            return false;
        } finally {
            setSubmitLoading(false);
        }
    }, [fetchReports]);

    const markSeen = useCallback(async (id: number) => {
        try {
            const res = await reportApi.markSeen(id);
            setReports(prev => prev.map(r => r.id === id ? res.data : r));
        } catch (err: any) {
            message.error('Không thể cập nhật trạng thái');
        }
    }, []);

    const replyReport = useCallback(async (id: number, admin_reply: string) => {
        try {
            const res = await reportApi.reply(id, admin_reply);
            setReports(prev => prev.map(r => r.id === id ? res.data : r));
            message.success('Đã gửi phản hồi');
            return true;
        } catch (err: any) {
            message.error('Không thể gửi phản hồi');
            return false;
        }
    }, []);

    return {
        reports, loading, submitLoading,
        fetchReports, createReport, markSeen, replyReport,
    };
};
