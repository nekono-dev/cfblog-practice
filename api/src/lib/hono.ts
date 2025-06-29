import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import type { Env } from 'hono';

const createOpenApiHono = <E extends Env = Env>() =>
  new OpenAPIHono<E>({
    strict: true,
    defaultHook: (result) => {
      if (!result.success) {
        throw new HTTPException(401, {
          res: new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }),
        });
      }
    },
  });

export default createOpenApiHono;
