# ProjectShare Implementation Checklist (Cycle 1)

## Foundational Setup
- [ ] Setup Project Structure (Frontend/Backend)
- [ ] Choose and Setup Database Schema
- [x] Implement Role-Based Access Control (RBAC) Middleware/Checks
- [ ] Setup Basic API Endpoint Structure
- [ ] Implement Frontend Routing
- [ ] Basic UI/UX Design & Styling Setup (Component Library, CSS Framework)
- [ ] Implement Basic Input Validation (Frontend & Backend)

## Module 1: Landing Page
- [x] Implement Header with Website Name and Logo
- [x] Implement Image Slideshow (Hero Section)
- [x] Implement Login Dropdown
  - [ ] Add Admin Login Link
  - [ ] Add Project Creator Login Link
  - [ ] Add Collaborator Login Link
  - [ ] Add Mentor/Expert Login Link
- [x] Implement Home Section
  - [x] Add Image Slideshow
  - [x] Add Description ("How ProjectShare Can Help You?")
  - [x] Add "Find Projects" Link
  - [x] Add "Find Collaborators" Link
- [x] Implement About Section
  - [x] Add Description
  - [x] Add Image Slideshow
- [x] Implement Contact Us Section (Basic Info Display)

## Module 2: Admin Role
### Authentication & Setup
- [x] Implement Admin Login Page API Endpoint
- [x] Implement Admin Login Page Frontend Form & Logic
  - [ ] Username Field
  - [ ] Password Field (masked) with Show/Hide Toggle (Eye Icon)
  - [ ] Login Button
- [ ] Implement Admin Password Reset Functionality (API & Frontend)
  - [ ] "Reset Password" Link
  - [ ] New Password Field
  - [ ] Confirm New Password Field
  - [ ] Submit Button for Password Reset
- [ ] Implement Admin Logout Functionality (API & Frontend)
  - [ ] Logout Button
  - [ ] Confirmation Dialog on Logout

### Dashboard
- [ ] Implement Admin Dashboard Layout
- [ ] Implement API Endpoint for Dashboard Stats
- [ ] Display Total Project Creators Count
- [ ] Display Total Collaborators Count
- [ ] Display Total Mentors/Experts Count
- [ ] Implement API Endpoint for Recent Projects (Limited List)
- [ ] Display Recent Projects Section/List
- [ ] Implement API Endpoint for Recent Reports (Limited List)
- [ ] Display Recent Reports Section/List
- [ ] Implement API Endpoint for Recent Mentor/Expert Requests (Limited List)
- [ ] Display Recent Mentor/Expert Requests Section
  - [ ] Show Name, Photo, Contact, Email, Expertise, Experience
  - [ ] Add Approve/Reject Buttons (API Call)
  - [ ] Add "See All" Link (to Full Mentor Request List Page)

## Mentor/Expert Management
- [ ] Implement Mentor/Expert Request Management Page (Frontend)
- [ ] Implement API Endpoint to List All Mentor Requests
- [ ] Display Full List of Requests (Name, Photo, Contact, Email, Expertise, Experience)
- [ ] Implement API Endpoint for Approving/Rejecting Mentor Requests
- [ ] Implement Approve/Reject Functionality (Frontend calls API)

## Project Management
- [ ] Implement Project Overview Page (Admin View - Frontend)
- [ ] Implement API Endpoint to List All Projects (with filters/pagination)
- [ ] Display List of All Projects (Title, Creator, Category, Description, Skills, Collaborators, Status)
- [ ] Implement Basic Filtering/Sorting for Project List (Frontend controls)

## User Management
- [ ] Implement User Management Page (Frontend)
- [ ] Implement API Endpoint to List All Users (with filters/pagination)
- [ ] Display List of All Users (Full Name, Email, DOB, Gender, Country, City, Contact, User Type, Profile Picture)
- [ ] Implement API Endpoint for Toggling User Active/Inactive Status
- [ ] Implement Active/Inactive Toggle for Users (Frontend calls API)
  - [ ] Add Confirmation Alert for Deactivation
- [ ] Implement API Endpoint for Deleting User
- [ ] Implement Delete User Button (Frontend calls API)
  - [ ] Add Confirmation Dialog for Deletion

## Content Moderation
- [ ] Implement Content Moderation Page (Frontend)
- [ ] Implement API Endpoint to List Reported Content (with filters/pagination)
- [ ] Display List of Reported Content (Content Type, Reported By, Date Reported, Reason)
- [ ] Implement API Endpoint for Handling Reported Content (Remove/Keep)
- [ ] Implement Action Buttons (Remove/Keep with Notes) (Frontend calls API)

