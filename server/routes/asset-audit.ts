// routes/asset-audit-route.ts
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const assetAuditRoute = new Hono()
const prisma = new PrismaClient()

// Create Audit Record
assetAuditRoute.post('/', async (c) => {
  const {
    assetId,
    checkedById,
    checkDate,
    locationId,
    status,
    remarks,
  } = await c.req.json()

  try {
    // Create the audit record
    const audit = await prisma.assetAudit.create({
      data: {
        assetId,
        checkDate: checkDate ? new Date(checkDate) : undefined,
        locationId,
        status,
        remarks,
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
    return c.json(audit, 201)
  } catch (err) {
    console.error(err)
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

    return c.json(audits)
  } catch (err) {
    console.error(err)
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
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to fetch audit record', details: err.message }, 500)
  }
})

// Update audit
assetAuditRoute.put('/:id', async (c) => {
  const id = c.req.param('id')
  const {
    assetId,
    checkedById,
    checkDate,
    locationId,
    status,
    remarks,
  } = await c.req.json()

  try {
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
    return c.json(updated)
  } catch (err) {
    console.error(err)
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
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to delete asset audit', details: err.message }, 500)
  }
})

export default assetAuditRoute
