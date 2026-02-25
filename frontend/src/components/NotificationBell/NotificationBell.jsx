import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import NotificationList from '../NotificationList/NotificationList';
import * as S from './NotificationBell.styled';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { unreadCount, fetchNotifications, fetchUnreadCount } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(0, 20);
    }
  };

  return (
    <S.NotificationContainer ref={dropdownRef}>
      <S.NotificationButton onClick={handleBellClick}>
        <Bell size={28} />
        {unreadCount > 0 && (
          <S.Badge>{unreadCount > 99 ? '99+' : unreadCount}</S.Badge>
        )}
      </S.NotificationButton>

      {isOpen && (
        <S.Dropdown>
          <S.DropdownHeader>
            <S.DropdownTitle>알림</S.DropdownTitle>
            {unreadCount > 0 && (
              <S.UnreadCount>안읽음 {unreadCount}개</S.UnreadCount>
            )}
          </S.DropdownHeader>
          <NotificationList onClose={() => setIsOpen(false)} />
        </S.Dropdown>
      )}
    </S.NotificationContainer>
  );
};

export default NotificationBell;