## Analytics (Basic Views)
- [ ] Implement Basic Platform Analytics Page (Frontend)
- [ ] Implement API Endpoint for Basic User Engagement Data
- [ ] Display User Engagement Chart/Data
- [ ] Implement API Endpoint for Basic Project Success Rate Data
- [ ] Display Project Success Rate Chart/Data
- [ ] Implement API Endpoint for Popular Categories Data
- [ ] Display Popular Categories Chart/List
- [ ] Implement API Endpoint for Basic User Growth Data
- [ ] Display User Growth Chart/Data

## Module 3: Project Creator Role
### Authentication & Profile Setup
- [ ] Implement Project Creator Registration API Endpoint
- [ ] Implement Project Creator Registration Page (Frontend Form & Logic)
  - [ ] Name Field
  - [ ] Photo Upload Field (Basic Implementation)
  - [ ] Contact Number Field
  - [ ] Email ID Field
  - [ ] Password Field (masked)
  - [ ] Confirm Password Field
  - [ ] Skills/Expertise Multiselect Field
  - [ ] Bio Textarea
  - [ ] Register Button
- [x] Implement Project Creator Login API Endpoint
- [x] Implement Project Creator Login Page (Frontend Form & Logic)
  - [ ] Username Field
  - [ ] Password Field (masked) with Show/Hide Toggle (Eye Icon)
  - [ ] Login Button
- [ ] Implement Project Creator Forgot Password Functionality (API & Frontend)
  - [ ] "Forgot Password" Link
  - [ ] New Password Field
  - [ ] Confirm New Password Field
  - [ ] Submit Button
- [ ] Add "New To ProjectShare! Register now" Link on Login Page
- [ ] Implement Project Creator Profile View API Endpoint
- [ ] Implement Project Creator Profile Page (View Mode - Frontend)
  - [ ] Display Name, Photo, Contact, Email, Skills/Expertise, Bio
  - [ ] Add Edit Button
- [ ] Implement Project Creator Profile Update API Endpoint
- [ ] Implement Project Creator Profile Page (Edit Mode - Frontend)
  - [ ] Editable Name Field
  - [ ] Editable Photo Upload Field
  - [ ] Editable Contact Number Field
  - [ ] Editable Email ID Field
  - [ ] Editable Skills/Expertise Multiselect Field
  - [ ] Editable Bio Textarea
  - [ ] Update Button (calls API)
  - [ ] Cancel Button
- [ ] Implement Project Creator Logout Functionality (API & Frontend)
  - [ ] Logout Button
  - [ ] Confirmation Dialog on Logout

### Dashboard
- [ ] Implement Project Creator Dashboard Layout
- [ ] Implement API Endpoint for Project Creator Dashboard Stats
- [ ] Display Total Projects Count
- [ ] Display Active Projects Count
- [ ] Display Completed Projects Count
- [ ] Implement API Endpoint for Recent Applications (Limited List)
- [ ] Display Recent Applications Section/List

### Project Management
- [ ] Implement Create New Project API Endpoint
- [ ] Implement "Create New Project" Page/Form (Frontend)
  - [ ] Project Title Field
  - [ ] Category Dropdown
  - [ ] Description Textarea
  - [ ] Required Skills Multiselect Field
  - [ ] Timeline Date Range Picker
  - [ ] Attachments File Upload (Basic - Single/Multiple)
  - [ ] Create Button (calls API)
- [ ] Implement API Endpoint to List Creator's Projects
- [ ] Implement "View My Projects" Page (Frontend)
  - [ ] Display List of Created Projects (Title, Category, Status)
  - [ ] Add Edit Button for each project (links to edit form)
  - [ ] Add Delete Button for each project (calls API)
    - [ ] Add Confirmation Dialog for Deletion
- [ ] Implement Project Update API Endpoint
- [ ] Implement Project Edit Form (Frontend - similar to create, pre-filled)
- [ ] Implement Project Deletion API Endpoint
- [ ] Implement Task Management Backend (Create, Read, Update, Delete Tasks within a Project)
- [ ] Implement Project Task Management UI (within project view - Frontend)
  - [ ] Display List of Tasks for the Project
  - [ ] Add "Add Task" Button
  - [ ] Implement Task Creation Form (calls API)
    - [ ] Task Title Field
    - [ ] Task Description Textarea
    - [ ] "Assigned To" Dropdown (populated with project collaborators)
    - [ ] Due Date Picker
    - [ ] Priority Dropdown (High/Medium/Low)
    - [ ] Status Dropdown (Not Started/In Progress/Completed)
  - [ ] Implement Task Editing Functionality (calls API)
  - [ ] Implement Task Deletion Functionality (calls API)

