Service Provider Admin dashboard SRS
1. Introduction
1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for a React-based Admin Dashboard. This dashboard will serve as the central management interface for a service platform, enabling administrators to oversee users, bookings, services, and platform settings.
1.2 Scope
This SRS details the requirements for the Admin Dashboard component only. It does not cover the requirements for the service platform's user-facing web or mobile applications, the backend API, or the database infrastructure, though it will interact with these systems.
1.3 Definitions, Acronyms, and Abbreviations
API: Application Programming Interface
CRUD: Create, Read, Update, Delete
Dashboard: The main landing page with an overview of key metrics.
Provider: A service provider offering services on the platform.
SRS: Software Requirements Specification
UI: User Interface
2. Overall Description
2.1 Product Perspective
The Admin Dashboard is a standalone web application that integrates with the main platform's backend services via a RESTful API. It acts as the command center for platform administrators, providing a secure, centralized interface for managing all aspects of the service platform.
2.2 Product Functions
The main functions of the dashboard include:
Data Visualization: Displaying key platform metrics through cards and statistics.
User Management: Managing user accounts for customers and other administrators.
Booking Management: Overseeing the lifecycle of all bookings.
Content Management: Adding, editing, and organizing services and categories.
Reporting & Analytics: Providing detailed reports on platform performance.
System Settings: Configuring general platform settings and security.

2.3 User Characteristics
The primary users of this system are platform administrators. They are expected to be familiar with web-based applications and data management tools.
2.4 Constraints
Technology Stack: The frontend will be developed using React.js.
API: The dashboard will consume a pre-defined RESTful API.
Localization: The system should support English & Arabic languages.
Security: All administrative actions require proper authentication.

3. System Requirements
3.1 Functional Requirements (FR)
FR-1: Dashboard
FR-1.1: The system shall display a dashboard with dynamic statistical cards for Total Users, Total Providers, Pending Bookings, Completed Bookings, and Reject Bookings and Active Services.
FR-1.2: The dashboard shall display three Recent Bookings, top three Services.
FR-1.3: The dashboard shall display a feed of the latest activities, including new user sign-ups, new provider registrations, and new bookings.
FR-1.4: The dashboard shall update all displayed data upon manual refresh by the admin.
FR-2: User Management
FR-2.1: The system shall provide a paginated data table of all users, displaying Name, Email, Role, Status, and Actions.
FR-2.2: The system shall provide a search bar to filter the user list by Name or Email.
FR-2.3: The system shall provide filters to sort the user list by Role and Status.
FR-2.4: The system shall provide a form to create a new user with fields for Name, Email, Password, and Role.
FR-2.5: The system shall allow an admin to edit an existing user's details (excluding email) and change their role or status.
FR-2.6: The system shall provide an option to deactivate a user, which changes their status to 'inactive' and prevents login without deleting their data.
FR-2.7: The system shall provide a secure option to permanently delete a user after a confirmation prompt.

FR-3: Service Provider Management
FR-3.1: The system shall display a list of all service providers with their Name, Email, Service Type, Rating, and Status.
FR-3.2: The system shall allow administrators to view a detailed provider profile, including their services, ratings, and booking history.
FR-4: Booking Management
FR-4.1: The system shall display separate lists for Pending Bookings and Completed Bookings.
FR-4.2: The system shall allow administrators to view, edit, or cancel a booking.
FR-4.3: The system shall provide advanced search and filter options for bookings by user, provider, date, or status.
FR-5: Service & Category Management
FR-5.1: The system shall provide a list of all services with their Name, Category, Price, and Status.
FR-5.2: The system shall provide forms to add or edit a service, including fields for description and images.
FR-5.3: The system shall provide an interface to manage service categories, including CRUD operations for categories and the ability to assign services to them.
FR-7: Reports & Analytics
FR-7.1: The system shall generate service booking reports custom date or month wise.
FR-7.2: The system shall provide User Analytics to track new registrations and active users.
FR-7.3: The system shall provide Service Analytics to monitor the popularity and performance of individual services.
FR-8: Notifications
FR-8.1: The system shall provide a notification center displaying system.
FR-8.2: Administrators shall be able to mark notifications as read or delete them.
FR-9: Localization
FR-9.1: The system shall provide a dropdown menu to change the display language of the dashboard.
FR-9.2: All text strings in the UI shall be managed via a centralized translation file to facilitate multi-language support.

FR-10: Security & Settings
FR-10.1: The system shall require secure admin login with password authentication.
FR-10.2: The system shall provide a settings page for administrators to update their profile information and password.
FR-10.3: The system shall provide a configuration page to set general platform settings, such as branding (logo, colors) and default language.

3.2 Non-Functional Requirements (NFR)
NFR-1: Performance
NFR-1.1: The dashboard must load efficiently on a standard internet connection.
NFR-1.2: All data tables must load efficiently, even with thousands of records, using pagination and lazy loading.
NFR-1.3: API requests for data retrieval should respond in less than 3 second.
NFR-2: Security
NFR-2.1: All user passwords must be encrypted at rest using a strong hashing algorithm (e.g., bcrypt).
NFR-2.2: The application must use HTTPS for all communications to ensure data encryption in transit.
NFR-3: Usability
NFR-3.1: The UI must be intuitive and easy to navigate, with a consistent layout and clear labeling.
NFR-3.2: The dashboard must be responsive, adapting its layout for different screen sizes (desktops, tablets).
NFR-3.3: The system shall provide clear feedback messages for all actions (e.g., "User updated successfully").
NFR-4: Reliability
NFR-4.1: The dashboard must have an uptime of at least 99.5%.
NFR-4.2: The system must handle API errors gracefully, displaying user-friendly error messages instead of technical errors.



NFR-5: Scalability
NFR-5.1: The architecture must be scalable to handle a growing number of users and data records without significant performance degradation.
NFR-5.2: The system must be designed to easily integrate new features and modules in the future.

4. System Design
4.1 Architectural Design
The admin dashboard will follow a Single-Page Application (SPA) architecture using React. It will communicate with the backend via a REST API. The UI components will be organized into a modular structure to promote reusability. The state will be managed using a robust library like Redux or Zustand.
4.2 UI/UX Design
The interface will be clean and modern, leveraging pre-built UI components from a library like Material-UI or Ant Design. A consistent design system with a defined color palette, typography, and spacing will be used throughout the application to ensure a cohesive user experience.


