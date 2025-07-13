import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import type { Env } from 'hono';

const createOpenApiHono = <E extends Env = Env>() =>
  new OpenAPIHono<E>({
    strict: false,
    defaultHook: (result) => {
      if (!result.success) {
        if (result.error.name === 'ZodError') {
          throw new HTTPException(400, {
            res: new Response(JSON.stringify({ error: 'Invalid request' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }),
          });
        }
        throw new HTTPException(500, {
          res: new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          ),
        });
      }
    },
  });

export default createOpenApiHono;
