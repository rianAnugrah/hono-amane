import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const assetRoutes = new Hono();

interface Asset {
  id: string;
  projectCode: string;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
  locationDesc: string;
  detailsLocation?: string | null;
  condition: string;
  pisDate: Date;
  transDate: Date;
  categoryCode: string;
  afeNo?: string | null;
  adjustedDepre: number;
  poNo?: string | null;
  acqValueIdr: number;
  acqValue: number;
  accumDepre: number;
  ytdDepre: number;
  bookValue: number;
  taggingYear?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// GET all assets
assetRoutes.get('/', async (c) => {
  try {
    const assets: Asset[] = await prisma.asset.findMany();
    return c.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return c.json({ error: 'Failed to fetch assets' }, 500);
  }
});

// GET single asset
assetRoutes.get('/:id', async (c) => {
  try {
    const asset: Asset | null = await prisma.asset.findUnique({
      where: { id: c.req.param('id') },
    });
    if (!asset) return c.json({ error: 'Asset not found' }, 404);
    return c.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return c.json({ error: 'Failed to fetch asset' }, 500);
  }
});

// CREATE asset
assetRoutes.post('/', async (c) => {
  try {
    const body: Asset = await c.req.json();
    const asset: Asset = await prisma.asset.create({
      data: {
        projectCode: body.projectCode,
        assetNo: body.assetNo,
        lineNo: body.lineNo,
        assetName: body.assetName,
        remark: body.remark,
        locationDesc: body.locationDesc,
        detailsLocation: body.detailsLocation,
        condition: body.condition,
        pisDate: new Date(body.pisDate),
        transDate: new Date(body.transDate),
        categoryCode: body.categoryCode,
        afeNo: body.afeNo,
        adjustedDepre: parseFloat(String(body.adjustedDepre)),
        poNo: body.poNo,
        acqValueIdr: parseFloat(String(body.acqValueIdr)),
        acqValue: parseFloat(String(body.acqValue)),
        accumDepre: parseFloat(String(body.accumDepre)),
        ytdDepre: parseFloat(String(body.ytdDepre)),
        bookValue: parseFloat(String(body.bookValue)),
        taggingYear: body.taggingYear,
      },
    });
    return c.json(asset, 201);
  } catch (error) {
    console.error('Error creating asset:', error);
    return c.json({ error: 'Failed to create asset' }, 500);
  }
});

// UPDATE asset
assetRoutes.put('/:id', async (c) => {
  try {
    const body: Partial<Asset> = await c.req.json();
    const asset: Asset = await prisma.asset.update({
      where: { id: c.req.param('id') },
      data: {
        projectCode: body.projectCode,
        assetNo: body.assetNo,
        lineNo: body.lineNo,
        assetName: body.assetName,
        remark: body.remark,
        locationDesc: body.locationDesc,
        detailsLocation: body.detailsLocation,
        condition: body.condition,
        pisDate: body.pisDate ? new Date(body.pisDate) : undefined,
        transDate: body.transDate ? new Date(body.transDate) : undefined,
        categoryCode: body.categoryCode,
        afeNo: body.afeNo,
        adjustedDepre: body.adjustedDepre ? parseFloat(String(body.adjustedDepre)) : undefined,
        poNo: body.poNo,
        acqValueIdr: body.acqValueIdr ? parseFloat(String(body.acqValueIdr)) : undefined,
        acqValue: body.acqValue ? parseFloat(String(body.acqValue)) : undefined,
        accumDepre: body.accumDepre ? parseFloat(String(body.accumDepre)) : undefined,
        ytdDepre: body.ytdDepre ? parseFloat(String(body.ytdDepre)) : undefined,
        bookValue: body.bookValue ? parseFloat(String(body.bookValue)) : undefined,
        taggingYear: body.taggingYear,
      },
    });
    return c.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    return c.json({ error: 'Failed to update asset' }, 500);
  }
});

// DELETE asset
assetRoutes.delete('/:id', async (c) => {
  try {
    await prisma.asset.delete({
      where: { id: c.req.param('id') },
    });
    return c.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return c.json({ error: 'Failed to delete asset' }, 500);
  }
});

export default assetRoutes;