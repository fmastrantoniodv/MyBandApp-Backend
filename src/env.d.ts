declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URL: string;
      DB_USER: string;
      DB_PASS: string;
      DB_APP_NAME: string;
      ALLOWED_DOMAINS: string;
      ACTIVE_PLAN_LIST: string;
      SENDGRID_API_KEY: string;
      PLAN_LIST: string;
    }
  }
  