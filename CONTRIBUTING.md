# Contributing to RoomSync

This document outlines our team's workflow, values, and guidelines for contributing to the project.

## Team Norms

### Our Values
- **Collaboration First**: We believe in open communication and helping each other succeed
- **Quality Over Speed**: We prioritize welltested and maintainable code
- **Respect**: We treat all team members and contributors with respect
- **Transparency**: We keep the team informed about our progress and any blockers

### Communication
- Use the team Discord channel to point out any issues
- Ask questions early and often

### Code Standards
- Write clean, readable code with meaningful variable and function names
- Comment on complex logic 
- Follow existing code style and conventions in the project
- Ensure your code works before submitting a Pull Request

## Git Workflow

We follow a feature branch workflow:

### Branch Naming Convention
We use a hierarchical naming structure that connects tasks to their parent user stories:

- **Task branches**: `user-story/#/task/#/description`
  - Example: `user-story/13/task/9/user-login`
  - Format: `user-story/[story-number]/task/[task-number]/[brief-description]`
  
- **Spike branches**: `spike/#/description`
  - Example: `spike/5/database-research`

This naming convention helps us track which task belongs to which user story.

### Workflow Steps

1. **Always start from an up-to-date main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new branch for your work**
   ```bash
   git checkout -b user-story/13/task/9/user-login
   ```

3. **Make your changes and commit regularly**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

4. **Keep your branch updated with main**
   ```bash
   git checkout main
   git pull origin main
   git checkout user-story/13/task/9/user-login
   git merge main
   ```

5. **Push your branch to GitHub**
   ```bash
   git push origin user-story/13/task/9/user-login
   ```

6. **Create a Pull Request on GitHub**
   - Provide a clear title and description
   - Request reviews from at least one team member

7. **Address review comments**
   - Make requested changes
   - Push updates to the same branch

8. **Merge after approval**
   - Wait for at least one approval

## How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in Issues
2. Create a new issue

### Suggesting Features
1. Check if the feature has already been requested
2. Create a new issue with the new feature


## Development Setup

### Setting Up Your Local Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/agile-students-fall2025/4-final-roomsync.git
   cd 4-final-roomsync
   ```

2. **Install front-end dependencies**
   ```bash
   cd front-end
   npm install
   ```

3. **Install back-end dependencies**
   ```bash
   cd ../back-end
   npm install
   ```
## Back-end Development

Our back-end is a simple Express server located in the `back-end` directory.

### Running the Back-end

From the project root:

```bash
cd back-end
npm install
npm start        
