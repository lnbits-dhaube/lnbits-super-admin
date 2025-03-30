import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api-services/api-services";

const ChangePin = () => {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validatePin = (): boolean => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 characters");
      return false;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePin()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/users/${id}/pin`, { pin });

      toast({
        title: "Success",
        description: "PIN updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update PIN",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate(`/users/${id}`)}
          >
            Back to User Details
          </Button>
          <Text fontSize="2xl" fontWeight="bold">
            Change PIN
          </Text>
        </HStack>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={6}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>New PIN</FormLabel>
              <Input
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
              />
              {error && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {error}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Confirm PIN</FormLabel>
              <Input
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm 4-digit PIN"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isSubmitting}
            >
              Update PIN
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ChangePin;
