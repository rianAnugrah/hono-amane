// routes/projectCode.ts
import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projectCodeRoute = new Hono();

// Create
projectCodeRoute.post('/', async (c) => {
  const { code } = await c.req.json();
  try {
    const project = await prisma.projectCode.create({
      data: { code },
    });
    return c.json(project, 201);
  } catch (err) {
    return c.json({ error: 'Failed to create project code' }, 400);
  }
});

// Read All with Search and Sort
projectCodeRoute.get('/', async (c) => {
    const url = new URL(c.req.url);
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'id';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
  
    const projects = await prisma.projectCode.findMany({
      where: {
        code: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      orderBy: {
        [sortBy]: order,
      },
    });
  
    return c.json(projects);
  });
  

// Read One
projectCodeRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const project = await prisma.projectCode.findUnique({ where: { id } });

  if (!project) {
    return c.json({ error: 'Project code not found' }, 404);
  }

  return c.json(project);
});

// Update
projectCodeRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { code } = await c.req.json();

  try {
    const updated = await prisma.projectCode.update({
      where: { id },
      data: { code },
    });
    return c.json(updated);
  } catch (err) {
    return c.json({ error: 'Failed to update project code' }, 400);
  }
});

// Delete
projectCodeRoute.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    await prisma.projectCode.delete({ where: { id } });
    return c.json({ message: 'Deleted successfully' });
  } catch (err) {
    return c.json({ error: 'Failed to delete project code' }, 400);
  }
});

export default projectCodeRoute;
