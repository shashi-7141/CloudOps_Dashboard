# ☁️ CloudOps Dashboard

A modern cloud infrastructure management dashboard built using **React.js**, designed to simulate real-time cloud resource monitoring, management, and cost tracking.

This project allows users to create, manage, monitor, and analyze cloud resources such as servers and databases through an interactive dashboard interface.

---

## 🚀 Features

### Dashboard Analytics
![Dashboard Overview](./cloudops/src/assets/Dashboard1.png)
- Real-time resource usage monitoring
- CPU usage tracking
- Cost forecasting chart
- Cost breakdown analytics
- Quick insights section
- Infrastructure health monitoring
- Region distribution tracking
- Activity logs

---

### Resource Management
![Resource List](./cloudops/src/assets/ResourceList.png)
- Add new cloud resources
- Create server instances
- Create database resources
- Edit existing resources
- Delete resources
- Start/Stop resources
- Search resources
- Filter by resource type
- Filter by status

---

### Resource Details
![Resource Details](./cloudops/src/assets/ResourceDetails.png)
- View detailed information of each resource
- Live CPU metrics
- Memory metrics
- Network metrics
- Resource health tracking
- Monthly cost information
- Resource status details

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS / Custom CSS

### Libraries Used
- Recharts → Data visualization
- Lucide React → Icons
- React Router DOM → Routing


## 📸 Project Screenshots

### 1. Dashboard Overview
Shows resource analytics, live monitoring, and system overview.

![Dashboard Overview](./cloudops/src/assets/Dashboard1.png)

---

### 2. Cost Analytics Dashboard
Displays cost forecasting and resource cost breakdown.

![Cost Dashboard](./cloudops/src/assets/Dashboard2.png)

---

### 3. Infrastructure Health
Shows region distribution, health monitoring, and activity logs.

![Infrastructure](./cloudops/src/assets/Infra.png)

---

### 4. Create Database
Create new database resources.

![Create Database](./cloudops/src/assets/CreatingDB.png)

---

### 5. Create Server
Launch new server resources.

![Create Server](./cloudops/src/assets/creatingServer.png)

---

### 6. Resource List
Displays all available resources.

![Resource List](./cloudops/src/assets/ResourceList.png)

---

### 7. Edit Resource
Update resource details.

![Edit Resource](./cloudops/src/assets/EditResource.png)

---

### 8. Resource Details
Detailed monitoring page for each resource.

![Resource Details](./cloudops/src/assets/ResourceDetails.png)

## 📂 Project Structure

```cloudops/
│
├── public/
│
├── src/
│
│   ├── components/
│   │
│   │   ├── dashboard/
│   │   │
│   │   │   ├── StatsCards.jsx
│   │   │   ├── UsageChart.jsx
│   │   │   ├── CostChart.jsx
│   │   │   ├── RegionChart.jsx
│   │   │   ├── CostForecastChart.jsx
│   │   │   ├── HealthChart.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── ActivityLogs.jsx
│   │
│   │   ├── layout/
│   │   │
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │
│   │   └── resources/
│   │
│   │       ├── ResourceCard.jsx
│   │       ├── ResourceList.jsx
│   │       ├── ResourceForm.jsx
│   │       └── ResourceActivity.jsx
│
│
│   ├── pages/
│   │
│   │   ├── Dashboard.jsx
│   │   ├── Resources.jsx
│   │   └── ResourceDetails.jsx
│
│
│   ├── context/
│   │
│   │   ├── ResourceContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── LogContext.jsx
│
│
│   ├── services/
│   │
│   │   └── api.js
│
│
│   ├── data/
│   │
│   │   └── resourceMetrics.js
│
│
│   ├── utils/
│   │
│   │   └── generateMetrics.js
│
│
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
│
├── package.json
├── vite.config.js
└── README.md
```


## 🤝 Contributing

Thank you for your interest in contributing to **CloudOps Dashboard**.

We welcome contributions that help improve the project, fix bugs, enhance UI/UX, or introduce new features.

### Steps to Contribute

#### 1. Fork the Repository
Click the **Fork** button on the top-right corner of this repository.

#### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/CloudOps_Dashboard.git

3. Navigate to Project Directory
cd CloudOps_Dashboard
4. Create a New Branch
git checkout -b feature/your-feature-name
5. Install Dependencies
npm install
6. Make Your Changes

Add your improvements, bug fixes, or new features.

7. Commit Changes
git add .
git commit -m "Added new feature"
8. Push Changes
git push origin feature/your-feature-name
