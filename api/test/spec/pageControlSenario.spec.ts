// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  imagesPrivURL,
  imagesURL,
  pagesPrivURL,
  pagesURL,
  usersTokenURL,
} from './urls';

import { adminHandle, adminPasswd } from './param';

describe('Page Control Senario test', () => {
  let adminToken: string;
  it('[Positive] Get Admin token', async () => {
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
    console.log('[pageControlSenario] Admin Token: ' + adminToken);
  });

  let imageKey: string;
  const imageUint8Array = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
  it('[Positive] Post New Image', async () => {
    const response = await fetch(imagesPrivURL, {
      method: 'PUT',
      headers: {
        'Content-type': 'image/png',
        Authorization: 'Bearer ' + adminToken,
      },
      body: imageUint8Array,
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('key');
    imageKey = z.object({ key: z.string() }).parse(apiResult).key;
    console.log('[pageControlSenario] Image key: ' + imageKey);
  });
  // 投稿したイメージが存在し、投稿前と同一であること
  it('[Positive] Get Posted Image', async () => {
    const response = await fetch(new URL(imageKey, imagesURL), {
      method: 'GET',
    });
    const apiResult = await response.arrayBuffer();
    expect(apiResult).toStrictEqual(imageUint8Array.buffer);
  });
  const testPageId = 'testpage';
  it('[Positive] Post New Page', async () => {
    const response = await fetch(pagesPrivURL, {
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
        imgId: imageKey,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page created',
    });
  });
  it('[Positive] Get Created Page', async () => {
    const response = await fetch(new URL(testPageId, pagesURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      pageId: testPageId,
      title: 'TestPage',
      text: 'TestText',
      imgId: imageKey,
      tags: ['test'],
      date: '2000-01-01T00:00:00.000Z',
    });
    console.log(
      '[pageControlSenario] ' + testPageId + ' :' + JSON.stringify(apiResult)
    );
  });
  it('[Positive] Delete Created Page with Image', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: [testPageId],
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
  // Imageが削除されていること
  it('[Negative] Image already deleted by page deletion', async () => {
    const response = await fetch(new URL(imageKey, imagesURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      error: 'Image not found',
    });
    console.log('[pageControlSenario] ' + imageKey + ' not found');
  });
});
