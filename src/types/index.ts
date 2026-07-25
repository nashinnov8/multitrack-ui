import { z } from "zod";

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    isLast: z.boolean(),
  });

export type PaginatedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
};
