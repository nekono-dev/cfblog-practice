// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  usersTokenURL,
  pagesPrivURL,
  likesURL,
  tagsURL,
  pagesURL,
} from './urls';
import { adminHandle, adminPasswd } from './param';

describe('Tag Operation test', () => {
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

  const testPage1Id = 'operationtest';
  const testTags = ['hoge', 'fuga'];
  const testPage1Tag = testTags;
  // タグ0, タグ1を含むページを作成
  it('🟢[Positive] Create page, include tag0,tag1', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: testPage1Id,
        title: 'TestPage',
        text: 'TestText',
        tags: testPage1Tag,
        date: '2000-01-01',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page created',
    });
  });

  const testPage2Id = 'operationtest2';
  const testPage2Tag = [testTags[1]];
  // タグ1のみを含むページを作成
  it('🟢[Positive] Create page, include tag1 only', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: testPage2Id,
        title: 'TestPage',
        text: 'TestText',
        tags: testPage2Tag,
        date: '2000-01-01',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page created',
    });
  });

  it('🟢[Positive] Get tag0 pagelist', async () => {
    const response = await fetch(new URL(testTags[0], tagsURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toEqual({
      pages: expect.arrayContaining([
        {
          pageId: testPage1Id,
          title: 'TestPage',
          text: 'TestText',
          tags: testPage1Tag,
          date: '2000-01-01T00:00:00.000Z',
          imgId: null,
        },
      ]),
    });
  });

  it('🟢[Positive] Get tag1 pagelist', async () => {
    const response = await fetch(new URL(testTags[1], tagsURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toEqual({
      pages: expect.arrayContaining([
        {
          pageId: testPage1Id,
          title: 'TestPage',
          text: 'TestText',
          tags: testPage1Tag,
          date: '2000-01-01T00:00:00.000Z',
          imgId: null,
        },
        {
          pageId: testPage2Id,
          title: 'TestPage',
          text: 'TestText',
          tags: testPage2Tag,
          date: '2000-01-01T00:00:00.000Z',
          imgId: null,
        },
      ]),
    });
  });

  it('🟢[Positive] Delete Created Pages', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: [testPage1Id, testPage2Id],
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page deleted',
    });
  });

  it('🔴[Negative] Check page deleted', async () => {
    const response = await fetch(new URL(testPage1Id, pagesURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      error: 'Page not found',
    });
  });

  it('🔴[Negative] No pages include tag1', async () => {
    const response = await fetch(new URL(testTags[1], tagsURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      error: 'No pages found',
    });
  });
});
