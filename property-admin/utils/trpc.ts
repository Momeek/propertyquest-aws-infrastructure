import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { useCurrentAdminStore } from '@/store/auth.store';
import { base2Url } from './baseUrl';

const getAuthToken = () => useCurrentAdminStore.getState().token;

export const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: `${base2Url}/admin/trpc`,
      headers() {
        return {
          authorization: `Bearer ${getAuthToken()}`,
        };
      },
    }),
  ],
});
