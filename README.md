# vite-plugin-use-hook-mock

 > Vite plugin to auto-swap use- hook imports with .mock siblings when they exist.

**vite-plugin-use-hook-mock** helps you seamlessly mock your React hooks int tests and in Storybook stories. Any import matching the `use-<something>` naming convention will be redirected to `use-<something>.mock.ts(x)` if a mock file exists alongside the real hook. Otherwise, it falls back to the actual implementation.

## 📦 Installation

``` bash
npm install --save-dev vite-plugin-use-hook-mock
# or
yarn add -D vite-plugin-use-hook-mock
# or
pnpm add -D vite-plugin-use-hook-mock
```

## ⚙️ Usage in a Vite Project

Add the plugin to your `vite.config.ts` before other plugins. For production or development, you typically won't enable the mock plugin. Instead, conditionally apply it when running tests:

``` ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import useHookMockPlugin from 'vite-plugin-use-hook-mock';

export default defineConfig(() => {
  const isTest = process.env.NODE_ENV === 'test';

  return {
    plugins: [
      // Only enable mock plugin when testing
      isTest && useHookMockPlugin(),
      react(),
    ].filter(Boolean),
  };
});
``` 

## 🧪 Usage in Tests and Storybook

Since Storybook runs Vite in development mode by default, you can force NODE_ENV=test when starting Storybook so that the mock plugin kicks in:

Update your package.json scripts:

``` json
{
  "scripts": {
    "storybook": "cross-env NODE_ENV=test storybook dev -p 6006"
  }
}

```

Now, when you run:

```bash
npm run storybook
```

Storybook starts with `NODE_ENV=test`, Vite loads the mock plugin, and any hook import, such as `use-foo.tsx`, will resolve to `use-foo.mock.tsx` if it exists.

## 🔧 Plugin Options

| Option        | Type      | Default	                          | Description                                         |
|---------------|-----------|-----------------------------------|-----------------------------------------------------|
| extensions	  | string[]  | `['.ts', '.tsx', '.js', '.jsx']`	| File extensions to try when looking for mock files  |
| hookPattern	  | RegExp    | `/(^	/)use-[^/]+$/`              | Regex to identify hook imports (without extension)  |

## 📂 Example Project Structure

```
src/
  hooks/
    use-fetch.ts         # real hook implementation
    use-fetch.mock.ts    # mock used during dev/Storybook/Vitest
  components/
    MyComponent.tsx      # imports useFetch

vite.config.ts           # includes conditional useHookMockPlugin
.storybook/
  main.ts                # conditional mock plugin in viteFinal
```

In your component:

```ts
import { useFetch } from '../hooks/use-fetch';

export function MyComponent() {
  const { data } = useFetch('/api/data');
  return <div>{data}</div>;
}
```

During tests or Storybook, if `use-fetch.mock.ts` exists, it will be used instead of making real network calls.

## 🤝 Contributing

Fork the repository

Create your feature branch (`git checkout -b feature/foo`)

Commit your changes (`git commit -am 'Add some foo'`)

Push to the branch (`git push origin feature/foo`)

Open a Pull Request

Please adhere to the existing code style and add tests as necessary.

## 🗎 License

This project is licensed under the MIT License. See the LICENSE file for details.

