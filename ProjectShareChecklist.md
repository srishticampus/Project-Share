# ProjectShare Implementation Checklist

## 1. Landing Page

-   [x] Implement Website name with logo (Common page when opening the website)
-   [x] Implement Image slideshow animation
-   [x] Implement Login dropdown with links to:
    -   [x] Admin
    -   [x] Project Creators
    -   [x] Collaborators
    -   [x] Mentors/Experts
-   [x] Implement Home section with:
    -   [x] Image slideshow animation
    -   [x] Add Description ("How ProjectShare Can Help You?") - Textarea
    -   [x] Find Projects - Textlink
    -   [x] Find Collaborators - Textlink
-   [x] Implement About section with:
    -   [x] Description (A short brief description about the website and its services) - Textarea
    -   [x] Image slideshow animation
-   [x] Implement Contact us section

## 2. Admin

-   [x] Implement Login page with:
    -   [x] Username - Textbox
    -   [x] Password - Textbox (with eye icon, password visible in black dots when typing)
    -   [x] Reset password - Textlink
        -   [x] Enter new password - Textbox
        -   [x] Re-enter new password - Textbox
        -   [x] Submit - Button
    -   [x] Login - Button
-   [x] Implement Dashboard with:
    -   [ ] Total Project Creators - View (Show the total counts)
    -   [ ] Total Collaborators - View
    -   [ ] Total Mentors/Experts - View
    -   [ ] Recent Projects - View
    -   [ ] Recent Reports - View
-   [x] Implement View Mentor/Expert Requests with:
    -   [ ] Name - Text (The recent request should display in the dashboard page of the admin)
    -   [ ] Photo - Picture
    -   [ ] Contact number - Textbox
    -   [ ] Email id - Textbox
    -   [ ] Expertise areas - Textbox
    -   [ ] Years of Experience - Numeric Field
    -   [ ] Approve/Reject - Button
    -   [ ] See all - Text Link
-   [x] Implement Projects section with:
    -   [ ] View Project List - Text Link
        -   [ ] Project Title - View
        -   [ ] Project Creator - View
        -   [ ] Category - View
        -   [ ] Description - View
        -   [ ] Required Skills - View
        -   [ ] Collaborators - View
        -   [ ] Status - View (Active/Completed/On Hold)
        -   [ ] View all - Button
-   [x] Implement Users section with:
    -   [ ] View List
        -   [ ] Full name - View
        -   [ ] Email Address - View
        -   [ ] Date of Birth - View
        -   [ ] Gender - View
        -   [ ] Country - View
        -   [ ] City - View
        -   [ ] Contact Number - View
        -   [ ] User Type - View (Project Creator/Collaborator/Mentor)
        -   [ ] Profile Picture - View
        -   [ ] Active/Inactive - Toggle (An alert message should be displayed for confirmation while login the user profile that "Please contact Administrator for activation")
        -   [ ] Delete User - Button (With confirmation dialog)
-   [x] Implement Content Moderation section with:
    -   [ ] View Reported Content - View list
        -   [ ] Content Type - View (Project/Comment/Message)
        -   [ ] Reported By - View
        -   [ ] Date Reported - View
        -   [ ] Reason - View
        -   [ ] Action - Button (Remove/Keep with notes)
-   [x] Implement Platform Analytics section with:
    -   [ ] User Engagement - Charts
    -   [ ] Project Success Rate - Charts
    -   [ ] Popular Categories - Charts
    -   [ ] User Growth - Charts
-   [x] Implement Logout - Button (While clicking logout ask a confirmation message should display while logging out)

## 3. Project Creator

-   [x] Implement Registration page with:
    -   [x] Name - Textbox
    -   [x] Photo - Photo Upload
    -   [x] Contact number - Textbox
    -   [x] Email id - Textbox
    -   [x] Password - Textbox (When typing the password should display in black dots)
    -   [x] Confirm Password - Textbox
    -   [x] Skills/Expertise - Multiselect
    -   [x] Bio - Textarea
    -   [x] Register - Button
-   [x] Implement Login page with:
    -   [x] Username - Textbox
    -   [x] Password - Textbox (with eye icon, password visible in black dots when typing)
    -   [x] Login - Button
    -   [ ] Forgot Password - Button
        -   [ ] Enter new password - Textbox
        -   [ ] Re-enter new password - Textbox
        -   [ ] Submit - Button
    -   [ ] New To ProjectShare! Register now - Button Link Text
