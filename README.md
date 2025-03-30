# LNBits Super Admin Dashboard

A React-based admin dashboard for managing LNBits users and their transactions. Built with TypeScript, React, and Chakra UI.

## Features

- 🔐 **User Authentication**

  - Secure login system
  - Token-based authentication with refresh token support
  - Protected routes for authenticated users

- 👥 **User Management**

  - View all users in a responsive grid layout
  - Search users by username or email
  - Add new users with validation
  - Edit user details
  - Delete users with confirmation
  - Change user PIN and password

- 💰 **Transaction Management**

  - View user transactions with balance information
  - Filter transactions (All/Deposit/Withdraw)
  - Pagination support (30 items per page)
  - Real-time transaction updates

- 🎨 **Modern UI/UX**
  - Responsive design using Chakra UI
  - Loading states and skeletons
  - Error handling and feedback
  - Empty state handling
  - Clean and intuitive interface

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router v6
- **UI Library**: Chakra UI
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather Icons)
- **Build Tool**: Vite

## Project Structure

```
src/
├── api-services/
│   └── api-services.ts      # API client configuration
├── components/
│   └── ProtectedRoute.tsx   # Route protection component
├── context/
│   └── AuthContext.tsx      # Authentication context
├── pages/
│   ├── AddUser.tsx          # Add new user page
│   ├── ChangePassword.tsx   # Change user password page
│   ├── ChangePin.tsx        # Change user PIN page
│   ├── Dashboard.tsx        # Main dashboard page
│   ├── EditUser.tsx         # Edit user details page
│   ├── Login.tsx            # Login page
│   ├── UserDetails.tsx      # User details page
│   └── UserTransactions.tsx # User transactions page
└── main.tsx                 # Application entry point
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd lnbits-super-admin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the API base URL if needed:
     ```
     VITE_API_BASE_URL=http://localhost:3000/api
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

The application expects the following API endpoints:

- **Authentication**

  - POST `/login`: User login
  - POST `/refresh-token`: Refresh access token

- **Users**

  - GET `/users`: List all users
  - GET `/users/:id`: Get user details
  - POST `/users`: Create new user
  - PUT `/users/:id`: Update user details
  - DELETE `/users/:id`: Delete user
  - PUT `/users/:id/password`: Update user password
  - PUT `/users/:id/pin`: Update user PIN

- **Transactions**
  - GET `/wallet/:id`: Get user wallet info
  - GET `/payment-list/:id`: Get user transactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
