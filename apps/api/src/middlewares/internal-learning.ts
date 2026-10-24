import type { MiddlewareHandler } from 'hono';

export const internalLearning: MiddlewareHandler = async (context, next) => {
  const pathname = context.req.path;
  const retiredEndpoint = /^\/(widgets|org-site)(\/|$)/.test(pathname);
  const publicCatalog = /^\/organization\/(courses|tags)\/public\/?$/.test(pathname);

  const publicSales = /^\/course\/(slug\/|[^/]+\/payment-request(?:\/|$))/.test(pathname);

  if (retiredEndpoint || publicCatalog || publicSales) {
    return context.json({ success: false, error: 'Not found' }, 404);
  }

  await next();
};
