// routes/locationDesc.ts
import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client";


const locationRoute = new Hono();
const prisma = new PrismaClient();

// Create
locationRoute.post('/', async (c) => {
  const { description } = await c.req.json();
  try {
    const location = await prisma.locationDesc.create({
      data: { description },
    });
    return c.json(location, 201);
  } catch (err) {
    return c.json({ error: 'Failed to create location description' }, 400);
  }
});

// GET /api/locations?search=abc&sort=asc
locationRoute.get('/', async (c) => {
    const search = c.req.query('search') || '';
    const sort = c.req.query('sort') === 'desc' ? 'desc' : 'asc';
  
    const locations = await prisma.locationDesc.findMany({
      where: {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        description: sort,
      },
    });
  
    return c.json(locations);
  });
  

// Read One
locationRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const location = await prisma.locationDesc.findUnique({ where: { id } });

  if (!location) {
    return c.json({ error: 'Location not found' }, 404);
  }

  return c.json(location);
});

// Update
locationRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { description } = await c.req.json();

  try {
    const updated = await prisma.locationDesc.update({
      where: { id },
      data: { description },
    });
    return c.json(updated);
  } catch (err) {
    return c.json({ error: 'Failed to update location description' }, 400);
  }
});

// Delete
locationRoute.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    await prisma.locationDesc.delete({ where: { id } });
    return c.json({ message: 'Deleted successfully' });
  } catch (err) {
    return c.json({ error: 'Failed to delete location description' }, 400);
  }
});

export default locationRoute;
