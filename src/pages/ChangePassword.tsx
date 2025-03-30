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

const ChangePassword = () => {
  const { id } = useParams<{ id: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validatePassword = (): boolean => {
    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      return false;
    }
    if (password.length > 100) {
      setError("Password must be less than 100 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/users/${id}/password`, { password });

      toast({
        title: "Success",
        description: "Password updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
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
            Change Password
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
              <FormLabel>New Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              {error && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {error}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isSubmitting}
            >
              Update Password
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ChangePassword;
