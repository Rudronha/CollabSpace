# Collaboration Platform

## Project Overview
Updated with rooms features 
This project is a collaboration platform that allows users to share code, communicate via voice calls, and send messages. It is built with a modern tech stack including React for the frontend, Express.js for the backend, and WebRTC for real-time communication.

## Features
- **Code Sharing**: Users can write, edit, and share code in real-time.
- **Voice Calls**: Users can initiate and receive voice calls.
- **Messaging**: Users can send and receive text messages.
- **Real-time Updates**: Leveraging WebRTC and WebSockets for real-time communication and updates.

## Tech Stack
- **Frontend**: React
- **Backend**: Express.js
- **Real-time Communication**: WebRTC, Socket.IO
- **Database**: MySQL managed with Sequelize

## Installation
To run this project locally, follow these steps:

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/collaboration-platform.git
    cd collaboration-platform
    ```

2. Set up environment variables:
    Create a `.env` file in the root of your project with the following content:
    ```env
    PORT=5000
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_NAME=your_db_name
    REACT_APP_VOICE_API_URL=your_voice_api_url
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the server:
    ```bash
    npm start
    ```

### Frontend
1. Navigate to the `front` directory:
    ```bash
    cd front
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React app:
    ```bash
    npm start
    ```

## Usage
1. Open your browser and navigate to `http://localhost:3000` for the frontend.
2. Use the application to share code, initiate voice calls, and send messages.

## Contributing
If you would like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact
For any questions or suggestions, feel free to open an issue or contact the project maintainer at your-email@example.com.