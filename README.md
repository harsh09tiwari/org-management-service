
## 🚀 Instructions to Run the Application

Follow these steps to get the server running on your local machine.

### 1. Requirements
Make sure you have these installed on your computer:
* **Node.js** (v14 or higher)
* **MongoDB** (Running locally or have a Cloud URI ready)
* **Git** (To clone the code)

### 2. Clone the Repository
Open your terminal and run this command to download the code:
```bash
git clone https://github.com/harsh09tiwari/org-management-service.git
cd org-management-service
```

### 3\. Install Dependencies

```bash
npm install bcrypt, dotenv, express, jsonwebtoken, mongoose
```

### 4\. Setup Environment Variables

Create a new file named `.env` in the root folder (the main folder). Open it and paste the following configuration:
```env
# Server Port
PORT=5000
# Database Connection (If running MongoDB locally)
MONGO_URI=mongodb://localhost:27017/org_management_db
# Security Key for Login Tokens (You can type any random string here)
JWT_SECRET=add_your_secure_secret_key 
```

### 5\. Start the Server

Run development server cmd on your local machine:
```bash
npm run dev
```
If successful, you will see a message in the terminal:

> `Server is running on port: 5000`
> `MongoDB Connected`
