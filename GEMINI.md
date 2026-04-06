# GEMINI.md

## Project Overview

**Project Name:** `chess` (internal) / `@chess/source` (package)
**Type:** Angular 19 Application (Standalone)
**Workspace:** Nx (Monorepo-style structure, though currently a single app)
**Purpose:** A chess-related application leveraging the `chessground` library for the chessboard interface.

### Main Technologies
- **Angular 19:** Modern Angular with standalone components and `afterNextRender` for SSR compatibility.
- **Chessground (v9):** Powerful, accessible, and lightweight chessboard interface.
- **Bootstrap 5:** Utility-first styling via `bootstrap-reboot`, `bootstrap-utilities`, and `bootstrap-grid`.
- **Nx:** Advanced build system and task runner for the project.
- **Jest:** Testing framework for unit and integration tests.
- **Server-Side Rendering (SSR):** Enabled using `@angular/ssr` and Express for performance and SEO.

### Architecture
- **App Structure:** Standard Angular standalone layout in `src/app/`.
- **Components:**
  - `AppComponent`: Main application shell.
  - `LayoutComponent`: Common UI layout (e.g., headers, footers).
  - `PlaygroundComponent`: The core playground area where the `chessground` board is rendered.
- **Styling:**
  - `src/styles.scss`: Main entry point for styles, importing Bootstrap and chess-specific CSS.
  - `src/styles/`: Contains modular CSS for chess features (3D boards, themes, etc.).
  - `src/styles/images/`: Stores board and piece assets (SVG/PNG).

## Building and Running

The project uses `nx` for task management. Standard npm scripts are also provided.

- **Start Development Server:**
  ```bash
  nx serve
  # OR
  npm start
  ```
- **Build Production Bundle:**
  ```bash
  nx build
  # OR
  npm run build
  ```
- **Run Tests:**
  ```bash
  nx test
  # OR
  npm run test
  ```
- **Lint Code:**
  ```bash
  nx lint
  ```
- **Serve Static Files:**
  ```bash
  nx serve-static chess
  ```

## Development Conventions

- **Angular Standalone:** Components, directives, and pipes are standalone.
- **SSR-Friendly Integration:** Since SSR is enabled, avoid direct DOM access outside of lifecycle hooks like `afterNextRender` (as seen in `PlaygroundComponent`).
- **Styling Hierarchy:** Use Bootstrap for general layouts/utilities and the `src/styles/` directory for chessboard-specific theming.
- **Naming Conventions:**
  - Project prefix: `nv-` (configured in `project.json`).
  - Standard Angular file naming (`component.ts`, `component.html`, `component.scss`).
- **Workspace Tooling:** Use `nx g` commands for generating new features to maintain workspace consistency.

## AI Agent Permissions

- **Full Access:** The AI agent (Gemini CLI) is explicitly authorized to perform any action, modification, creation, or deletion of files within this repository as needed to fulfill user requests. No actions are restricted.
