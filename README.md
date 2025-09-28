# Loan Eligibility Simulator

This project is a React + TypeScript app scaffolded with Vite. Below are concise instructions to build, run, and test it locally and via Docker.

## Prerequisites
- Node.js 20.x and npm
- Docker (for containerized build/run)

## Local development
1) Install dependencies

```bash
npm ci
```

2) Start the dev server

```bash
npm run dev
```

The dev server runs on http://localhost:5173 by default.

## Local production build

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

Then open http://localhost:5173.

## Testing

```bash
npm test
```

- Watch mode: `npm run test:watch`
- Lint: `npm run lint`
- Format: `npm run format:check` or `npm run format`

## Docker
This repository includes a multi-stage Dockerfile that builds the production bundle and serves it with nginx.

### Build the image

```bash
docker build -t loan-eligibility-simulator:latest .
```

### Run the container

```bash
# Map host port 5173 to container port 80
docker run -it --rm -p 5173:80 loan-eligibility-simulator:latest
```

Now open http://localhost:5173.

Notes:
- The runtime image is nginx serving the compiled `dist/` folder.
- Client-side routing is supported via nginx fallback to `index.html`.
- Mock Service Worker (MSW) is only enabled in development mode; the production image does not start MSW.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
