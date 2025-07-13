// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { usersTokenURL, usersPrivURL } from '../common/urls';
import {
  adminHandle,
  adminPasswd,
  anonyUserHandle,
  anonyUserPasswd,
} from '../common/param';

describe('Anony user NO Control test', () => {
  it('🔴[Negative] Cannot get Token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: anonyUserHandle,
        passwd: anonyUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      error: 'Login not permitted',
    });
  });

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
  });

  it('🔴[Negative] Cannot get anony Profile', async () => {
    const response = await fetch(new URL(anonyUserHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({ error: 'User not found' });
  });
});
