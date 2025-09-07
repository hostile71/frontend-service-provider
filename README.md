# Better Dashboard

A modern, scalable React dashboard application for managing service platforms with proper folder structure and component organization.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.js     # Main header with navigation
│   │   ├── Sidebar.js    # Collapsible sidebar
│   │   ├── Layout.js     # Main layout wrapper
│   │   └── index.js      # Layout exports
│   ├── pages/            # Page components
│   │   ├── Dashboard.js  # Main dashboard
│   │   ├── UserManagement.js
│   │   ├── ServiceProviders.js
│   │   ├── ServiceManagement.js
│   │   ├── Categories.js
│   │   ├── BookingManagement.js
│   │   ├── Reports.js
│   │   ├── Settings.js
│   │   └── index.js      # Page exports
│   ├── ui/               # Reusable UI components
│   │   ├── StatusBadge.js
│   │   ├── RatingStars.js
│   │   ├── StatCard.js
│   │   ├── Modal.js
│   │   ├── DataTable.js
│   │   ├── AddItemModal.js
│   │   ├── ProfileSettingsModal.js
│   │   └── index.js      # UI exports
│   └── index.js          # All component exports
├── contexts/             # React contexts
│   ├── LocalizationContext.js  # i18n context
│   ├── AppContext.js     # Global app state
│   └── index.js          # Context exports
├── hooks/                # Custom hooks
│   └── useStats.js       # Statistics calculations
├── utils/                # Utility functions
│   └── helpers.js        # Helper functions
├── data/                 # Mock data and APIs
│   └── mockData.js       # Sample data
├── constants/            # App constants
│   ├── index.js          # General constants
│   └── translations.js   # Translation strings
├── App.js               # Main App component
├── index.js             # React entry point
└── index.css            # Global styles
```

## 🚀 Features

### Core Functionality
- **Multi-language Support**: English and Arabic with proper translation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modular Architecture**: Organized components and clear separation of concerns
- **State Management**: Context-based state management
- **Data Tables**: Sortable, filterable data tables with search
- **Modal System**: Dynamic modals for forms and settings

### Dashboard Features
- **Statistics Overview**: Key metrics and KPIs
- **Recent Activity**: Latest bookings and transactions
- **Charts & Analytics**: Visual data representation
- **Quick Actions**: Easy access to common tasks

## 🛠️ Technology Stack

- **React 19.1.1**: Latest React with concurrent features
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Context API**: State management
- **Custom Hooks**: Reusable logic

## 🌐 Internationalization

The application supports multiple languages:
- English (default)
- Arabic with proper text direction
- Extensible translation system
- Dynamic language switching

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
