import React, { useState } from 'react';
import * as S from './AirlineRegisterModal.styled';
import { useAirlineTheme } from '../../context/AirlineThemeContext';
import { X } from 'lucide-react';

const AirlineRegisterModal = ({ isOpen, onClose }) => {
  const { theme } = useAirlineTheme();
  
  const [formData, setFormData] = useState({
    airlineName: '',
    themeColor: 'blue', // Default theme selection
    mainNumber: '',
    address: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Airline Registration Data:', formData);
    alert(`항공사 [${formData.airlineName}] 등록이 요청되었습니다.\n(DB 저장 로직은 추후 구현)`);
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={e => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>
          <X size={24} />
        </S.CloseButton>

        <S.Header>
          <S.Title>새 항공사 등록</S.Title>
          <S.SubTitle>새로운 항공사 시스템을 구축합니다</S.SubTitle>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          {/* 항공사 명 */}
          <S.InputGroup>
            <S.Label>항공사 명 (AIRLINE_NAME)</S.Label>
            <S.Input
              name="airlineName"
              placeholder="예: Sky Airlines"
              value={formData.airlineName}
              onChange={handleInputChange}
              required
            />
          </S.InputGroup>

          {/* 사이트 테마 */}
          <S.InputGroup>
            <S.Label>사이트 테마 (THEME)</S.Label>
            <S.Select
              name="themeColor"
              value={formData.themeColor}
              onChange={handleInputChange}
            >
              <option value="blue">Blue (대한항공 스타일)</option>
              <option value="green">Green (진에어 스타일)</option>
              <option value="red">Red (티웨이 스타일)</option>
              <option value="orange">Orange (제주항공 스타일)</option>
            </S.Select>
          </S.InputGroup>

          {/* 대표번호 */}
          <S.InputGroup>
            <S.Label>대표번호 (MAIN_NUMBER)</S.Label>
            <S.Input
              name="mainNumber"
              placeholder="예: 1588-1234"
              value={formData.mainNumber}
              onChange={handleInputChange}
              required
            />
          </S.InputGroup>

          {/* 주소 */}
          <S.InputGroup>
            <S.Label>주소 (AIRLINE_ADDRESS)</S.Label>
            <S.Input
              name="address"
              placeholder="본사 주소를 입력하세요"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </S.InputGroup>

          {/* 항공사 설명 */}
          <S.InputGroup>
            <S.Label>항공사 설명 (AIRLINE_DESC)</S.Label>
            <S.TextArea
              name="description"
              placeholder="항공사에 대한 간단한 설명을 입력하세요"
              value={formData.description}
              onChange={handleInputChange}
            />
          </S.InputGroup>

          <S.SubmitButton type="submit">
            등록 신청하기
          </S.SubmitButton>
        </S.Form>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default AirlineRegisterModal;
