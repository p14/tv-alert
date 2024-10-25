# TV Alert (Series Tracking App)

TV Alert is a web application that allows users to request email access, search through TV series, and subscribe to their favorite shows. Users receive notifications about upcoming premieres directly in their inbox.

This project started as a way to learn / reinforce different technologies and paradigms while also having a minor real-world benefit. The project name is lackluster, but the passion behind it is there. This project is open for contributions and suggestions.

## Features

- Request access via email instead of traditional login.
- Search and browse TV series.
- Subscribe to follow favorite series.
- Daily email notifications for series premiering that day.

## Technologies

- **MERN Stack**: MongoDB, Express.js, React, Node.js
- **TypeScript**: Strongly typed language for better code quality.
- **Inversify**: Inverse of Control container to manage dependencies.

## Requirements

- NodeJS (v20.8.0+ preferred)
- MongoDB server
- Email account (Dedicated for this application with SMTP configuration preferred)
- TVDB API access key

## Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/p14/tv-alert.git
    cd tv-alert
    ```
   
2. **Install dependencies**:

    ```bash
    # For the server
    cd server
    npm install
    ```

    ```bash
    # For the client
    cd client
    npm install
    ```

3. **Set environment variables**:

    - Create a `.env` file in the server directory and configure your database and email service credentials. Use the `.env.example` file in the server directory as a guide.
    - Create a `.env` file in the client directory to store necessary environment variables. Use the `.env.example` file in the client directory as a guide.

4. **Run the application**:

    ```bash
    # For the server
    cd server
    npm run start
    ```

    ```bash
    # For the client
    cd client
    npm run start
    ```

5. **Access the application**:

    - Navigate to `http://localhost:3000` to access the application.
