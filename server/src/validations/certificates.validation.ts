import { z } from 'zod';
import { certificateMessages } from '~/constants/messages';

export const issueCertificateSchema = z.object({
  body: z.object({
    course_id: z.string().length(24, { message: certificateMessages.COURSE_ID_INVALID}),
  }),
});