### Collaboration Management
- [ ] Implement API Endpoint to List Applications for a Project
- [ ] Implement "View Applications" Page (for a specific project - Frontend)
  - [ ] Display List of Applicants (Collaborator Name, Photo, Skills, Message, Portfolio Links)
  - [ ] Implement API Endpoint for Accepting/Rejecting Applications
  - [ ] Add Accept Button (calls API)
  - [ ] Add Reject Button (calls API)
- [ ] Implement Basic Chat Backend (Store/Retrieve Messages between users)
- [ ] Implement Chat Functionality with Collaborators (Frontend)
  - [ ] Search Bar for Collaborators (within project)
  - [ ] Display List of Collaborators (Name, Photo, Skills)
  - [ ] Add Chat Button for each collaborator
  - [ ] Implement Chat Interface/Screen (calls API for messages, sends messages)

### Mentorship
- [ ] Implement API Endpoint to List Available Mentors
- [ ] Implement "Connect with Mentors" Page (Frontend)
  - [ ] Search Bar for Mentors
  - [ ] Display List of Mentors (Name, Expertise, Experience)
  - [ ] Implement API Endpoint for Sending Mentorship Requests
  - [ ] Add "Request Mentorship" Button (calls API)
  - [ ] Implement Mentorship Request Form (Message Textarea, Submit Button)

## Module 4: Collaborator Role
### Authentication & Profile Setup
- [ ] Implement Collaborator Registration API Endpoint
- [ ] Implement Collaborator Registration Page (Frontend Form & Logic)
  - [ ] Name Field
  - [ ] Photo Upload Field
  - [ ] Contact Number Field
  - [ ] Email ID Field
  - [ ] Password Field (masked)
  - [ ] Confirm Password Field
  - [ ] Skills Multiselect Field
  - [ ] Portfolio Links Textbox (allow multiple)
  - [ ] Bio Textarea
  - [ ] Register Button
- [x] Implement Collaborator Login API Endpoint
- [x] Implement Collaborator Login Page (Frontend Form & Logic)
  - [ ] Username Field
  - [ ] Password Field (masked) with Show/Hide Toggle (Eye Icon)
  - [ ] Login Button
- [ ] Implement Collaborator Forgot Password Functionality (API & Frontend)
  - [ ] "Forgot Password" Link
  - [ ] New Password Field
  - [ ] Editable Email ID Field
  - [ ] Editable Skills Multiselect Field
  - [ ] Editable Portfolio Links Textbox
  - [ ] Editable Bio Textarea
  - [ ] Update Button (calls API)
  - [ ] Cancel Button
- [ ] Implement Collaborator Logout Functionality (API & Frontend)
  - [ ] Logout Button
  - [ ] Confirmation Dialog on Logout

### Dashboard
- [ ] Implement Collaborator Dashboard Layout
- [ ] Implement API Endpoint for Collaborator Dashboard Stats
- [ ] Display Applied Projects Count
- [ ] Display Active Projects Count
- [ ] Display Completed Projects Count

### Project Discovery & Application
- [ ] Implement API Endpoint to Browse/Search Projects
- [ ] Implement "Browse Projects" Page (Frontend)
  - [ ] Search Bar for Projects
  - [ ] Filter by Category Dropdown
  - [ ] Filter by Skills Multiselect
  - [ ] Display Project List (Title, Creator, Category, Description, Skills, Timeline)
  - [ ] Add "View Details" Button for each project
- [ ] Implement API Endpoint to Get Project Details
- [ ] Implement Project Details Page (Public View - Frontend)
  - [ ] Display Project Title, Creator, Category, Description, Skills, Timeline, Attachments
  - [ ] Add "Apply" Button
- [ ] Implement API Endpoint for Submitting Project Application
- [ ] Implement Project Application Form (Modal or Page - Frontend)
  - [ ] Application Message Textarea
  - [ ] Submit Application Button (calls API)

