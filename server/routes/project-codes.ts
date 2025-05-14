// routes/projectCode.ts
import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const prisma = new PrismaClient();

const projectCodeRoute = new Hono();

// Schema for validation
const projectCodeSchema = z.object({
  code: z.string().min(1, 'Project code is required').max(30, 'Project code must be less than 30 characters'),
});

// Create
projectCodeRoute.post('/', zValidator('json', projectCodeSchema), async (c) => {
  try {
    const { code } = c.req.valid('json');
    
    // Check if code already exists
    const existing = await prisma.projectCode.findFirst({
      where: { code },
    });
    
    if (existing) {
      return c.json({ error: 'Project code already exists' }, 400);
    }
    
    const project = await prisma.projectCode.create({
      data: { code },
    });
    
    return c.json(project, 201);
  } catch (err) {
    console.error('Error creating project code:', err);
    return c.json({ error: 'Failed to create project code' }, 500);
  }
});

// Read All with Search and Sort
projectCodeRoute.get('/', async (c) => {
  try {
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
  } catch (err) {
    console.error('Error fetching project codes:', err);
    return c.json({ error: 'Failed to fetch project codes' }, 500);
  }
});

// Read One
projectCodeRoute.get('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid project code ID' }, 400);
    }
    
    const project = await prisma.projectCode.findUnique({ where: { id } });
    
    if (!project) {
      return c.json({ error: 'Project code not found' }, 404);
    }
    
    return c.json(project);
  } catch (err) {
    console.error('Error fetching project code:', err);
    return c.json({ error: 'Failed to fetch project code' }, 500);
  }
});

// Update
projectCodeRoute.put('/:id', zValidator('json', projectCodeSchema), async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid project code ID' }, 400);
    }
    
    const { code } = c.req.valid('json');
    
    // Check if ID exists
    const project = await prisma.projectCode.findUnique({
      where: { id },
    });
    
    if (!project) {
      return c.json({ error: 'Project code not found' }, 404);
    }
    
    // Check if updated code already exists (except for this ID)
    const existing = await prisma.projectCode.findFirst({
      where: { 
        code,
        id: { not: id }
      },
    });
    
    if (existing) {
      return c.json({ error: 'Project code already exists' }, 400);
    }
    
    const updated = await prisma.projectCode.update({
      where: { id },
      data: { code },
    });
    
    return c.json(updated);
  } catch (err) {
    console.error('Error updating project code:', err);
    return c.json({ error: 'Failed to update project code' }, 500);
  }
});

// Delete
projectCodeRoute.delete('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid project code ID' }, 400);
    }
    
    // Check if ID exists
    const project = await prisma.projectCode.findUnique({
      where: { id },
    });
    
    if (!project) {
      return c.json({ error: 'Project code not found' }, 404);
    }
    
    // Check if the project code is used by any assets
    const assetCount = await prisma.asset.count({
      where: { projectCode_id: id },
    });
    
    if (assetCount > 0) {
      return c.json({ 
        error: 'Cannot delete project code that is in use', 
        assetCount 
      }, 400);
    }
    
    await prisma.projectCode.delete({ 
      where: { id } 
    });
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Error deleting project code:', err);
    return c.json({ error: 'Failed to delete project code' }, 500);
  }
});

export default projectCodeRoute;
