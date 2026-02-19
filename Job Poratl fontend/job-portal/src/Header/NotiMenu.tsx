/* eslint-disable @typescript-eslint/no-explicit-any */
import { Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { Menu, Notification } from '@mantine/core';
import { IconCheck, IconMail, IconCalendar, IconUserCheck, IconAlertCircle } from '@tabler/icons-react';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNotifications, readNotifications } from "../Services/NotiService";

const NotiMenu = () => {
    const user = useSelector((state: any) => state.user);
    const [notifications, setNotifications] = useState<any>([]);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch khi component mount
    useEffect(() => {
        console.log('👤 NotiMenu - User:', user);
        console.log('📍 user.userId:', user?.userId, 'Type:', typeof user?.userId);
        console.log('📍 user.id:', user?.id);
        
        if (!user?.userId) {  // ✅ ĐỔI THÀNH userId
            console.warn('⚠️ No userId found');
            return;
        }
        
        // eslint-disable-next-line react-hooks/immutability
        fetchNotifications();
    }, [user?.userId]);  // ✅ ĐỔI THÀNH userId

    // Fetch lại khi mở menu
    useEffect(() => {
        if (opened && user?.userId) {  // ✅ ĐỔI THÀNH userId
            fetchNotifications();
        }
    }, [opened, user?.userId]);  // ✅ ĐỔI THÀNH userId

    const fetchNotifications = () => {
        if (!user?.userId) {  // ✅ ĐỔI THÀNH userId
            console.error('❌ Cannot fetch: no userId');
            return;
        }

        setLoading(true);
        console.log('📡 Fetching notifications for userId:', user.userId, 'Type:', typeof user.userId);
        
        getNotifications(user.userId)  // ✅ ĐỔI THÀNH userId
            .then((res) => {
                console.log("✅ Notifications received:", res);
                setNotifications(res);
            })
            .catch((err) => {
                console.error("❌ Error fetching notifications:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const markAsRead = async (index: number) => {
        const notiToMark = notifications[index];
        
        console.log("📖 Marking as read - Notification ID:", notiToMark.id);
        
        const updatedNotis = notifications.filter((_: any, i: number) => i !== index);
        setNotifications(updatedNotis);
        
        try {
            await readNotifications(notiToMark.id);
            console.log("✅ Notification marked as read:", notiToMark.id);
        } catch (err) {
            console.error("❌ Failed to mark notification as read:", err);
            setNotifications(notifications);
        }
    };

    const getIcon = (action: string) => {
        switch (action) {
            case "New Application":
                return <IconMail size={20} />;
            case "Interview Scheduled":
            case "Interview Schedule":
                return <IconCalendar size={20} />;
            case "Application Accepted":
                return <IconUserCheck size={20} />;
            case "Application Shortlisted":
                return <IconCheck size={20} />;
            default:
                return <IconAlertCircle size={20} />;
        }
    };

    const getColor = (action: string) => {
        switch (action) {
            case "New Application":
                return "blue";
            case "Interview Scheduled":
            case "Interview Schedule":
                return "violet";
            case "Application Accepted":
                return "green";
            case "Application Shortlisted":
                return "cyan";
            case "Application Submitted":
                return "teal";
            default:
                return "gray";
        }
    };

    const unreadCount = notifications.length;

    return (
        <Menu shadow="md" width={420} opened={opened} onChange={setOpened}>
            <Menu.Target>
                <div className="cursor-pointer bg-mine-shaft-800 p-2 rounded-full hover:bg-mine-shaft-700 transition-colors">
                    <Indicator 
                        color="red" 
                        size={9} 
                        offset={6} 
                        processing={unreadCount > 0}
                        disabled={unreadCount === 0}
                        label={unreadCount > 9 ? '9+' : (unreadCount > 0 ? unreadCount : undefined)}
                    >
                        <IconBell stroke={2} />
                    </Indicator>
                </div>
            </Menu.Target>

            <Menu.Dropdown>
                <div className="px-4 py-3 border-b border-mine-shaft-700">
                    <span className="font-semibold text-base">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </span>
                </div>

                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <IconBell size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No Notifications</p>
                        </div>
                    ) : (
                        notifications.map((noti: any, index: number) => (
                            <div key={noti.id} className="transition-all duration-200">
                                <Notification 
                                    className="hover:bg-mine-shaft-900 transition-colors w-full cursor-pointer" 
                                    icon={getIcon(noti.action)}
                                    onClose={() => markAsRead(index)}
                                    color={getColor(noti.action)}
                                    title={noti.action}
                                    withCloseButton
                                >
                                    <div className="text-sm mb-1">{noti.message}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(noti.timestamp).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </Notification>
                            </div>
                        ))
                    )}
                </div>

                {notifications.length > 0 && (
                    <>
                        <Menu.Divider />
                        <Menu.Item 
                            className="text-center text-sm text-bright-sun-400 hover:bg-mine-shaft-800"
                            onClick={() => {
                                console.log("📋 View all notifications clicked");
                            }}
                        >
                            View All Notifications
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

export default NotiMenu;