-   [x] Implement Dashboard with:
    -   [ ] Total Projects - View (Show the total counts)
    -   [ ] Active Projects - View
    -   [ ] Completed Projects - View
    -   [ ] Recent Applications - View
-   [ ] Implement Project Management section with:
    -   [ ] Create New Project - Textlink
        -   [ ] Project Title - Textbox
        -   [ ] Category - Dropdown
        -   [ ] Description - Textarea
        -   [ ] Required Skills - Multiselect
        -   [ ] Timeline - Date Range
        -   [ ] Attachments - File Upload (Multiple files option)
        -   [ ] Create - Button
    -   [ ] View My Projects - View List
        -   [ ] Project Title - View
        -   [ ] Category - View
        -   [ ] Description - View
        -   [ ] Required Skills - View
        -   [ ] Collaborators - View
        -   [ ] Status - View (Active/Completed/On Hold)
        -   [ ] Edit - Button
        -   [ ] Delete - Button (With confirmation dialog)
    -   [ ] Manage Tasks
        -   [ ] Add Task - Button
            -   [ ] Task Title - Textbox
            -   [ ] Description - Textarea
            -   [ ] Assigned To - Dropdown (From project collaborators)
            -   [ ] Due Date - Date
            -   [ ] Priority - Dropdown (High/Medium/Low)
            -   [ ] Status - Dropdown (Not Started/In Progress/Completed)
    -   [ ] View Applications - View List
        -   [ ] Collaborator Name - View
        -   [ ] Photo - View
        -   [ ] Skills - View
        -   [ ] Message - View (Application message)
        -   [ ] Portfolio Links - View
        -   [ ] Accept/Reject - Button
-   [ ] Implement Chat with Collaborators section with:
    -   [ ] Search Collaborators - Search Icon
    -   [ ] Name - View
    -   [ ] Photo - View
    -   [ ] Skills - View
    -   [ ] Chat - View/Reply/Send Button (A new screen should display and show the previous chats if any)
-   [ ] Implement Connect with Mentors section with:
    -   [ ] Search Mentors - Search Icon
    -   [ ] Name - View
    -   [ ] Expertise - View
    -   [ ] Experience - View
    -   [ ] Request Mentorship - Button
        -   [ ] Message - Textarea (For mentorship request)
-   [ ] Implement Profile section with:
    -   [ ] Name - View
    -   [ ] Photo - View
    -   [ ] Contact number - View
    -   [ ] Email id - View
    -   [ ] Skills/Expertise - View
    -   [ ] Bio - View
    -   [ ] Edit - Button
        -   [ ] Name - Textbox
        -   [ ] Photo - Photo Upload
        -   [ ] Contact number - Textbox
        -   [ ] Email id - Textbox
        -   [ ] Skills/Expertise - Multiselect
        -   [ ] Bio - Textarea
        -   [ ] Update - Button
        -   [ ] Cancel - Button
-   [ ] Implement Logout - Button (While clicking logout a confirmation message should display while asking logging out)

## 4. Collaborator

-   [x] Implement Registration page with:
    -   [x] Name - Textbox
    -   [x] Photo - Photo Upload
    -   [x] Contact number - Textbox
    -   [x] Email id - Textbox
    -   [x] Password - Textbox (When typing the password should display in black dots)
    -   [x] Confirm Password - Textbox
    -   [x] Skills - Multiselect
    -   [x] Portfolio Links - Textbox (Multiple links allowed)
    -   [x] Bio - Textarea
    -   [x] Register - Button
-   [x] Implement Login page with:
    -   [x] Username - Textbox
    -   [x] Password - Textbox (with eye icon, password visible in black dots when typing)
    -   [x] Login - Button
    -   [ ] Forgot Password - Button
        -   [ ] Enter new password - Textbox
        -   [ ] Re-enter new password - Textbox
        -   [ ] Submit - Button
    -   [ ] New To ProjectShare! Register now - Button Link Text
-   [ ] Implement Dashboard with:
    -   [ ] Applied Projects - View (Show the total counts)
    -   [ ] Active Projects - View
    -   [ ] Completed Projects - View
