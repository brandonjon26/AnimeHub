## 🚀 AnimeHub

### 🎯 Overview

**AnimeHub** is a platform designed to track, organize, and manage information about anime, figures, and related merchandise by scraping data from various sources (e.g., AmiAmi, Crunchyroll) and aggregating it into a user-friendly interface.

This project is built using a **Monolith-First** architecture, separating the concerns into distinct project folders for the API, Client, and Scraping services.

### 💻 Tech Stack & Architecture

This project utilizes a modern, performance-focused stack:

| Component | Technology | Version / Key Library | Rationale / Key Feature |
| :--- | :--- | :--- | :--- |
| **Backend API** | ASP.NET Core | **.NET 8 (LTS)** | High-performance, cross-platform backend. |
| **Frontend UI** | React + TypeScript | **Vite** | Component-based, static typing, lightning-fast development server. |
| **Database** | SQL Server | **Entity Framework Core (EF Core)** | Robust, scalable, simplified data access. |
| **Data Scraping** | Python | *TBD (Via Message Queue)* | Dedicated language for web scraping; decoupled integration. |
| **State Management**| Frontend Caching | **TanStack Query (React Query)** | Manages server state, implements **Optimistic Updates**. |
| **Styling** | Isolation | **CSS Modules** | Ensures component-specific styles and avoids global conflicts. |
| **API Client** | HTTP | **Axios** | Used with an **Interceptor** for automatic JWT injection. |

---

### 📂 Repository Structure

The project uses a solution file (`AnimeHub.sln`) to manage distinct project folders, facilitating a clear separation of concerns:

AnimeHub/ ├── AnimeHub.Api/ # ASP.NET Core Backend (Business Logic, API Endpoints) ├── AnimeHub.Client/ # React/Vite Frontend (UI Components, State Management) ├── AnimeHub.Scraper/ # Python service for data ingestion (Decoupled) ├── AnimeHub.UnitTests/ # .NET unit tests (API Business Logic) ├── AnimeHub.IntegrationTests/# .NET/Full-stack flow tests ├── .gitignore # Consolidated ignore file (Backend + Frontend) └── AnimeHub.sln # Primary Solution File

---

### ⚙️ Getting Started

To run the project locally, you will need the **.NET 8 SDK** and **Node.js (LTS)** installed.

#### 1. Setup

Navigate to the project root directory (`AnimeHub/`).

```bash
# 1. Install .NET packages and build the solution
dotnet restore
dotnet build

# 2. Navigate to the frontend client directory
cd AnimeHub.Client

# 3. Install Node dependencies
npm install