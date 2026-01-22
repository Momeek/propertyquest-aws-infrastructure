const developmentUrl = process.env.NEXT_PUBLIC_CLIENT_LOCALHOST_URL;
const productionUrl = process.env.NEXT_PUBLIC_CLIENT_PROD_URL;
export const vercelEnv = process.env.VERCEL_ENV;
// const previewUrl = process.env.PREVIEW_URL;

export const nodeEnv = process.env.NODE_ENV;
const apiDevUrl = process.env.NEXT_PUBLIC_API_LOCALHOST_URL;
const apiProdUrl = process.env.NEXT_PUBLIC_API_PROD_URL;

export const baseUrl =
  vercelEnv === "production"
    ? productionUrl
    : vercelEnv === "preview"
    ? developmentUrl
    : developmentUrl;

export const base2Url =
  vercelEnv === "production" || nodeEnv === "production"
    ? apiProdUrl
    : apiDevUrl;
