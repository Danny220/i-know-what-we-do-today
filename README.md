# I Know What We'll Do Today

A full-stack web application designed to help groups of friends organize their outings through a collaborative polling system.

![App Screenshot](https://i.imgur.com/BbcwTKO.png)

---

## Live Demo

[**https://i-know-what-we-do-today.vercel.app/**](https://i-know-what-we-do-today.vercel.app/)

## Features

- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Group Management:** Users can create new groups and join existing ones via unique invite links.
- **Collaborative Planning:** Propose new events within a group using a poll system.
- **Democratic Decisions:** Group members can vote on their preferred options for an event's time, location, and activity.
- **Event Finalization:** Finalize a poll based on the winning votes to create an official event.
- **Shared Calendar:** View a list of all finalized events for a group, sorted by date.
- **Modern UI:** A clean, responsive, dark-themed interface built with Tailwind CSS.

## Tech Stack

This project is a full-stack application built with a modern technology stack.

#### **Frontend:**
- **Framework:** React (with Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **HTTP Client:** Axios

#### **Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT & bcrypt for password hashing
- **Database Client:** `node-postgres` (pg)

#### **Database & Deployment:**
- **Database:** PostgreSQL (hosted on Neon)
- **Backend Hosting:** Render
- **Frontend Hosting:** Vercel

---

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js (LTS version recommended)
- A running PostgreSQL instance (you can use the Docker setup from this project)
- `npm` (comes with Node.js)

### Local Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Setup the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install NPM packages
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in your local database credentials and a `JWT_SECRET`.

3.  **Setup the Frontend:**
    ```sh
    # Navigate to the frontend directory (from the root)
    cd frontend

    # Install NPM packages
    npm install
    ```
    Create a `.env` file in the `frontend` directory and add the following line to point to your local backend server:
    ```env
    VITE_API_BASE_URL=http://localhost:3001/api
    ```

4.  **Setup the Database:**
    - Make sure your PostgreSQL server is running.
    - Connect to your database using a client like DBeaver or `psql`.
    - Run all the `CREATE TABLE` scripts from the project to set up the database schema.

5.  **Run the Application:**
    - **Start the Backend Server:** In a terminal window (inside the `backend` directory):
      ```sh
      npm run dev
      ```
    - **Start the Frontend Server:** In a *separate* terminal window (inside the `frontend` directory):
      ```sh
      npm run dev
      ```
    The application should now be running locally, with the frontend accessible at `http://localhost:5173`.

---

## License

Distributed under the MIT License.
