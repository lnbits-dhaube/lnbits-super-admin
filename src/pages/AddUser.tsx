import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

interface Role {
  id: number;
  name: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  pin?: string;
  password?: string;
  walletId?: string;
  apiKey?: string;
}

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    pin: "",
    password: "",
    walletId: "",
    apiKey: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [adminRoleId, setAdminRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get<Role[]>("/roles");
        const adminRole = response.data.find((role) => role.name === "ADMIN");
        if (adminRole) {
          setAdminRoleId(adminRole.id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch roles",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchRoles();
  }, [toast]);

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
        if (value.length !== 4) return "PIN must be exactly 4 characters";
        break;
      case "password":
        if (value.length < 5) return "Password must be at least 5 characters";
        if (value.length > 100)
          return "Password must be less than 100 characters";
        break;
      case "walletId":
        if (value.length < 10)
          return "Wallet ID must be at least 10 characters";
        if (value.length > 50)
          return "Wallet ID must be less than 50 characters";
        break;
      case "apiKey":
        if (value.length < 10) return "API Key must be at least 10 characters";
        if (value.length > 50) return "API Key must be less than 50 characters";
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
    if (!adminRoleId) {
      toast({
        title: "Error",
        description: "Role ID not found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

    setIsLoading(true);
    try {
      await api.post("/users", {
        ...formData,
        roleId: adminRoleId,
      });

      toast({
        title: "Success",
        description: "User added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Text fontSize="2xl" fontWeight="bold">
            Add New User
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
              />
              {errors.phone && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.pin}>
              <FormLabel>PIN</FormLabel>
              <Input
                name="pin"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter PIN"
              />
              {errors.pin && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.pin}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.password}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.walletId}>
              <FormLabel>Wallet ID</FormLabel>
              <Input
                name="walletId"
                value={formData.walletId}
                onChange={handleChange}
                placeholder="Enter wallet ID"
              />
              {errors.walletId && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.walletId}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.apiKey}>
              <FormLabel>API Key</FormLabel>
              <Input
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="Enter API Key"
              />
              {errors.apiKey && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.apiKey}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isLoading}
            >
              Add User
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AddUser;
