import { customFetch } from '@/lib/api';

export const certificateService = {
  getUserCertificates: async () => {
    return customFetch('/certificates', {
      method: 'GET',
    });
  },

  verifyCertificate: async (certCode: string) => {
    return customFetch(`/certificates/verify/${certCode}`, {
      method: 'GET',
    });
  },
};
