import type { APIRoute } from 'astro';
import { db, eq } from 'astro:db';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    await db.delete('categories').where(eq('categories.id', id));
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Error deleting category', { status: 500 });
  }
};