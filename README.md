
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



## 🏗️ High-Level Architecture

The system uses a **Collection-Based Multi-Tenancy** approach. Every organization gets its own dedicated collection (e.g., `org_company_a`, `org_company_b`) to ensure strict data isolation.
```mermaid
graph TD
    %% Nodes
    User[Client / Postman]
    API[Express API Server]
    Auth{Is Logged In?}
    Router{Route Handler}
    
    %% Databases
    AdminDB[(Admin Collection)]
    MasterDB[(Organization List)]
    
    %% Dynamic Collections
    Switch{Which Company?}
    CollA[(Collection: org_company_a)]
    CollB[(Collection: org_company_b)]
    
    %% Connections
    User -->|1. Request| API
    API -->|2. Verify Token| Auth
    
    Auth -->|No| Error[Error: 401 Unauthorized]
    Auth -->|Yes| Router
    
    Router -->|Login| AdminDB
    Router -->|Get Info| MasterDB
    
    Router -->|3. Create / Update / Delete| Switch{Which Company?}
    Switch -->|Company A| CollA
    Switch -->|Company B| CollB
