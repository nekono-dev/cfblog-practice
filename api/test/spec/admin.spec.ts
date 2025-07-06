// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { usersPrivURL, usersTokenURL } from './urls';
import { adminHandle, adminPasswd, adminName } from './param';

describe('Admin Control test', () => {
  let adminToken: string;
  it('🟢[Positive] Get Admin token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: adminHandle,
        passwd: adminPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    adminToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[log] Admin Token: ' + adminToken);
  });
  it('🟢[Positive] Get Admin User Profile', async () => {
    const response = await fetch(new URL(adminHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: adminHandle,
      name: adminName,
      birthday: '1900-01-01T00:00:00.000Z',
    });
    console.log('[admin|log] Admin Profile: ' + JSON.stringify(apiResult));
  });
});
