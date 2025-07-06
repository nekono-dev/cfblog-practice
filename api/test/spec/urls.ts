const baseUrl = new URL('http://localhost:8787');

export const usersTokenURL = new URL('users/token/', baseUrl);
export const usersURL = new URL('users/', baseUrl);
export const usersPrivURL = new URL('users/', baseUrl);
export const imagesURL = new URL('images/', baseUrl);
export const imagesPrivURL = new URL('images/', baseUrl);
export const pagesURL = new URL('pages/', baseUrl);
export const pagesPrivURL = new URL('pages/', baseUrl);
