/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_ALLOWED_DOMAIN: string
    readonly PROD: boolean
    readonly DEV: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
