# Product Manager System

This is a Dockerized full-stack application built with Django (backend), React (frontend), and MySQL (database). The system provides authentication, role-based access control, API management, product handling, caching, search indexing, monitoring, and logging.

## Prerequisites

- Docker and Docker Compose

## Technology Stack

- **Backend:** Django (REST API & GraphQL)
- **Frontend:** React with Tailwind CSS
- **Database:** MySQL
- **Caching:** Redis
- **Search Indexing:** Apache Solr
- **Monitoring & Logging:** Prometheus & Grafana
- **Containerization:** Docker & Docker Compose
- **Load Testing:** K6

## Setup Instructions

### 1. Configure Environment Variables

Add the required environment variables in the `.env` file in the project root.

### 2. Start the Application

To start all services, run the following command:

```sh
docker-compose up --build -d
```

This will build and start all required containers.

### 3. Create a Superuser (Admin Access)

Once the containers are running, access the backend container and create a superuser:

```sh
docker exec -it product_manager_backend sh -c "python manage.py createsuperuser"
```

Follow the prompts to set up an admin username and password.

### 4. Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger):** [http://localhost:8000/swagger](http://localhost:8000/swagger)
- **Grafana Dashboard:** [http://localhost:3030](http://localhost:3030)
- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
- **Solr Admin:** [http://localhost:8983](http://localhost:8983)

### 5. Stopping the Application

To stop all containers, run:

```sh
docker-compose down
```