-   [ ] Implement Browse Projects section with:
    -   [ ] Search Projects - Search Icon
    -   [ ] Filter by Category - Dropdown
    -   [ ] Filter by Skills - Multiselect
    -   [ ] Project List - View List
        -   [ ] Project Title - View
        -   [ ] Creator - View
        -   [ ] Category - View
        -   [ ] Description - View
        -   [ ] Required Skills - View
        -   [ ] Timeline - View
        -   [ ] View Details - Button
            -   [ ] Project Details - View
                -   [ ] Project Title - View
                -   [ ] Creator - View
                -   [ ] Category - View
                -   [ ] Description - View
                -   [ ] Required Skills - View
                -   [ ] Timeline - View
                -   [ ] Attachments - View
                -   [ ] Apply - Button
                    -   [ ] Application Message - Textarea
                    -   [ ] Submit Application - Button
-   [ ] Implement My Projects section with:
    -   [ ] View Applied Projects - View List
        -   [ ] Project Title - View
        -   [ ] Status - View (Pending/Accepted/Rejected)
        -   [ ] Application Date - View
    -   [ ] View Active Projects - View List
        -   [ ] Project Title - View
        -   [ ] Creator - View
        -   [ ] My Tasks - View
            -   [ ] Task Status - View (Not Started/In Progress/Completed)
            -   [ ] Update Task Status - Button
    -   [ ] View Completed Projects - View List (For portfolio building)
        -   [ ] Project Title - View
        -   [ ] Creator - View
        -   [ ] Completion Date - View
        -   [ ] My Contributions - Textarea (Can be edited for portfolio)
        -   [ ] Add to Portfolio - Toggle
-   [ ] Implement Portfolio section with:
    -   [ ] Projects - View List
    -   [ ] Skills Showcase - Multiselect
    -   [ ] Portfolio Links - Textbox (Multiple links allowed)
    -   [ ] Bio - Textarea
    -   [ ] Edit - Button
        -   [ ] Projects - View List
        -   [ ] Skills Showcase - Multiselect
        -   [ ] Portfolio Links - Textbox
        -   [ ] Bio - Textarea
-   [ ] Implement Chat with Project Creators section with:
    -   [ ] Search - Search Icon
    -   [ ] Name - View
    -   [ ] Project - View
    -   [ ] Chat - View/Reply/Send Button (A new screen should display and show the previous chats if any)
-   [ ] Implement Connect with Mentors section with:
    -   [ ] Search Mentors - Search Icon
    -   [ ] Name - View
    -   [ ] Expertise - View
    -   [ ] Experience - View
    -   [ ] Request Mentorship - Button
        -   [ ] Message - Textarea (For mentorship request)
-   [ ] Implement Profile section with:
    -   [ ] Name - View
    -   [ ] Photo - View
    -   [ ] Contact number - View
    -   [ ] Email id - View
    -   [ ] Skills - View
    -   [ ] Portfolio Links - View (Multiple links allowed)
    -   [ ] Bio - View
    -   [ ] Edit - View
        -   [ ] Name - Textbox
        -   [ ] Photo - Photo Upload
        -   [ ] Contact number - Textbox
        -   [ ] Email id - Textbox
        -   [ ] Skills - Multiselect
        -   [ ] Portfolio Links - Textbox
        -   [ ] Bio - Textarea
-   [ ] Implement Logout - Button (While clicking logout a confirmation message should display while asking logging out)

## 5. Mentor/Expert

-   [x] Implement Registration page with:
    -   [x] Name - Textbox
    -   [x] Photo - Photo Upload
    -   [x] Contact number - Textbox
    -   [x] Email id - Textbox
    -   [x] Password - Textbox (When typing the password should display in black dots)
    -   [x] Confirm Password - Textbox
    -   [x] Areas of Expertise - Multiselect
    -   [x] Years of Experience - Numeric Field
    -   [x] Credentials - Textarea
    -   [x] Bio - Textarea
    -   [x] Register - Button
-   [x] Implement Login page with:
    -   [x] Username - Textbox
    -   [x] Password - Textbox (with eye icon, password visible in black dots when typing)
    -   [x] Login - Button
    -   [ ] Forgot Password - Button
        -   [ ] Enter new password - Textbox
        -   [ ] Re-enter new password - Textbox
        -   [ ] Submit - Button
    -   [ ] New To ProjectShare! Register now - Button Link Text
-   [ ] Implement Dashboard with:
    -   [ ] Mentorship Requests - View (Show the total counts)
    -   [ ] Active Mentorships - View
    -   [ ] Projects Following - View
