import { TopLevelCategory } from 'src/top-page/top-page.model';

type RouteMapType = Record<TopLevelCategory, string>;

export const CategoryURL: RouteMapType = {
  [TopLevelCategory.Courses]: '/courses',
  [TopLevelCategory.Services]: '/services',
  [TopLevelCategory.Books]: '/books',
  [TopLevelCategory.Products]: '/products',
};
