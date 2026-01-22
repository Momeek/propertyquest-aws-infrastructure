import axios, { AxiosError } from "axios";
import { useCurrentAdminStore } from "@/store/auth.store";
import axiosRetry from "axios-retry";
import axiosRateLimit from "axios-rate-limit";
import { base2Url } from "@/utils/baseUrl";

const getRequestConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const assertValidToken = (token: string) => {
  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('No valid token set');
  }
};


// Create a rate-limited instance of Axios
const http = axiosRateLimit(
  axios.create({
    baseURL: base2Url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }),
  { maxRequests: 5, perMilliseconds: 1000 } // 5 requests per second
);

// Retry on failure with exponential backoff
axiosRetry(http, {
  retries: 1, // Retry 3 times before failing
  retryDelay: (retryCount) => {
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    // Retry only if it's a 429 or 5xx error
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

http.interceptors.response.use(
  (response) => {
    if (response.headers["x-refresh-token"]) {
      const token = response.headers["x-refresh-token"];
      useCurrentAdminStore.getState().setToken(token);
      document.cookie = `admin_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
    }
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message?.includes("[TokenError]")) {
        const logout = useCurrentAdminStore.getState().logout;
        logout();
        document.cookie =
      'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    return Promise.reject(error);
  }
);

export const useClient = () => {
  const token = useCurrentAdminStore((state: { token: string | null }) => String(state.token));
  const postRequest = async <T>(
    uri: string,
    payload: T,
    useToken: boolean = true
  ) => {
    const config = useToken ? getRequestConfig(token) : {};
    return http.post(uri, payload, config);
  };

  const multiPartPostRequest = async <T>(uri: string, payload: T) => {
    assertValidToken(token);
    return http.post(uri, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const getRequest = async (uri: string) => {
    assertValidToken(token);
    return http.get(uri, getRequestConfig(token));
  };

  const putRequest = async <T>(uri: string, payload: T) => {
    assertValidToken(token);
    return http.put(uri, payload, getRequestConfig(token));
  };

  const deleteRequest = async (uri: string) => {
    assertValidToken(token);
    return http.delete(uri, getRequestConfig(token));
  };

  return {
    post: postRequest,
    multiPartPost: multiPartPostRequest,
    get: getRequest,
    put: putRequest,
    delete: deleteRequest,
  };
};
