import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonGroup,
  Divider,
  useToast,
  Skeleton,
  Card,
  CardBody,
  IconButton,
  Alert,
  AlertIcon,
  Center,
  Icon,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";
import api from "../api-services/api-services";

interface WalletInfo {
  balance: string;
  btc_balance: string;
}

interface Transaction {
  memo: string;
  date: string;
  amount: number;
  color: string;
}

type FilterType = "all" | "deposit" | "withdraw";

const ITEMS_PER_PAGE = 30;

const UserTransactions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        api.get<WalletInfo>(`/wallet/${id}`),
        api.get<Transaction[]>(`/payment-list/${id}`),
      ]);

      setWalletInfo(walletResponse.data);
      setAllTransactions(transactionsResponse.data);
    } catch (error) {
      const errorMessage =
        "Failed to fetch transaction data. Please try again later.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, toast]);

  // Apply filters first
  const filteredTransactions = allTransactions.filter((transaction) => {
    switch (filter) {
      case "deposit":
        return transaction.amount > 0;
      case "withdraw":
        return transaction.amount < 0;
      default:
        return true;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const renderTransactionList = () => {
    if (isLoading) {
      return (
        <VStack spacing={4} align="stretch">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Skeleton height="20px" width="150px" />
                    <Skeleton height="16px" width="100px" />
                  </VStack>
                  <Skeleton height="20px" width="80px" />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      );
    }

    if (error) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      );
    }

    if (filteredTransactions.length === 0) {
      return (
        <Card>
          <CardBody>
            <Center py={8}>
              <VStack spacing={3}>
                <Icon as={FiInbox} boxSize={8} color="gray.400" />
                <Text color="gray.500" textAlign="center">
                  {filter === "all"
                    ? "No transactions found"
                    : `No ${filter} transactions found`}
                </Text>
                {filter !== "all" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => setFilter("all")}
                  >
                    View all transactions
                  </Button>
                )}
              </VStack>
            </Center>
          </CardBody>
        </Card>
      );
    }

    return (
      <VStack spacing={2} align="stretch">
        {currentTransactions.map((transaction, index) => (
          <Card key={index}>
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">{transaction.memo}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {transaction.date}
                  </Text>
                </VStack>
                <Text
                  fontWeight="bold"
                  color={transaction.amount > 0 ? "green.500" : "red.500"}
                >
                  ${transaction.amount.toFixed(3)}
                </Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate(`/users/${id}`)}
          >
            Back to User Details
          </Button>
          <Button
            leftIcon={<FiRefreshCw />}
            variant="ghost"
            onClick={fetchData}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </HStack>

        <Card bg="green.500" color="white">
          <CardBody>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                  ${walletInfo?.balance ?? "0.00"}
                </Text>
                <Text fontSize="sm">
                  ₿{walletInfo?.btc_balance ?? "0.00000000"}
                </Text>
              </HStack>
              <Text fontSize="sm">Available Balance</Text>
            </VStack>
          </CardBody>
        </Card>

        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              Recent Transactions
            </Text>
            {!isLoading && !error && filteredTransactions.length > 0 && (
              <Text fontSize="sm" color="gray.500">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredTransactions.length)} of{" "}
                {filteredTransactions.length}
              </Text>
            )}
          </HStack>

          <ButtonGroup isAttached variant="outline" size="sm">
            <Button
              isActive={filter === "all"}
              onClick={() => setFilter("all")}
              colorScheme={filter === "all" ? "green" : undefined}
            >
              All
            </Button>
            <Button
              isActive={filter === "withdraw"}
              onClick={() => setFilter("withdraw")}
              colorScheme={filter === "withdraw" ? "green" : undefined}
            >
              Withdraw
            </Button>
            <Button
              isActive={filter === "deposit"}
              onClick={() => setFilter("deposit")}
              colorScheme={filter === "deposit" ? "green" : undefined}
            >
              Deposit
            </Button>
          </ButtonGroup>

          {renderTransactionList()}

          {/* Pagination Controls */}
          {!isLoading && !error && totalPages > 1 && (
            <HStack justify="center" spacing={4} pt={4}>
              <IconButton
                aria-label="Previous page"
                icon={<FiChevronLeft />}
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1}
                size="sm"
              />
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton
                aria-label="Next page"
                icon={<FiChevronRight />}
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                size="sm"
              />
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default UserTransactions;
