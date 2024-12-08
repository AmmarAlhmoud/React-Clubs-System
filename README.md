**# Uskudar University Club System**

**Overview**

This React application is a club management system designed for Uskudar University. It offers features for three user types:

- **Admin:** Manages all aspects of the club system, including approving/rejecting requests, editing/deleting clubs and events, and viewing overall system statistics.
- **Club Manager:** Manages their specific club, including adding/editing events and posts, viewing club statistics, and requesting changes.
- **Student:** Views club information, events, and posts.

**Tech Stack**

- **Frontend:** React, Vite
- **Backend:** Firebase

**Features**

**Admin Dashboard:**

- **Requests:** View, approve, reject, and track the status of club manager requests.
- **Clubs:** View, edit, and delete clubs.
- **Events:** View, edit, and delete events.
- **Posts:** View, edit, and delete posts.
- **Weekly and Monthly Calendars:** Visualize events and deadlines.
- **Statistics:** View overall system statistics, including the number of clubs, events, and active users.

**Club Manager Dashboard:**

- **Club Information:** View and edit club details, including name, description, logo, and contact information.
- **Events:** Add, edit, and delete events.
- **Posts:** Add, edit, and delete posts.
- **Requests:** Submit requests to the admin for changes to club information, events, or posts.
- **Dashboard:** View club statistics, including the number of members, events, and posts.
- **Weekly Calendar:** Visualize upcoming events.
- **Other Clubs:** View events and posts from other clubs.

**Student Dashboard:**

- **Club List:** View a list of all clubs.
- **Club Details:** View specific club information, including events, posts, and contact information.
- **Event Calendar:** View upcoming events from all clubs.

**Home Page:**

- **Featured Clubs:** Showcase popular or recently added clubs.
- **Upcoming Events:** Highlight upcoming events from various clubs.
- **Club Categories:** Categorize clubs for easy navigation.

**Getting Started**

1.  **Install Dependencies:**

        - Navigate to the project directory.

        - Install dependencies:

    ```bash
    npm install
    ```

    **Development:**

1.  **Start the Development Server:**
    - Run the following command to start the development server:
      ```bash
      npm run dev
      ```
    - This will typically launch the app at `http://localhost:3000` in your browser (the exact port may vary).

**Live Website:**

- Visit the live website at: [https://et-clubs-system.netlify.app/].
