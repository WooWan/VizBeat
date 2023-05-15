export const musicKey = {
  all: ['music'] as const,
  details: () => [...musicKey.all, 'details'] as const,
  detail: (id: string) => [...musicKey.all, 'detail', id] as const
};
