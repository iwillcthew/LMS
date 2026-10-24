import { describe, expect, it } from 'vitest';
import { Hono } from 'hono';
import { internalLearning } from './internal-learning';

describe('internal learning surfaces', () => {
  const app = new Hono().use('*', internalLearning).get('*', (context) => context.text('ok'));

  it.each([
    '/course/slug/example',
    '/course/123/payment-request',
    '/widgets/demo',
    '/org-site/course/demo',
    '/org-site/og/mp',
    '/organization/courses/public',
    '/organization/tags/public'
  ])('retires %s', async (pathname) => {
    const response = await app.request(pathname);
    expect(response.status).toBe(404);
  });

  it.each(['/api/auth/get-session', '/invite/test', '/account', '/course/123', '/organization/first'])(
    'preserves %s',
    async (pathname) => {
      const response = await app.request(pathname);
      expect(response.status).toBe(200);
    }
  );
});
