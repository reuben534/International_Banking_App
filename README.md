# Banking Application

This is a full-stack banking application built using the MERN (MongoDB, Express.js, React, Node.js) stack.

## Features

- User Registration and Authentication
- Secure Login (with HttpOnly Cookies)
- Payment Processing
- Transaction History
- User Management (Admin/Employee roles - if implemented)

## Technologies Used

### Frontend (Client)
- React.js
- React Router DOM
- Axios (for API requests)
- React-Bootstrap (for UI components)

### Backend (Server)
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JSON Web Tokens (JWT) for authentication
- bcryptjs (for password hashing)
- dotenv (for environment variables)

## Security Enhancements

This application has been hardened against common web vulnerabilities:
- **Strict CORS Policy:** Configured to allow specific origins.
- **Security Headers:** Implemented using `helmet` middleware.
- **Input Whitelisting:** All user inputs are validated and whitelisted on the server-side using `express-validator` with strict RegEx patterns to prevent malicious data from entering the system.
- **Password Hashing:** User passwords are not stored in plaintext. They are salted and hashed using `bcryptjs` before being saved to the database.
- **Secure JWT Handling:** Tokens are sent via HttpOnly, secure, and same-site cookies.
- **Rate Limiting:** Applied to all API routes and specifically to login attempts to prevent brute-force attacks.

## Setup Instructions

Follow these steps to set up and run the application locally.

### 1. Clone the repository

```bash
git clone <repository_url>
cd Banking_App
```

### 2. Backend Setup (Server)

Navigate to the `server` directory, install dependencies, and set up environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Generating SSL Certificates
The server runs on HTTPS, which requires an SSL certificate. For local development, you can generate a self-signed certificate using OpenSSL.

Run the following command in the `server` directory:
```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```
This will create `key.pem` and `cert.pem` files. These files are included in the `.gitignore` and should not be committed to version control.

#### Seeding the Database

To populate the database with initial data (e.g., employee accounts), you can use the seeder script.

To import data, run:
```bash
npm run data:import
```

To destroy all data in the database, run:
```bash
npm run data:destroy
```

### 3. Frontend Setup (Client)

Navigate to the `client` directory and install dependencies.

```bash
cd ../client
npm install
```

## Running the Application

### 1. Start the Backend Server

Navigate to the `server` directory and run the development server using nodemon:

```bash
cd server
npm run server
```

The server will run on `https://localhost:5000` (or the port specified in your `.env` file).

### 2. Start the Frontend Development Server

Navigate to the `client` directory and start the React development server:

```bash
cd ../client
npm start
```

The frontend application will open in your browser, usually at `http://localhost:3000`.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the ISC License.