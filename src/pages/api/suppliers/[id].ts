import type { APIRoute } from 'astro';
import { db, eq } from 'astro:db';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    await db.delete('suppliers').where(eq('suppliers.id', id));
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Error deleting supplier', { status: 500 });
  }
};