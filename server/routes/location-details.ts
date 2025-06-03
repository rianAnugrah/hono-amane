// routes/locationDesc.ts
import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const detailsLocationRoute = new Hono();

// Create
detailsLocationRoute.post('/', async (c) => {
  const { description } = await c.req.json();
  try {
    const detail = await prisma.detailsLocation.create({
      data: { description },
    });
    return c.json(detail, 201);
  } catch (error) {
    console.error('Error creating details location:', error);
    return c.json({ error: 'Failed to create details location' }, 400);
  }
});

// Read All
detailsLocationRoute.get('/', async (c) => {
  const details = await prisma.detailsLocation.findMany();
  return c.json(details);
});

// Read One
detailsLocationRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const detail = await prisma.detailsLocation.findUnique({ where: { id } });

  if (!detail) {
    return c.json({ error: 'Details location not found' }, 404);
  }

  return c.json(detail);
});

// Update
detailsLocationRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { description } = await c.req.json();

  try {
    const updated = await prisma.detailsLocation.update({
      where: { id },
      data: { description },
    });
    return c.json(updated);
  } catch (error) {
    console.error('Error updating details location:', error);
    return c.json({ error: 'Failed to update details location' }, 400);
  }
});

// Delete
detailsLocationRoute.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    await prisma.detailsLocation.delete({ where: { id } });
    return c.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting details location:', error);
    return c.json({ error: 'Failed to delete details location' }, 400);
  }
});

export default detailsLocationRoute;
