import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import * as S from './NotificationList.styled';

const NotificationList = ({ onClose }) => {
  const { notifications, markAsRead, deleteNotification, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications(0, 20);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    if (notification.alarmStatus === 'N') {
      await markAsRead(notification.alarmId);
    }

    if (notification.alarmLink) {
      navigate(notification.alarmLink);
      onClose();
    }
  };

  const handleDelete = async (e, alarmId) => {
    e.stopPropagation();
    await deleteNotification(alarmId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (notifications.length === 0) {
    return (
      <S.EmptyState>
        <S.EmptyText>알림이 없습니다</S.EmptyText>
      </S.EmptyState>
    );
  }

  return (
    <S.NotificationListContainer>
      {notifications.map((notification) => (
        <S.NotificationItem
          key={notification.alarmId}
          $isUnread={notification.alarmStatus === 'N'}
          onClick={() => handleNotificationClick(notification)}
        >
          <S.NotificationContent>
            <S.NotificationText>{notification.alarmContent}</S.NotificationText>
            <S.NotificationMeta>
              <S.NotificationTime>{formatDate(notification.createDate)}</S.NotificationTime>
              {notification.alarmType && (
                <S.NotificationType>{notification.alarmType}</S.NotificationType>
              )}
            </S.NotificationMeta>
          </S.NotificationContent>
          <S.DeleteButton
            onClick={(e) => handleDelete(e, notification.alarmId)}
            title="삭제"
          >
            ×
          </S.DeleteButton>
        </S.NotificationItem>
      ))}
    </S.NotificationListContainer>
  );
};

export default NotificationList;

