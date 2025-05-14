// routes/locationDesc.ts
import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const locationRoute = new Hono();
const prisma = new PrismaClient();

// Schema for validation
const locationSchema = z.object({
  description: z.string().min(1, 'Location description is required').max(255, 'Location description must be less than 255 characters'),
});

// Create
locationRoute.post('/', zValidator('json', locationSchema), async (c) => {
  try {
    const { description } = c.req.valid('json');
    
    // Check if description already exists
    const existing = await prisma.locationDesc.findFirst({
      where: { description },
    });
    
    if (existing) {
      return c.json({ error: 'Location description already exists' }, 400);
    }
    
    const location = await prisma.locationDesc.create({
      data: { description },
    });
    
    return c.json(location, 201);
  } catch (err) {
    console.error('Error creating location:', err);
    return c.json({ error: 'Failed to create location description' }, 500);
  }
});

// GET /api/locations?search=abc&sort=asc
locationRoute.get('/', async (c) => {
  try {
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
  } catch (err) {
    console.error('Error fetching locations:', err);
    return c.json({ error: 'Failed to fetch locations' }, 500);
  }
});

// Read One
locationRoute.get('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid location ID' }, 400);
    }
    
    const location = await prisma.locationDesc.findUnique({ where: { id } });
    
    if (!location) {
      return c.json({ error: 'Location not found' }, 404);
    }
    
    return c.json(location);
  } catch (err) {
    console.error('Error fetching location:', err);
    return c.json({ error: 'Failed to fetch location' }, 500);
  }
});

// Update
locationRoute.put('/:id', zValidator('json', locationSchema), async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid location ID' }, 400);
    }
    
    const { description } = c.req.valid('json');
    
    // Check if location exists
    const location = await prisma.locationDesc.findUnique({
      where: { id },
    });
    
    if (!location) {
      return c.json({ error: 'Location not found' }, 404);
    }
    
    // Check if updated description already exists (except for this ID)
    const existing = await prisma.locationDesc.findFirst({
      where: { 
        description,
        id: { not: id }
      },
    });
    
    if (existing) {
      return c.json({ error: 'Location description already exists' }, 400);
    }
    
    const updated = await prisma.locationDesc.update({
      where: { id },
      data: { description },
    });
    
    return c.json(updated);
  } catch (err) {
    console.error('Error updating location:', err);
    return c.json({ error: 'Failed to update location description' }, 500);
  }
});

// Delete
locationRoute.delete('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid location ID' }, 400);
    }
    
    // Check if location exists
    const location = await prisma.locationDesc.findUnique({
      where: { id },
    });
    
    if (!location) {
      return c.json({ error: 'Location not found' }, 404);
    }
    
    // Check if the location is used by any assets
    const assetCount = await prisma.asset.count({
      where: { locationDesc_id: id },
    });
    
    if (assetCount > 0) {
      return c.json({ 
        error: 'Cannot delete location that is in use by assets', 
        assetCount 
      }, 400);
    }
    
    // Check if the location is used by any user locations
    const userLocationCount = await prisma.userLocation.count({
      where: { locationId: id },
    });
    
    if (userLocationCount > 0) {
      return c.json({ 
        error: 'Cannot delete location that is assigned to users', 
        userLocationCount 
      }, 400);
    }
    
    // Check if the location is used by any asset audits
    const assetAuditCount = await prisma.assetAudit.count({
      where: { locationId: id },
    });
    
    if (assetAuditCount > 0) {
      return c.json({ 
        error: 'Cannot delete location that is used in asset audits', 
        assetAuditCount 
      }, 400);
    }
    
    await prisma.locationDesc.delete({ where: { id } });
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Error deleting location:', err);
    return c.json({ error: 'Failed to delete location description' }, 500);
  }
});

export default locationRoute;
