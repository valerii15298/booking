/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAN_STACK_DEV_TOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
