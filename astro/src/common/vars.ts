const siteUrl = import.meta.env.SITE;

export const prirenderUrl = new URL('prirender/', siteUrl);
export const postrenderUrl = new URL('postrender/', siteUrl);
