import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const prisma = new PrismaClient()
const inspections = new Hono()

// Schema for creating an inspection
const createInspectionSchema = z.object({
  inspector_id: z.string().uuid(),
  date: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional()
})

// Schema for updating an inspection
const updateInspectionSchema = z.object({
  notes: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional()
})

// Schema for adding an item to inspection
const addInspectionItemSchema = z.object({
  inspectionId: z.string().uuid(),
  assetId: z.string().uuid(),
  assetVersion: z.number().int().positive(),
  status: z.enum(['pending', 'inspected', 'failed', 'passed', 'not_applicable']).optional(),
  notes: z.string().optional()
})

// Schema for updating an inspection item
const updateInspectionItemSchema = z.object({
  status: z.enum(['pending', 'inspected', 'failed', 'passed', 'not_applicable']).optional(),
  notes: z.string().optional()
})

// Get all inspections
inspections.get('/', async (c) => {
  try {
    const inspections = await prisma.inspection.findMany({
      include: {
        inspector: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            asset: {
              select: {
                id: true,
                assetNo: true,
                assetName: true,
                condition: true,
                version: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return c.json({ success: true, data: inspections })
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return c.json({ success: false, error: 'Failed to fetch inspections' }, 500)
  }
})

// Get a specific inspection by ID
inspections.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        inspector: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            asset: {
              select: {
                id: true,
                assetNo: true,
                assetName: true,
                condition: true,
                version: true,
                locationDesc: true,
                detailsLocation: true
              }
            }
          }
        }
      }
    })
    
    if (!inspection) {
      return c.json({ success: false, error: 'Inspection not found' }, 404)
    }
    
    return c.json({ success: true, data: inspection })
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return c.json({ success: false, error: 'Failed to fetch inspection' }, 500)
  }
})

// Create a new inspection
inspections.post('/', zValidator('json', createInspectionSchema), async (c) => {
  try {
    const body = await c.req.valid('json')
    
    const inspection = await prisma.inspection.create({
      data: {
        inspector_id: body.inspector_id,
        date: body.date ? new Date(body.date) : new Date(),
        notes: body.notes,
        status: body.status
      }
    })
    
    return c.json({ success: true, data: inspection }, 201)
  } catch (error) {
    console.error('Error creating inspection:', error)
    return c.json({ success: false, error: 'Failed to create inspection' }, 500)
  }
})

// Add an item to an inspection
inspections.post('/items', zValidator('json', addInspectionItemSchema), async (c) => {
  try {
    const body = await c.req.valid('json')
    
    // Check if inspection exists
    const inspection = await prisma.inspection.findUnique({
      where: { id: body.inspectionId }
    })
    
    if (!inspection) {
      return c.json({ success: false, error: 'Inspection not found' }, 404)
    }
    
    // Check if asset exists
    const asset = await prisma.asset.findUnique({
      where: { id: body.assetId }
    })
    
    if (!asset) {
      return c.json({ success: false, error: 'Asset not found' }, 404)
    }
    
    // Create inspection item
    const inspectionItem = await prisma.inspectionItem.create({
      data: {
        inspectionId: body.inspectionId,
        assetId: body.assetId,
        assetVersion: body.assetVersion,
        status: body.status,
        notes: body.notes
      },
      include: {
        asset: {
          select: {
            id: true,
            assetNo: true,
            assetName: true,
            condition: true,
            version: true
          }
        }
      }
    })
    
    return c.json({ success: true, data: inspectionItem }, 201)
  } catch (error) {
    console.error('Error adding inspection item:', error)
    return c.json({ success: false, error: 'Failed to add inspection item' }, 500)
  }
})

// Update an inspection item
inspections.put('/items/:id', zValidator('json', updateInspectionItemSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.valid('json')
    
    const updatedInspectionItem = await prisma.inspectionItem.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes
      },
      include: {
        asset: {
          select: {
            id: true,
            assetNo: true,
            assetName: true,
            condition: true,
            version: true
          }
        }
      }
    })
    
    return c.json({ success: true, data: updatedInspectionItem })
  } catch (error) {
    console.error('Error updating inspection item:', error)
    return c.json({ success: false, error: 'Failed to update inspection item' }, 500)
  }
})

// Delete an inspection item
inspections.delete('/items/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const inspectionItem = await prisma.inspectionItem.delete({
      where: { id }
    })
    
    return c.json({ success: true, data: inspectionItem })
  } catch (error) {
    console.error('Error deleting inspection item:', error)
    return c.json({ success: false, error: 'Failed to delete inspection item' }, 500)
  }
})

// Update an inspection
inspections.put('/:id', zValidator('json', updateInspectionSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.valid('json')
    
    const updatedInspection = await prisma.inspection.update({
      where: { id },
      data: {
        notes: body.notes,
        date: body.date ? new Date(body.date) : undefined,
        status: body.status
      }
    })
    
    return c.json({ success: true, data: updatedInspection })
  } catch (error) {
    console.error('Error updating inspection:', error)
    return c.json({ success: false, error: 'Failed to update inspection' }, 500)
  }
})

// Delete an inspection
inspections.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    await prisma.inspectionItem.deleteMany({
      where: { inspectionId: id }
    })
    
    const inspection = await prisma.inspection.delete({
      where: { id }
    })
    
    return c.json({ success: true, data: inspection })
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return c.json({ success: false, error: 'Failed to delete inspection' }, 500)
  }
})

// Get inspections by status
inspections.get('/status/:status', async (c) => {
  try {
    const status = c.req.param('status')
    
    const inspections = await prisma.inspection.findMany({
      where: { status },
      include: {
        inspector: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            asset: {
              select: {
                id: true,
                assetNo: true,
                assetName: true,
                condition: true,
                version: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return c.json({ success: true, data: inspections })
  } catch (error) {
    console.error('Error fetching inspections by status:', error)
    return c.json({ success: false, error: 'Failed to fetch inspections by status' }, 500)
  }
})

// Get inspection items by status
inspections.get('/items/status/:status', async (c) => {
  try {
    const status = c.req.param('status')
    
    const inspectionItems = await prisma.inspectionItem.findMany({
      where: { status },
      include: {
        asset: {
          select: {
            id: true,
            assetNo: true,
            assetName: true,
            condition: true,
            version: true,
            locationDesc: true,
            detailsLocation: true
          }
        },
        inspection: {
          select: {
            id: true,
            date: true,
            inspector: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return c.json({ success: true, data: inspectionItems })
  } catch (error) {
    console.error('Error fetching inspection items by status:', error)
    return c.json({ success: false, error: 'Failed to fetch inspection items by status' }, 500)
  }
})

export default inspections 