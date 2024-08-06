export const ROUTE = {
  HOME: '/',
  BONDS: '/bonds',
  ISSUE_BOND: '/issue-bond',
  PORTFOLIO: '/portfolio',
} as const;

export type ROUTE_KEY = keyof typeof ROUTE;

export const MAPPING_ROUTE_TITLE = {} as unknown as Record<ROUTE_KEY, string>;
