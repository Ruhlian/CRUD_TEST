import React, { useEffect } from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  // Cierra el modal cuando la tecla Escape es presionada
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  // Cierra el modal si se hace clic fuera del contenido
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {children}
        <button className="close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