### My Projects & Tasks
- [ ] Implement API Endpoint to List Collaborator's Projects (Applied, Active, Completed)
- [ ] Implement "My Projects" Page (Frontend)
  - [ ] Section for Applied Projects
    - [ ] Display List (Project Title, Status: Pending/Accepted/Rejected, Application Date)
  - [ ] Section for Active Projects
    - [ ] Display List (Project Title, Creator)
    - [ ] Display Associated Tasks (Task Title, Status)
    - [ ] Implement API Endpoint for Updating Task Status
    - [ ] Add "Update Task Status" Button/Dropdown (calls API)
  - [ ] Section for Completed Projects
    - [ ] Display List (Project Title, Creator, Completion Date)
    - [ ] Implement API Endpoint for Updating Portfolio Contributions/Toggle
    - [ ] Add Editable "My Contributions" Textarea (saves via API)
    - [ ] Add "Add to Portfolio" Toggle (saves via API)

### Portfolio
- [ ] Implement API Endpoint to Get Collaborator Portfolio Data
- [ ] Implement Portfolio Page (View Mode - Frontend)
  - [ ] Display List of Projects marked "Add to Portfolio"
  - [ ] Display Skills Showcase (from profile)
  - [ ] Display Portfolio Links (from profile)
  - [ ] Display Bio (from profile)
  - [ ] Add Edit Button (likely links to profile edit)

### Collaboration & Mentorship
- [ ] Implement Chat Functionality with Project Creators (Frontend - uses common chat UI)
  - [ ] Search Bar for Project Creators (involved in their projects)
  - [ ] Display List of Project Creators (Name, Project)
  - [ ] Add Chat Button for each creator
