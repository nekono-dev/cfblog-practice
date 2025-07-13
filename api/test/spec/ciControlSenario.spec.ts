import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { pagesPrivURL, adminURL, usersTokenURL } from '../common/urls';

import { adminHandle, adminPasswd, ciUserHandle } from '../common/param';

describe('CI Control Scenario test', () => {
  let adminToken: string;
  it('🟢[Positive] Admin login to get token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        handle: adminHandle,
        passwd: adminPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    adminToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[ciControl] Admin token: ' + adminToken);
  });

  const ciTestPageId = 'ci-testpage';
  const ciTestTitle = 'CI test';

  it('🟢[Positive] Create test page for CI', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: ciTestPageId,
        title: ciTestTitle,
        text: 'This is a CI-visible test page.',
        tags: ['ci', 'test'],
        date: '2025-07-13',
        isPublic: true,
      }),
    });
    const apiResult = z
      .object({ message: z.string() })
      .parse(await response.json());
    expect(apiResult.message).toBe('Page created');
  });

  let ciToken: string;
  it(`🟢[Positive] Admin generates token for CI user (${ciUserHandle})`, async () => {
    const response = await fetch(
      new URL('users/' + ciUserHandle + '/token', adminURL),
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify({
          exp: 60 * 60 * 24 * 365,
        }),
      }
    );
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    ciToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[ciControl] CI token: ' + ciToken);
  });

  it('🟢[Positive] CI user requests page list with token', async () => {
    const listSchema = z.object({
      pages: z
        .object({
          pageId: z.string(),
          title: z.string(),
          text: z.string().nullable(),
          imgId: z.string().nullable(),
          date: z.string(), // ISO8601 形式なら z.string() でOK
          tags: z.array(z.string()),
        })
        .array(),
    });

    const response = await fetch(new URL('list', pagesPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + ciToken,
      },
    });
    const apiResult = listSchema.parse(await response.json());
    expect(apiResult).toHaveProperty('pages');
    expect(Array.isArray(apiResult.pages)).toBe(true);

    const pageIds = apiResult.pages.map((p) => p.pageId);
    expect(pageIds).toContain(ciTestPageId);
    console.log(`[ciControl] CI list includes test page: ${ciTestPageId}`);
  });

  it('🟢[Positive] Delete test page for CI', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: [ciTestPageId],
        option: {
          deleteImage: true,
        },
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page deleted',
    });
  });
});
