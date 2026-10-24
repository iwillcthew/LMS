import { beforeEach, describe, expect, it, vi } from 'vitest';

const queries = vi.hoisted(() => ({
  getFirstOrganization: vi.fn(),
  checkEmailExistsInOrg: vi.fn(),
  hasActiveOrganizationInviteForEmail: vi.fn()
}));

vi.mock('@db/queries/organization', () => queries);

import { enforceInternalRegistration } from '@cio/db/auth/hooks/internal-registration';

describe('internal registration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('LMS_ALLOWED_EMAILS', '');
    queries.getFirstOrganization.mockResolvedValue({ id: 'mp' });
    queries.checkEmailExistsInOrg.mockResolvedValue(false);
    queries.hasActiveOrganizationInviteForEmail.mockResolvedValue(false);
  });

  it('denies unknown email addresses', async () => {
    await expect(enforceInternalRegistration({ email: 'outsider@example.com' })).rejects.toThrow();
  });

  it('denies unapproved bootstrap accounts', async () => {
    queries.getFirstOrganization.mockResolvedValue(null);
    await expect(enforceInternalRegistration({ email: 'outsider@example.com' })).rejects.toThrow();
  });

  it('accepts an exact, normalized bootstrap email', async () => {
    vi.stubEnv('LMS_ALLOWED_EMAILS', ' Admin@Example.com ');
    await expect(enforceInternalRegistration({ email: 'admin@example.com' })).resolves.toBeUndefined();
    expect(queries.getFirstOrganization).not.toHaveBeenCalled();
  });

  it('does not accept a suffix match', async () => {
    vi.stubEnv('LMS_ALLOWED_EMAILS', 'admin@example.com');
    await expect(enforceInternalRegistration({ email: 'fakeadmin@example.com' })).rejects.toThrow();
  });

  it('accepts an active invitation', async () => {
    queries.hasActiveOrganizationInviteForEmail.mockResolvedValue(true);
    await expect(enforceInternalRegistration({ email: 'employee@example.com' })).resolves.toBeUndefined();
  });

  it('accepts a pre-provisioned member', async () => {
    queries.checkEmailExistsInOrg.mockResolvedValue(true);
    await expect(enforceInternalRegistration({ email: 'employee@example.com' })).resolves.toBeUndefined();
  });

  it('fails closed when organization lookup fails', async () => {
    queries.getFirstOrganization.mockRejectedValue(new Error('Database unavailable'));
    await expect(enforceInternalRegistration({ email: 'employee@example.com' })).rejects.toThrow(
      'Database unavailable'
    );
  });
});