- [ ] Implement "Connect with Mentors" Page (Frontend - similar to Creator's)
  - [ ] Search Bar for Mentors
  - [ ] Display List of Mentors (Name, Expertise, Experience)
  - [ ] Add "Request Mentorship" Button (calls API)
  - [ ] Implement Mentorship Request Form (Message Textarea, Submit Button)

## Module 5: Mentor/Expert Role
### Authentication & Profile Setup
- [ ] Implement Mentor/Expert Registration API Endpoint (marks as pending approval)
- [ ] Implement Mentor/Expert Registration Page (Frontend Form & Logic)
  - [ ] Name Field
  - [ ] Photo Upload Field
  - [ ] Contact Number Field
  - [ ] Email ID Field
  - [ ] Password Field (masked)
  - [ ] Confirm Password Field
  - [ ] Areas of Expertise Multiselect Field
  - [ ] Years of Experience Numeric Field
  - [ ] Credentials Textarea
  - [ ] Bio Textarea
  - [ ] Register Button (Submits for Admin Approval)
- [x] Implement Mentor/Expert Login API Endpoint (checks for approval status)
- [x] Implement Mentor/Expert Login Page (Frontend Form & Logic)
  - [ ] Username Field
  - [ ] Password Field (masked) with Show/Hide Toggle (Eye Icon)
  - [ ] Login Button
- [ ] Implement Mentor/Expert Forgot Password Functionality (API & Frontend)
  - [ ] "Forgot Password" Link
  - [ ] New Password Field
  - [ ] Confirm New Password Field
  - [ ] Submit Button
- [ ] Add "New To ProjectShare! Register now" Link on Login Page
- [ ] Implement Mentor/Expert Profile View API Endpoint
- [ ] Implement Mentor/Expert Profile Page (View Mode - Frontend)
  - [ ] Display Name, Photo, Contact, Email, Areas of Expertise, Years of Experience, Credentials, Bio
  - [ ] Add Edit Button
- [ ] Implement Mentor/Expert Profile Update API Endpoint
- [ ] Implement Mentor/Expert Profile Page (Edit Mode - Frontend)
  - [ ] Editable Name Field
  - [ ] Editable Photo Upload Field
  - [ ] Editable Contact Number Field
  - [ ] Editable Email ID Field
  - [ ] Editable Areas of Expertise Multiselect Field
  - [ ] Editable Years of Experience Field
  - [ ] Editable Credentials Textarea
  - [ ] Editable Bio Textarea
  - [ ] Update Button (calls API)
  - [ ] Cancel Button
- [ ] Implement Mentor/Expert Logout Functionality (API & Frontend)
  - [ ] Logout Button
  - [ ] Confirmation Dialog on Logout

### Dashboard
- [ ] Implement Mentor/Expert Dashboard Layout
- [ ] Implement API Endpoint for Mentor Dashboard Stats
- [ ] Display Mentorship Requests Count
- [ ] Display Active Mentorships Count
- [ ] Display Projects Following Count

### Mentorship Management
- [ ] Implement API Endpoint to List Mentor's Mentorship Requests
- [ ] Implement "Mentorship Requests" Page (Frontend)
  - [ ] Display List of Requests (Requester Name, Type, Message, Project Link)
  - [ ] Implement API Endpoint for Accepting/Rejecting Mentorship Requests
  - [ ] Add Accept Button (calls API)
  - [ ] Add Reject Button (calls API)
- [ ] Implement API Endpoint to List Mentor's Active Mentorships
- [ ] Implement "Active Mentorships" Page (Frontend)
  - [ ] Display List of Mentees (Mentee Name, Type, Project Link)
  - [ ] Add Chat Button for each mentee (uses common chat UI)

### Project Interaction
- [ ] Implement "Browse Projects" Page (Frontend - similar to Collaborator view)
  - [ ] Search Bar for Projects
  - [ ] Filter by Category Dropdown
  - [ ] Filter by Skills Multiselect
  - [ ] Display Project List (Title, Creator, Category, Description)
  - [ ] Implement API Endpoint for Following/Unfollowing Projects
  - [ ] Add "Follow Project" Button (calls API, toggles state)
  - [ ] Add "View Details" Button
- [ ] Implement Project Details Page (Mentor View - Frontend)
  - [ ] Display Project Title, Creator, Category, Description, Skills, Timeline, Attachments
  - [ ] Implement API Endpoint for Submitting Project Feedback
  - [ ] Add "Provide Feedback" Button
- [ ] Implement Feedback Form (Modal or Page - Frontend)
  - [ ] Feedback Message Textarea
  - [ ] Submit Feedback Button (calls API)

### Knowledge Sharing (Basic)
- [ ] Implement Article Creation/Editing API Endpoint
- [ ] Implement "Knowledge Sharing" / Articles Section (Frontend)
  - [ ] Add "Create Article" Button
  - [ ] Implement Article Creation/Editing Form (Frontend calls API)
    - [ ] Title Field
    - [ ] Content Field (Rich Text Editor - Basic)
    - [ ] Category Dropdown
    - [ ] Tags Multiselect/Input
    - [ ] Publish/Save Draft Button
- [ ] Implement API Endpoint to List Mentor's Articles
- [ ] Implement "View My Articles" Page (Frontend)
  - [ ] Display List of Created Articles (Title, Publication Date)
  - [ ] Add Edit Button for each article
  - [ ] Implement Article Deletion API Endpoint
  - [ ] Add Delete Button for each article (calls API)
    - [ ] Add Confirmation Dialog for Deletion

### Communication
- [ ] Implement Chat Functionality with Mentees (Frontend - uses common chat UI)
  - [ ] Search Bar for Mentees
  - [ ] Display List of Mentees (Name, Type)
  - [ ] Add Chat Button for each mentee

## Module 6: Common Features (Accessible to relevant roles)
### Notifications (Basic)
- [ ] Implement Notification System Backend (trigger basic events: new application, application accepted/rejected, new message, mentorship request)
- [ ] Implement Notification Center UI (Frontend)
  - [ ] Bell Icon with Unread Count Badge in Header (requires API endpoint for count)
  - [ ] Notification Dropdown/Panel (requires API endpoint to list notifications)
    - [ ] Display List of Notifications (message, timestamp)
    - [ ] Implement API Endpoint for Marking Notifications as Read
  - [ ] Add "Mark as Read" Functionality (calls API)

### Search (Basic)
- [ ] Implement Global Search Backend (basic indexing for Projects, Users)
- [ ] Implement Global Search UI (Frontend)
  - [ ] Search Box in Header/Main Navigation
  - [ ] Implement Search Results Page (calls API)
    - [ ] Display Combined List of Results (Projects, Users)
    - [ ] Add Filter by Type Dropdown (Projects/Users)

### Messaging System (Core)
- [ ] Implement Direct Messaging Backend (Create/Read conversations & messages)
- [ ] Implement Messaging UI (Frontend)
  - [ ] Inbox View (list conversations - calls API)
  - [ ] Compose Message Button/Form (calls API)
    - [ ] "To" Field (User Selection/Autocomplete)
    - [ ] Subject Field
    - [ ] Message Body Textarea
    - [ ] Send Button
  - [ ] Conversation View (display message thread - calls API)

### Reporting System (Core)
- [ ] Implement Reporting Backend (store basic reports against content/user)
- [ ] Implement Reporting UI (Frontend)
  - [ ] Add "Report Content" Button/Link on Projects, User Profiles (basic)
  - [ ] Implement Report Form (Modal or Page - calls API)
    - [ ] Reason Dropdown (Inappropriate/Spam/Other)
    - [ ] Description Textarea
    - [ ] Submit Report Button

### Help & Support (Static)
- [ ] Create Static FAQ Page/Section
- [ ] Create Static User Guide Page/Section
- [ ] Create Static Contact Info Display (No form initially)