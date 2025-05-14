// routes/asset-audit-route.ts
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const assetAuditRoute = new Hono()
const prisma = new PrismaClient()

// Create Audit Record
assetAuditRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    console.log('Received audit data:', JSON.stringify(body, null, 2))
    
    const {
      assetId,
      checkedById,
      checkDate,
      locationId,
      status,
      remarks,
      images,
    } = body

    // Validate images is an array
    const imageArray = Array.isArray(images) ? images : []
    console.log('Processed image array:', imageArray)

    // Create the audit record
    const audit = await prisma.assetAudit.create({
      data: {
        assetId,
        checkDate: checkDate ? new Date(checkDate) : undefined,
        locationId,
        status,
        remarks,
        images: imageArray,
        // Connect the user through the AuditUser relation
        auditUsers: {
          create: {
            userId: checkedById
          }
        }
      },
      include: {
        asset: true,
        location: true,
        auditUsers: {
          include: {
            user: true
          }
        }
      }
    })

    console.log('Created audit record:', JSON.stringify(audit, null, 2))
    return c.json(audit, 201)
  } catch (err: any) {
    console.error('Error creating audit:', err)
    return c.json({ error: 'Failed to create asset audit', details: err.message }, 500)
  }
})

// List Audit Records with optional filters
// GET /api/asset-audit?assetId=xxx&status=OK
assetAuditRoute.get('/', async (c) => {
  const assetId = c.req.query('assetId')
  const status = c.req.query('status')

  try {
    const audits = await prisma.assetAudit.findMany({
      where: {
        ...(assetId && { assetId }),
        ...(status && { status }),
      },
      orderBy: { checkDate: 'desc' },
      include: {
        asset: true,
        location: true,
        auditUsers: {
          include: {
            user: true
          }
        }
      },
    })

    console.log(`Retrieved ${audits.length} audit records`)
    // Log the first audit to check the structure
    if (audits.length > 0) {
      console.log('First audit record:', JSON.stringify(audits[0], null, 2))
    }

    return c.json(audits)
  } catch (err: any) {
    console.error('Error fetching audits:', err)
    return c.json({ error: 'Failed to fetch audit records', details: err.message }, 500)
  }
})

// Get single audit by ID
assetAuditRoute.get('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const audit = await prisma.assetAudit.findUnique({
      where: { id },
      include: {
        asset: true,
        location: true,
        auditUsers: {
          include: {
            user: true
          }
        }
      },
    })

    if (!audit) {
      return c.json({ error: 'Audit record not found' }, 404)
    }

    return c.json(audit)
  } catch (err: any) {
    console.error('Error fetching audit:', err)
    return c.json({ error: 'Failed to fetch audit record', details: err.message }, 500)
  }
})

// Update audit
assetAuditRoute.put('/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    const body = await c.req.json()
    console.log('Updating audit data:', JSON.stringify(body, null, 2))
    
    const {
      assetId,
      checkedById,
      checkDate,
      locationId,
      status,
      remarks,
      images,
    } = body

    // Validate images is an array
    const imageArray = Array.isArray(images) ? images : []

    // First delete existing audit user connections
    await prisma.auditUser.deleteMany({
      where: { auditId: id }
    })

    // Then update the audit with new connections
    const updated = await prisma.assetAudit.update({
      where: { id },
      data: {
        assetId,
        checkDate: checkDate ? new Date(checkDate) : undefined,
        locationId,
        status,
        remarks,
        images: imageArray,
        auditUsers: {
          create: {
            userId: checkedById
          }
        }
      },
      include: {
        asset: true,
        location: true,
        auditUsers: {
          include: {
            user: true
          }
        }
      }
    })

    console.log('Updated audit record:', JSON.stringify(updated, null, 2))
    return c.json(updated)
  } catch (err: any) {
    console.error('Error updating audit:', err)
    return c.json({ error: 'Failed to update asset audit', details: err.message }, 500)
  }
})

// Delete audit
assetAuditRoute.delete('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    // First delete related audit users
    await prisma.auditUser.deleteMany({
      where: { auditId: id }
    })
    
    // Then delete the audit
    await prisma.assetAudit.delete({ where: { id } })
    return c.json({ message: 'Deleted successfully' })
  } catch (err: any) {
    console.error('Error deleting audit:', err)
    return c.json({ error: 'Failed to delete asset audit', details: err.message }, 500)
  }
})

export default assetAuditRoute
