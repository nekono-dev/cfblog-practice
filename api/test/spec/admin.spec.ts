// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Admin Control test', () => {
  const adminHandle = 'admin';
  const adminName = 'Administrator';

  let adminToken: string;
  it('[Positive] Get Admin token', async () => {
    const response = await fetch('http://localhost:8787/users/token', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: 'admin',
        passwd: 'admin',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    adminToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[log] Admin Token: ' + adminToken);
  });
  it('[Positive] Get Other User Profile', async () => {
    const response = await fetch(
      'http://localhost:8787/s/users/' + adminHandle,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
      }
    );
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: adminHandle,
      name: adminName,
      birthday: '1900-01-01T00:00:00.000Z',
    });
    console.log('[log] Admin Profile: ' + JSON.stringify(apiResult));
  });

  const testPageId = 'testpage';
  it('[Positive] Post New Page', async () => {
    const response = await fetch('http://localhost:8787/s/pages', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: testPageId,
        title: 'TestPage',
        text: 'TestText',
        tags: ['test'],
        date: '2000-01-01',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page created',
    });
  });
  it('[Positive] Get Created Page', async () => {
    const response = await fetch('http://localhost:8787/pages/' + testPageId, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      pageId: testPageId,
      title: 'TestPage',
      text: 'TestText',
      imgId: null,
      tags: ['test'],
      date: '2000-01-01T00:00:00.000Z',
    });
    console.log('[log] ' + testPageId + ' :' + JSON.stringify(apiResult));
  });
});
