1. Project Overview

A simple User Management System built with:

.Frontend: Angular 21 + PrimeNG

.Backend: Python FastAPI

.Features:
 .Add, Edit, Delete, View users
 .Paginated user table
 .Dialog for user operations
 .Dynamic header with logout

2.Project Structure

Backend (backend/)
backend/
├── venv/                  # Python virtual environment
├── main.py                # FastAPI entry point
├── models.py              # Pydantic models (User, etc.)
├── crud.py                # CRUD operations
├── database.py            # Database connection (SQLite/PostgreSQL)
├── requirements.txt       # Python dependencies
└── README.md

Backend Setup:

cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# or source venv/bin/activate  # Mac/Linux

pip install fastapi uvicorn
pip install "pydantic[email]" email-validator

uvicorn main:app --reload

Test API:
Open http://127.0.0.1:8000/docs

Frontend (frontend/)
ng new UserManagementSystem --standalone false --no-standalone
ng g m module --routing (to generate module and routing)
ng g c componentname(for component creation)
ng g s servicename(for service creation)

frontend/
├── src/
│   ├── app/
│   │   ├── features/
|   |   |   |__auth
│   │   │   |   ├── login/
│   │   │   |   |   ├── login.html
│   │   │   |   |   ├── login.ts
│   │   │   |   |   └── login.css
│   │   │   |   ├── register/
│   │   │   |   |   ├── register.html
│   │   │   |   |   ├── register.ts
│   │   │   |   |   └── register.css
|   |   |   |   |__auth-module.ts
|   |   |   |   |__auth-routing-module.ts
│   │   │   |── user-list/
│   │   │   |   ├── user-list.html
│   │   │   |   ├── user-list.ts
│   │   │   |   └── user-list.css
|   |   |   |user-module.ts
|   |   |   |user-routing-module.ts
│   │   ├── core/
|   |   |   |guards/
|   |   |      |__ auth-guard.ts
|   |   |   |interceptors/
|   |   |      |__ token-interceptor.ts
|   |   |   |__services/
|   |   |      |__ auth.service.ts
|   |   |      |__ user.service.ts
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   └── app.css
│   │   └── app.html
│   │   └── app.ts
├── package.json
└── angular.json

Frontend Setup:
cd frontend
npm install
ng serve --open

App will open at http://localhost:4200/

Architecture Explanation

 .Frontend: Angular 21 + PrimeNG for UI

  .Components: UserList

  .Service: UserService to communicate with backend

 .Backend: FastAPI + Pydantic

  .main.py defines API endpoints

  .models.py defines User schema

  .crud.py handles database operations

  .database.py manages DB connection

Flow: Frontend → UserService → Backend API → Database → Returns response

Postman Collection
 .GET /users → Fetch all users

 .POST /users → Add user

 .PUT /users/{id} → Edit user

 .DELETE /users/{id} → Delete user

Github Link: https://github.com/Manikanta-Kummarapurugu/UserManagement-Assessment.git

