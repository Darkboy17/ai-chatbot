import 'shepherd.js/dist/css/shepherd.css';
import React, { useEffect } from 'react';
import Shepherd from 'shepherd.js';


const TourGuide = ({ isOpen }) => {

  
  useEffect(() => {
    if (!isOpen) return;

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true
        },
        classes: 'shadow-md bg-purple-dark',
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
          action: tour.back
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
          action: tour.back
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
          action: tour.back
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
          action: tour.back
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
      text: 'A profile section where you can see your profile details and also logout of the application.',
      attachTo: {
        element: '.profile',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Finish',
          action: tour.complete
        }
      ]
    });

    tour.start();

    // Cleanup on unmount
    return () => {
      tour.cancel();
    };
  }, [isOpen]);

  return null;
};

export default TourGuide;