-   [ ] Implement Mentorship Requests section with:
    -   [ ] View List
        -   [ ] Requester Name - View
        -   [ ] Type - View (Project Creator/Collaborator)
        -   [ ] Message - View
        -   [ ] Project (if applicable) - View
        -   [ ] Accept/Reject - Button
-   [ ] Implement Active Mentorships section with:
    -   [ ] View List
        -   [ ] Mentor Name - View
        -   [ ] Type - View (Project Creator/Collaborator)
        -   [ ] Project (if applicable) - View
        -   [ ] Chat - Button
-   [ ] Implement Browse Projects section with:
    -   [ ] Search Projects - Search Icon
    -   [ ] Filter by Category - Dropdown
    -   [ ] Filter by Skills - Multiselect
    -   [ ] Project List - View List
        -   [ ] Project Title - View
        -   [ ] Creator - View
        -   [ ] Category - View
        -   [ ] Description - View
        -   [ ] Follow Project - Button (To track and provide feedback)
        -   [ ] View Details - Button
            -   [ ] Project Details - View
                -   [ ] Project Title - View
                -   [ ] Creator - View
                -   [ ] Category - View
                -   [ ] Description - View
                -   [ ] Required Skills - View
                -   [ ] Timeline - View
                -   [ ] Attachments - View
                -   [ ] Provide Feedback - Button
                    -   [ ] Feedback Message - Textarea
                    -   [ ] Submit Feedback - Button
-   [ ] Implement Knowledge Sharing section with:
    -   [ ] Create Article - Button
        -   [ ] Title - Textbox
        -   [ ] Content - Rich Text Editor
        -   [ ] Category - Dropdown
        -   [ ] Tags - Multiselect
        -   [ ] Publish - Button
    -   [ ] View Articles - View List
        -   [ ] Title - View
        -   [ ] Publication Date - View
        -   [ ] Views - View
        -   [ ] Comments - View
        -   [ ] Edit - Button
        -   [ ] Delete - Button (With confirmation dialog)
-   [ ] Implement Chat with Mentees section with:
    -   [ ] Search - Search Icon
    -   [ ] Name - View
    -   [ ] Type - View (Project Creator/Collaborator)
    -   [ ] Chat - View/Reply/Send Button (A new screen should display and show the previous chats if any)
-   [ ] Implement Profile section with:
    -   [ ] Name - Textbox
    -   [ ] Photo - Photo Upload
    -   [ ] Contact number - Textbox
    -   [ ] Email id - Textbox
    -   [ ] Areas of Expertise - Multiselect
    -   [ ] Years of Experience - Numeric Field
    -   [ ] Credentials - Textarea
    -   [ ] Bio - Textarea
    -   [ ] Edit - Button
        -   [ ] Update - Button
        -   [ ] Cancel - Button
-   [ ] Implement Logout - Button (While clicking logout a confirmation message should display while asking logging out)

## 6. Common Features

-   [ ] Implement Notifications section with:
    -   [ ] Notification Center - Icon (Bell icon with counter)
    -   [ ] Notification List - View List
    -   [ ] Mark as Read - Button
    -   [ ] Clear All - Button
-   [ ] Implement Search section with:
    -   [ ] Global Search - Search Box
    -   [ ] Search Results - View List
    -   [ ] Filter by Type - Dropdown (Projects/Users/Articles)
-   [ ] Implement Messaging System section with:
    -   [ ] Inbox - View
    -   [ ] Sent - View
    -   [ ] Compose - Button
        -   [ ] To - Dropdown (Select user)
        -   [ ] Subject - Textbox
        -   [ ] Message - Textarea
        -   [ ] Send - Button
-   [ ] Implement Report System section with:
    -   [ ] Report Content - Button (Available on projects, comments, messages)
        -   [ ] Reason - Dropdown (Inappropriate/Spam/Harassment/Other)
        -   [ ] Description - Textarea
        -   [ ] Submit - Button
-   [ ] Implement Help & Support section with:
    -   [ ] FAQ - View
    -   [ ] Contact Support - Form
        -   [ ] Name - Textbox
        -   [ ] Email - Textbox
        -   [ ] Subject - Textbox
        -   [ ] Message - Textarea
        -   [ ] Submit - Button
    -   [ ] User Guide - View
