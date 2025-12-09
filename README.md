# RoomSync

[Link to our Repo](https://github.com/agile-students-fall2025/4-final-roomsync)
[Link to our](https://room-sync-mmdu6.ondigitalocean.app/landing)

### **Project Proposal**

**1. Introduction & Problem Statement**

Living with roommates can be a rewarding experience, but it often comes with significant friction. Current solutions are fragmented:
*   **Chore tracking** is handled through a mix of notes, texts, and memory, leading to ambiguity and conflict.
*   **Finding a compatible roommate** is often reduced to a game of chance on classified sites, with little focus on living habits and personality compatibility.
*   **Building a genuine community** within a shared home is left to chance, with no tools to facilitate bonding and mutual growth.

**2. Proposed Solution: The RoomSync Platform**

Nexus is a mobile-friendly web application with three core modules that work together:

*   **Module 1: The Harmony Hub**

    This is the logistical core for managing the shared physical space.
    *   **Chore Wheel:** Assign, rotate, and track chores. Automated reminders and a visual calendar ensure fairness.
    *   **Create Household:** Create a household by adding new roommates.


*   **Module 2: The Compatibility Finder**

    This feature helps users find the *right* roommate accordinf to indviduals' habits and personality.
    *   **Living Habit Quiz:** Users complete a short, quiz about their personality, cleanliness, sleep schedule, social preferences (e.g., "Are you a night owl?" "How do you feel about guests?").
    *   **Compatibility Scoring:** The system generates a compatibility score between users looking for roommates, highlighting shared habits and flagging potential conflicts *before* they move in together.
    *   **Filtered Search:** Search for potential roommates based on location, budget, and compatibility score.

*   **Module 3: The Skill Swap**

    This is the "community builder" that coonects the exiting roommates as well as other users of RoomSync. It leverages the fact that roommates are a built-in audience.
    *   **Internal Skill Exchange:** User create profiles listing skills they can offer (e.g., "I can cook Italian," "I'm great at Excel") and skills they want to learn. It also give users a chance to build their community and plan fun activities.
    *   **Shared Calendar for Sessions:** Schedule skill-swap sessions directly within the platform's calendar.

**3. Key Features**

*   User Registration & Household Creation
*   Dashboard with overview of chores, expenses, and skill swap activity
*   Chore Management with reminders
*   Shared Inventory & Shopping List
*   Expense Tracking & Splitting
*   Living Habit Quiz & Compatibility Profile
*   Skill Offer/Want Listings
*   Internal Messaging System

**4. Team**

* **Sprint 0 Roles**
  * **Product Owner:** Brian Chen
  * **Scrum Master:** Jacob Kang

* **Sprint 1 Roles**
  * **Product Owner:** Chenyu (Ginny) Jiang 
  * **Scrum Master:** Eslem Varank
  * _Note: To be able run our program and see all the sprint 1 implementation: 1- Fork the file, 2- Install npm, 3- run 'npm start' on terminal in front-end folder_

* **Sprint 2 Roles**
  * **Product Owner:** Eslem Varank
  * **Scrum Master:** Brian Chen
  * _Note: To be able run our program and see all the sprint 2 implementation: 1- Fork the file, 2- Install npm, 3- run 'npm start' on terminal in front-end folder_

* **Sprint 3 Roles**
  * **Product Owner:** Jacob Kang
  * **Scrum Master:** Amish Vandse
  * _Note: To be able run our program and see all the sprint 3 implementation: 1- Fork the file, 2- Install npm,3-Add .env, 4- run 'npm start' on terminal in front-end folder_

  * **Sprint 3 Roles**
  * **Product Owner:** Amish Vandse
  * **Scrum Master:** Chenyu (Ginny) Jiang
  * _Note: To be able run our program and see all the sprint 4, click on our website link 

* **Developers**
  * [Eslem Varank](https://github.com/eselmsenavarank)
  * [Amish Vandse](https://github.com/AmishVandse1)
  * [Jacob Kang](https://github.com/jkang2003)
  * [Chenyu (Ginny) Jiang](https://github.com/ginny1536)
  * [Brian Chen](https://github.com/shrimpforfree)
    
_Note: Scrum Master and Product Owner roles rotate each sprint so everyone gets experience in each role._

## How to Run RoomSync Locally

Follow these steps to set up and run both the front-end and back-end on your local machine.

---

## 1. Prerequisites

Make sure you have:

- **Node.js** (LTS recommended) → https://nodejs.org  
- **npm** (comes with Node)
- **Git**

---

## 2. Setting Up Your Local Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/agile-students-fall2025/4-final-roomsync.git
   cd 4-final-roomsync
   ```

2. **Install and run front-end dependencies**
   ```bash
   cd front-end
   npm install
   npm run
   ```

3. **Install, run, and test back-end dependencies**
   ```bash
   cd ../back-end
   npm install
   npm start
   npm test
   ```
