import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLogOut, FiPlus, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../api-services/api-services";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  walletId: string | null;
  apiKey: string | null;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>("/users");
        setUsers(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar - Updated with position sticky */}
      <Box
        w="250px"
        bg={useColorModeValue("gray.50", "gray.900")}
        p={4}
        borderRight="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        position="sticky"
        top={0}
        h="100vh"
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold" p={4}>
            Admin Panel
          </Text>
          <Button
            leftIcon={<Icon as={FiUsers} />}
            variant="ghost"
            justifyContent="flex-start"
            onClick={() => navigate("/dashboard")}
            isActive
          >
            User Management
          </Button>
          <Button
            leftIcon={<Icon as={FiLogOut} />}
            variant="ghost"
            justifyContent="flex-start"
            onClick={handleLogout}
            colorScheme="red"
          >
            Logout
          </Button>
        </VStack>
      </Box>

      {/* Main Content - Updated with overflow auto */}
      <Box flex="1" p={8} w="full" overflowY="auto" h="100vh">
        <VStack spacing={6} align="stretch" w="full">
          <HStack justify="space-between">
            <Text fontSize="2xl" fontWeight="bold">
              User Management
            </Text>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              onClick={() => navigate("/users/add")}
            >
              Add New User
            </Button>
          </HStack>

          <Box>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Box overflowY="auto" w="full">
            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[...Array(6)].map((_, index) => (
                  <Box
                    key={index}
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg="white"
                  >
                    <VStack spacing={4} align="stretch">
                      <Skeleton height="24px" width="70%" />
                      <Skeleton height="20px" width="100%" />
                      <Skeleton height="20px" width="80%" />
                      <Skeleton height="20px" width="60%" />
                      <Skeleton height="20px" width="90%" />
                      <Skeleton height="32px" width="100%" />
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredUsers.map((user) => (
                  <Box
                    key={user.email}
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg="white"
                    _hover={{
                      shadow: "md",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          {user.username}
                        </Text>
                      </HStack>

                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text fontWeight="medium" color="gray.500">
                            Email:
                          </Text>
                          <Text>{user.email}</Text>
                        </HStack>

                        <HStack>
                          <Text fontWeight="medium" color="gray.500">
                            Phone:
                          </Text>
                          <Text>{user.phone}</Text>
                        </HStack>

                        <HStack>
                          <Text
                            whiteSpace="nowrap"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            Wallet ID:
                          </Text>
                          <Text noOfLines={1}>{user.walletId || "N/A"}</Text>
                        </HStack>

                        <HStack>
                          <Text
                            whiteSpace="nowrap"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            API Key:
                          </Text>
                          <Text noOfLines={1}>{user.apiKey || "N/A"}</Text>
                        </HStack>
                      </VStack>

                      <Button
                        mt={2}
                        width="full"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        View Details
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Dashboard;
