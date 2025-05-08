import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  useColorModeValue,
  useToast,
  Skeleton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiTrash2,
  FiEdit2,
  FiLock,
  FiKey,
  FiCreditCard,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import api from "../api-services/api-services";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  walletId: string;
  apiKey: string;
  identificationId: string;
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get<User>(`/users/${id}`);
        setUser(response.data);
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${id}`);
      toast({
        title: "Success",
        description: "User deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
            {isLoading ? (
              <Skeleton height="36px" width="200px" />
            ) : (
              <Text fontSize="2xl" fontWeight="bold">
                User Details
              </Text>
            )}
          </HStack>
        </HStack>

        {!isLoading && user && (
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} justify="flex-end">
              <Button
                leftIcon={<FiKey />}
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate(`/users/${user.id}/pin`)}
              >
                Change PIN
              </Button>
              <Button
                leftIcon={<FiLock />}
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate(`/users/${user.id}/password`)}
              >
                Change Password
              </Button>
              <Button
                leftIcon={<FiEdit2 />}
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate(`/users/${user.id}/edit`)}
              >
                Edit User
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete User
              </Button>
            </HStack>
            <HStack justify="flex-end">
              <Button
                leftIcon={<FiCreditCard />}
                colorScheme="green"
                variant="solid"
                onClick={() => navigate(`/users/${user.id}/transactions`)}
              >
                View Transactions
              </Button>
            </HStack>
          </VStack>
        )}

        <Box
          p={6}
          borderWidth={1}
          borderRadius="lg"
          bg={useColorModeValue("white", "gray.800")}
        >
          {isLoading ? (
            <VStack spacing={4} align="stretch">
              {/* Username */}
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="20px" width="200px" />
                </HStack>
                <Skeleton height="1px" />

                {/* Email */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="80px" />
                  <Skeleton height="20px" width="220px" />
                </HStack>
                <Skeleton height="1px" />

                {/* Phone */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="90px" />
                  <Skeleton height="20px" width="150px" />
                </HStack>
                <Skeleton height="1px" />

                {/* Role */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="70px" />
                  <Skeleton height="20px" width="100px" />
                </HStack>
                <Skeleton height="1px" />

                {/* Wallet ID */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="110px" />
                  <Skeleton height="20px" width="250px" />
                </HStack>
                <Skeleton height="1px" />

                {/* API Key */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="20px" width="250px" />
                </HStack>
                <Skeleton height="1px" />

                {/* Identification ID */}
                <HStack justify="space-between">
                  <Skeleton height="20px" width="120px" />
                  <Skeleton height="20px" width="250px" />
                </HStack>
              </VStack>
            </VStack>
          ) : user ? (
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Username:</Text>
                <Text>{user.username}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Email:</Text>
                <Text>{user.email}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Phone:</Text>
                <Text>{user.phone}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Role:</Text>
                <Text>{user.role}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Identification ID:</Text>
                <Text>{user.identificationId}</Text>
              </HStack>
            </VStack>
          ) : (
            <Text color="red.500">User not found</Text>
          )}
        </Box>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete User
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  ml={3}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};

export default UserDetails;
