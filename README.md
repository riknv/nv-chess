# ♟️ nv-chess 

> A modern, highly interactive web-based Chess application built with Angular 19.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031.svg?style=flat&logo=angular)](https://angular.dev/)
[![Nx](https://img.shields.io/badge/Nx-Workspace-143055.svg?style=flat&logo=nx)](https://nx.dev/)
[![Chessground](https://img.shields.io/badge/Chessground-v9-green.svg)](https://github.com/lichess-org/chessground)

Welcome to **nv-chess**, a beautifully crafted chess interface designed for an optimal playing and learning experience. With a sleek dark-themed UI, responsive design, and powerful engine integration, this project is built for both casual players and developers interested in modern web application architecture.

## ✨ Features

- **Professional & Distraction-Free UI:** A curated dark-themed aesthetic that minimizes distractions and focuses entirely on the board.
- **Interactive Chessboard:** Powered by Lichess's robust `chessground` library, offering smooth animations, legal move highlights, and accessible piece movement.
- **Stockfish Engine Integration:** Analyze your games or play against the engine directly in your browser.
- **FEN Import/Export:** Easily set up specific board positions or start custom matches.
- **Responsive Layout:** Fully optimized for desktops, tablets, and mobile devices—ensuring your elements never overlap.
- **Server-Side Rendering (SSR) Ready:** Built with Angular 19's capabilities to maintain lightning-fast load times.

## 🚀 Technologies

This project uses an Nx Workspace and takes advantage of Angular's standalone components paradigm.

- **Framework:** [Angular 19](https://angular.dev/) (Standalone)
- **Board Interface:** [Chessground](https://github.com/lichess-org/chessground)
- **Styling:** Tailwind CSS / Modular SCSS
- **Build System:** [Nx](https://nx.dev/)
- **Testing:** [Jest](https://jestjs.io/)

## 🛠️ Getting Started

Follow these steps to get the environment up and running locally.

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nv-chess.git
   cd nv-chess
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

Start the development server using the Nx CLI:

```bash
npx nx serve chess
# OR
npm start
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any source files.

## 🏗️ Building & Testing

To build the project for production:

```bash
npx nx build chess
# OR
npm run build
```

To run unit tests:

```bash
npx nx test chess
# OR
npm run test
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/nv-chess/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
