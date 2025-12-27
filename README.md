Blog Application – Spring Boot & React
📌 Overview

This is a full-stack Blog Application developed using Spring Boot for backend REST APIs and React (Vite) for the frontend user interface.
The application follows a client–server architecture, enabling secure and scalable content management through RESTful communication.

This project demonstrates real-world full-stack development, backend security, and frontend–backend integration.

🚀 Tech Stack
Backend

Java

Spring Boot

Spring MVC

Spring Security

Spring Data JPA (Hibernate)

REST APIs

Maven

Apache Tomcat

Frontend

React (Vite)

JavaScript (ES6+)

HTML5

CSS3

Database

MySQL

🧱 Project Architecture
React Frontend
     |
     | HTTP (JSON)
     v
Spring Boot REST APIs
     |
Service Layer
     |
Repository Layer (JPA/Hibernate)
     |
MySQL Database


The backend follows a layered architecture:

Controller Layer

Service Layer

Repository Layer

This ensures separation of concerns, maintainability, and scalability.

🔐 Security Implementation

Integrated Spring Security for authentication

Form-based login mechanism

Role-based access control

Secured REST endpoints

Password handling using encryption best practices

✨ Key Features
Backend Features

RESTful API design

CRUD operations for blog and user management

Secure endpoints using Spring Security

Exception handling and validation

JSON-based request and response handling

Frontend Features

Component-based React architecture

Responsive UI design

Dynamic data rendering from backend APIs

Reusable components for navigation and layout

Loader components for better user experience

🔄 Application Flow

User accesses the React frontend

React sends HTTP requests to Spring Boot APIs

Spring Boot processes requests and interacts with the database

JSON responses are returned to the frontend

React dynamically updates the UI

▶️ How to Run the Project
Backend (Spring Boot)

Clone the repository

git clone https://github.com/Manjunath1063/Blog-Application-Spring-Boot-React.git


Open the backend project in your IDE

Configure application.properties with MySQL credentials

Run the Spring Boot application

Backend runs at:

http://localhost:8085

Frontend (React)

Navigate to the React application directory

Install dependencies:

npm install


Start the frontend:

npm run dev

📌 Key Learning Outcomes

Full-stack application development

REST API design and consumption

Spring Boot layered architecture

Spring Security fundamentals

React component-based UI development

Frontend–backend integration using JSON

👨‍💻 Author

U. Manjunath
Java Backend / Full Stack Java Developer

GitHub: https://github.com/Manjunath1063

LinkedIn: https://www.linkedin.com/in/u-manjunath-9ab513288/

⭐ Recruiter Note

This project demonstrates hands-on experience with Java, Spring Boot, REST APIs, Spring Security, and React, aligned with industry-standard backend and full-stack development practices.
