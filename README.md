# Interactive Question Management Sheet (Codolio)

An interactive, single-page application for tracking DSA progress, designed with a focus on user experience and productivity. This project essentially recreates and enhances the functionality of the "Striver SDE Sheet" with a modern, highly responsive UI.

## 🚀 Live Demo & Features

### Core Functionality
- **Hierarchical Organization**: Manage Questions nested within Sub-Topics, nested within Topics.
- **Full CRUD**:
  - **Add/Edit/Delete** Topics, Sub-Topics, and Questions.
  - **Drag-and-Drop Reordering**: Seamlessly reorder Topics, Sub-Topics, and Questions to customize your learning path.
- **Persistence**: Data is automatically saved to Local Storage, ensuring you never lose your progress.
- **Sample Data**: Pre-loaded with the comprehensive **Striver SDE Sheet** curriculum.

### 🌟 Bonus Features (Improvements)
We went beyond the basics to add features missing from standard trackers:
1.  **Multiple Platform Links**: Support for multiple practice links per question (LeetCode, CodingNinjas, GeeksforGeeks) with auto-detected platform badges.
2.  **Revision Bookmarks**: "Star" questions to add them to a dedicated **Bookmarks View** for quick revision.
3.  **Personal Notes**: Add, edit, and view personal notes for every question to jot down intuitions or edge cases.
4.  **Completion Tracking**: Visual progress circle in the header tracks your overall completion status in real-time.
5.  **Codolio Theme**: A premium, "Codolio"-inspired UI with a polished Sky Blue & Orange aesthetic.

## 🛠️ Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite (Fast HMR & Optimized Builds)
- **Styling**: Tailwind CSS (Utility-first, responsive design)
- **State Management**: Zustand (with Persist middleware)
- **Drag & Drop**: @dnd-kit (Modern, accessible, performant dnd)
- **Icons**: Lucide React

## 🏃‍♂️ How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd assignment
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` (or the port shown in terminal) to view the app.

4.  **Build for Production**
    ```bash
    npm run build
    ```

## 📁 Project Structure

- `src/store/useSheetStore.js`: Zustand store handling all global state and business logic (CRUD, Reordering, Notes, Bookmarks).
- `src/components/`: Modular components (TopicCard, SubTopicCard, QuestionItem, Modals).
- `src/data/sampleData.js`: Initial dataset (Striver SDE Sheet).
- `src/pages/SheetPage.jsx`: Main application layout and drag-and-drop context.

---
*Created for the Codolio Frontend Assignment.*
