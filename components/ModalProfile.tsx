import { User } from "@/types";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: User;
}

const ModalProfile = ({ visible, onClose, data }: Props) => {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalProfile;
