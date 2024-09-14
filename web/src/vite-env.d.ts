/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAN_STACK_DEV_TOOLS?: string;
  readonly VITE_REACT_STRICT_MODE?: string;
  readonly VITE_BUILD_DATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
