"use client";

import React, { useState } from "react";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { FaBars } from "react-icons/fa";
import NotiListTile from "@/components/organisms/Notification/NotiListTile";
import { Sidebar } from "@/components/organisms/Landing/Sidebar";
import "./styles.css";

export default function NotificationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 더미 알림 데이터
  const notifications = [
    {
      id: 1,
      title: "새로운 여행이 추가되었습니다",
      message: "강원도 여행이 성공적으로 추가되었습니다.",
      time: "2시간 전",
      isRead: false,
    },
    {
      id: 2,
      title: "여행 완료 알림",
      message: "부산 여행이 완료되었습니다. 아카이브를 확인해보세요!",
      time: "1일 전",
      isRead: true,
    },
    {
      id: 3,
      title: "친구의 여행 공유",
      message: "김철수님이 새로운 여행을 공유했습니다.",
      time: "3일 전",
      isRead: true,
    },
  ];

  return (
    <div className="notification-page">
      <LayoutTitleWithActions
        title="알림"
        showBack
        rightIcon={<FaBars />}
        onRightIconClick={handleSidebar}
      >
      
      <div className="notification-content">
        <div className="notification-header">
          <h2>알림</h2>
          <button className="mark-all-read">모두 읽음</button>
        </div>
        
        <div className="notification-list">
          {notifications.map((notification) => (
            <NotiListTile
              key={notification.id}
              notification={{
                title: notification.title,
                message: notification.message
              }}
            />
          ))}
        </div>
      </div>
      </LayoutTitleWithActions>
      
      {isSidebarOpen && <Sidebar onClose={handleSidebar} />}
    </div>
  );
}
