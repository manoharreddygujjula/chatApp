import React from 'react';
import { 
  useDisclosure, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter 
} from '@chakra-ui/react'; // Import Chakra UI components
//import { Lorem } from 'react-lorem-component'; // Assuming you're using 'react-lorem-component' for Lorem

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      <span onClick={onOpen}>{ children }</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
