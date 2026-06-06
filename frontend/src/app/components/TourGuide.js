import 'shepherd.js/dist/css/shepherd.css';
import React, { useEffect } from 'react';
import Shepherd from 'shepherd.js';


const TourGuide = ({ isOpen, onClose, isDark = false }) => {

  
  useEffect(() => {
    if (!isOpen) return;

    const styleId = 'ai-chatbot-tour-style';
    const existingStyle = document.getElementById(styleId);
    const style = existingStyle || document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .ai-chatbot-tour {
          max-width: 380px;
          border: 1px solid ${isDark ? '#2f3d5f' : '#e1e7f5'};
          border-radius: 24px;
          background: ${isDark ? '#1a1a1a' : '#ffffff'};
          box-shadow: 0 24px 80px ${isDark ? 'rgba(0, 0, 0, 0.42)' : 'rgba(16, 24, 40, 0.16)'};
          overflow: hidden;
          font-family: var(--font-geist-sans), Inter, system-ui, sans-serif;
        }
        .ai-chatbot-tour .shepherd-content {
          background: ${isDark ? '#1a1a1a' : '#ffffff'};

        }
        .ai-chatbot-tour .shepherd-header {
          background: ${isDark ? '#1a1a1a' : '#ffffff'};
          border-bottom: 1px solid ${isDark ? '#1e2b47' : 'transparent'};
          padding: 18px 18px 12px;
        }
        .ai-chatbot-tour .shepherd-cancel-icon {
          color: ${isDark ? '#8fa2c9' : '#667085'};
        }
        .ai-chatbot-tour .shepherd-cancel-icon:hover {
          color: ${isDark ? '#eef4ff' : '#101828'};
        }
        .ai-chatbot-tour .shepherd-title {
          color: ${isDark ? '#1f2937' : '#101828'};
          font-size: 16px;
          font-weight: 650;
          letter-spacing: 0;
        }
        .ai-chatbot-tour .shepherd-text {
          background: ${isDark ? '#1a1a1a' : '#ffffff'};
          color: ${isDark ? '#b7c8ea' : '#475467'};
          font-size: 14px;
          line-height: 1.65;
          padding: 16px 18px 18px;
        }
        .ai-chatbot-tour .shepherd-footer {
          background: ${isDark ? '#1a1a1a' : '#ffffff'};
          gap: 8px;
          justify-content: flex-end;
          padding: 0 18px 18px;
        }
        .ai-chatbot-tour .shepherd-button {
          border-radius: 999px;
          border: 1px solid ${isDark ? '#2f3d5f' : '#d8e0ef'};
          background: ${isDark ? '#17223a' : '#ffffff'};
          color: ${isDark ? '#dbe7ff' : '#344054'};
          font-weight: 650;
          padding: 8px 14px;
          transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
        }
        .ai-chatbot-tour .shepherd-button:not(.shepherd-button-secondary) {
          border-color: #4f7cff;
          background: #4f7cff;
          color: #ffffff;
        }
        .ai-chatbot-tour .shepherd-button:hover {
          background: ${isDark ? '#1f2d4b' : '#f1f5ff'};
        }
        .ai-chatbot-tour .shepherd-button:not(.shepherd-button-secondary):hover {
          background: #356dff;
        }
        .shepherd-modal-overlay-container.shepherd-modal-is-visible path {
          fill: ${isDark ? 'rgba(2, 8, 23, 0.62)' : 'rgba(16, 24, 40, 0.42)'};
        }
      `;

    if (!existingStyle) {
      document.head.appendChild(style);
    }

    let isCleaningUp = false;
    const closeTour = () => {
      if (!isCleaningUp) {
        onClose?.();
      }
    };

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true
        },
        classes: 'ai-chatbot-tour',
      },
      useModalOverlay: true, // Enable modal overlay

      modalOverlayOpeningPadding: 10,
    });

    tour.addStep({
      id: 'search',
      title: 'Welcome to the AI Chatbot!',
      text: 'This is an AI assistant that can help you with your queries. From coding, to mathematics, to general knowledge, it can help you with anything! Mind you it is still learning, and inaccuracies will be there, so be patient with it.',
      buttons: [
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });
    tour.addStep({
      id: 'new-chat',
      title: 'New Chats',
      text: 'Use this button to start a new chat. Also note that, clicking on this button will reset the current chat and also save it to the database for future reference .',
      attachTo: {
        element: '.reset-chat',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'chat-container',
      title: 'The Conversation Container',
      text: 'This is where all your conversations with the AI assistant will appear.',
      attachTo: {
        element: '.chat-container',
        on: 'center'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'chat-input',
      title: 'Message Box',
      text: 'You can type your queries here to chat with the AI assistant and press Enter to send or click the Send button.',
      attachTo: {
        element: '.chat-input',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'sidebar',
      title: 'Chats',
      text: 'This is where you will find all your chats with the AI assistant.',
      attachTo: {
        element: '.sidebar',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'profile',
      title: 'Profile Section',
      text: 'A profile section where you can see your account details and adjust settings. Logout and theme controls live in the top-right header.',
      attachTo: {
        element: '.profile',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Finish',
          action: tour.complete
        }
      ]
    });

    tour.on('complete', closeTour);
    tour.on('cancel', closeTour);
    tour.start();

    // Cleanup on unmount
    return () => {
      isCleaningUp = true;
      tour.cancel();
    };
  }, [isOpen, isDark, onClose]);

  return null;
};

export default TourGuide;
