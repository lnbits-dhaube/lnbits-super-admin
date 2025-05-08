import { useState, useEffect } from "react";
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
  Skeleton,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api-services/api-services";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  pin?: string;
}

interface FormData {
  username: string;
  email: string;
  phone: string;
  pin: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  pin?: string;
}

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    pin: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get<User>(`/users/${id}`);
        const user = response.data;
        setFormData({
          username: user.username,
          email: user.email,
          phone: user.phone,
          pin: user.pin || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, toast]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "username":
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 100)
          return "Username must be less than 100 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "phone":
        if (value.length < 5)
          return "Phone number must be at least 5 characters";
        if (value.length > 30)
          return "Phone number must be less than 30 characters";
        break;
      case "pin":
        if (value && value.length !== 4)
          return "PIN must be exactly 4 characters";
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the form errors",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<FormData> = { ...formData };
      // Only include pin in payload if it's not empty
      if (!payload.pin) {
        delete payload.pin;
      }

      await api.put(`/users/${id}`, payload);

      toast({
        title: "Success",
        description: "User updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
              Edit User
            </Text>
          </HStack>
          <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
            <VStack spacing={4}>
              {[...Array(5)].map((_, index) => (
                <FormControl key={index}>
                  <Skeleton height="20px" width="100px" mb={2} />
                  <Skeleton height="40px" width="100%" />
                </FormControl>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

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
            Edit User
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
            <FormControl isRequired isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                isDisabled={isLoading}
              />
              {errors.username && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.username}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                isDisabled={isLoading}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.email}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.phone}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                isDisabled={isLoading}
              />
              {errors.phone && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.pin}>
              <FormLabel>PIN (Optional)</FormLabel>
              <Input
                name="pin"
                type="password"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter PIN (optional)"
                isDisabled={isLoading}
              />
              {errors.pin && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.pin}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isSubmitting}
              isDisabled={isLoading}
            >
              Update User
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default EditUser;
