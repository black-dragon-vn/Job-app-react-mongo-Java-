// NotiService.tsx
import axiosInstance from "../Interceptor/AxiosInsstance";

const BASE_URL = "notification/";

// ✅ emailをuserIdに変更
export const getNotifications = async (userId: number) => {
    try {
        console.log('📡 Fetching notifications for userId:', userId);
        const result = await axiosInstance.get(`${BASE_URL}get/${userId}`);
        console.log('✅ Notifications fetched:', result.data);
        return result.data;
    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
    }
};

export const readNotifications = async (id: number) => {
    try {
        console.log('📖 Marking notification as read:', id);
        const result = await axiosInstance.put(`${BASE_URL}read/${id}`);
        console.log('✅ Notification marked as read');
        return result.data;
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        throw error;
    }
};

// 追加: 全ての通知を既読にする（オプション）
export const markAllAsRead = async (userId: number) => {
    try {
        console.log('📖 Marking all notifications as read for userId:', userId);
        const result = await axiosInstance.put(`${BASE_URL}read-all/${userId}`);
        console.log('✅ All notifications marked as read');
        return result.data;
    } catch (error) {
        console.error('❌ Error marking all as read:', error);
        throw error;
    }
};