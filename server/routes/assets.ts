import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const assetRoutes = new Hono();

// Updated interface to match the schema
interface Asset {
  id: string;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
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
  deletedAt?: Date | null;
  isLatest: boolean;
  parentId?: string | null;
  version: number;
  projectCode_id?: number | null;
  locationDesc_id?: number | null;
  detailsLocation_id?: number | null;
  images?: string[];  // Making this optional to avoid TypeScript errors

  // Relations (optional for when they are included)
  projectCode?: any;
  locationDesc?: any;
  detailsLocation?: any;
}

// GET all assets with search, filter, sort, and pagination
assetRoutes.get("/", async (c) => {
  try {
    // Pagination parameters
    const page = parseInt(c.req.query("page") || "1", 10);
    const pageSize = parseInt(c.req.query("pageSize") || "10", 10);

    // Search parameter
    const search = c.req.query("search") || "";

    // Sorting parameters
    const sortBy = c.req.query("sortBy") || "createdAt";
    const sortOrder = c.req.query("sortOrder") || "desc";

    // Filter parameters for various fields
    const filterCondition = c.req.query("condition");
    const filterAssetNo = c.req.query("assetNo");
    const filterLineNo = c.req.query("lineNo");
    const filterCategoryCode = c.req.query("categoryCode");
    const filterAfeNo = c.req.query("afeNo");
    const filterPoNo = c.req.query("poNo");
    const filterTaggingYear = c.req.query("taggingYear");

    // Handle multiple location IDs (comma-separated)
    const locationDescIds = c.req.query("locationDesc_id")
      ? c.req.query("locationDesc_id").split(',').map(id => parseInt(id.trim()))
      : undefined;

    // Other related entity filters (single values)
    const filterProjectCodeId = c.req.query("projectCode_id")
      ? parseInt(c.req.query("projectCode_id"))
      : undefined;
    const filterDetailsLocationId = c.req.query("detailsLocation_id")
      ? parseInt(c.req.query("detailsLocation_id"))
      : undefined;

    // Date range filters
    const pisDateFrom = c.req.query("pisDateFrom");
    const pisDateTo = c.req.query("pisDateTo");
    const transDateFrom = c.req.query("transDateFrom");
    const transDateTo = c.req.query("transDateTo");

    // Numeric range filters
    const acqValueMin = c.req.query("acqValueMin")
      ? parseFloat(c.req.query("acqValueMin"))
      : undefined;
    const acqValueMax = c.req.query("acqValueMax")
      ? parseFloat(c.req.query("acqValueMax"))
      : undefined;
    const bookValueMin = c.req.query("bookValueMin")
      ? parseFloat(c.req.query("bookValueMin"))
      : undefined;
    const bookValueMax = c.req.query("bookValueMax")
      ? parseFloat(c.req.query("bookValueMax"))
      : undefined;

    // Build where conditions object
    const whereConditions: any = {
      deletedAt: null,
      isLatest: true,
    };

    // Add text search condition if provided
    if (search) {
      whereConditions.OR = [
        { assetName: { contains: search, mode: "insensitive" } },
        { assetNo: { contains: search, mode: "insensitive" } },
        { remark: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add filter conditions for text fields
    if (filterCondition)
      whereConditions.condition = { equals: filterCondition };
    if (filterAssetNo)
      whereConditions.assetNo = {
        contains: filterAssetNo,
        mode: "insensitive",
      };
    if (filterLineNo)
      whereConditions.lineNo = { contains: filterLineNo, mode: "insensitive" };
    if (filterCategoryCode)
      whereConditions.categoryCode = { equals: filterCategoryCode };
    if (filterAfeNo)
      whereConditions.afeNo = { contains: filterAfeNo, mode: "insensitive" };
    if (filterPoNo)
      whereConditions.poNo = { contains: filterPoNo, mode: "insensitive" };
    if (filterTaggingYear)
      whereConditions.taggingYear = { equals: filterTaggingYear };

    // Add relation filters
    if (filterProjectCodeId !== undefined)
      whereConditions.projectCode_id = filterProjectCodeId;
    
    // Handle multiple location IDs using "in" operator if provided
    if (locationDescIds && locationDescIds.length > 0) {
      whereConditions.locationDesc_id = { in: locationDescIds };
    }
    
    if (filterDetailsLocationId !== undefined)
      whereConditions.detailsLocation_id = filterDetailsLocationId;

    // Add date range filters
    if (pisDateFrom || pisDateTo) {
      whereConditions.pisDate = {};
      if (pisDateFrom) whereConditions.pisDate.gte = new Date(pisDateFrom);
      if (pisDateTo) whereConditions.pisDate.lte = new Date(pisDateTo);
    }

    if (transDateFrom || transDateTo) {
      whereConditions.transDate = {};
      if (transDateFrom)
        whereConditions.transDate.gte = new Date(transDateFrom);
      if (transDateTo) whereConditions.transDate.lte = new Date(transDateTo);
    }

    // Add numeric range filters
    if (acqValueMin !== undefined || acqValueMax !== undefined) {
      whereConditions.acqValue = {};
      if (acqValueMin !== undefined) whereConditions.acqValue.gte = acqValueMin;
      if (acqValueMax !== undefined) whereConditions.acqValue.lte = acqValueMax;
    }

    if (bookValueMin !== undefined || bookValueMax !== undefined) {
      whereConditions.bookValue = {};
      if (bookValueMin !== undefined)
        whereConditions.bookValue.gte = bookValueMin;
      if (bookValueMax !== undefined)
        whereConditions.bookValue.lte = bookValueMax;
    }

    // Execute the query with filters and pagination
    const assets: Asset[] = await prisma.asset.findMany({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        projectCode: true,
        locationDesc: true,
        detailsLocation: true,
      },
    });

    // Get total count for pagination
    const totalAssets = await prisma.asset.count({
      where: whereConditions,
    });

    return c.json({
      assets,
      pagination: {
        page,
        pageSize,
        total: totalAssets,
        totalPages: Math.ceil(totalAssets / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return c.json({ error: "Failed to fetch assets" }, 500);
  }
});

// GET single asset (latest, not deleted)
assetRoutes.get("/:id", async (c) => {
  try {
    const asset: Asset | null = await prisma.asset.findFirst({
      where: {
        id: c.req.param("id"),
        deletedAt: null,
        isLatest: true,
      },
      include: {
        projectCode: true,
        locationDesc: true,
        detailsLocation: true,
      },
    });
    if (!asset) return c.json({ error: "Asset not found" }, 404);
    return c.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    return c.json({ error: "Failed to fetch asset" }, 500);
  }
});

// GET single asset (latest, not deleted)
assetRoutes.get("/by-asset-number/:id", async (c) => {
  try {
    const asset: Asset | null = await prisma.asset.findFirst({
      where: {
        assetNo: c.req.param("id"),
        deletedAt: null,
        isLatest: true,
      },
      include: {
        projectCode: true,
        locationDesc: true,
        detailsLocation: true,
      },
    });
    if (!asset)
      return c.json(
        { error: `Asset with asset number ${c.req.param("id")} not found` },
        404
      );
    return c.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    return c.json({ error: "Failed to fetch asset" }, 500);
  }
});

// GET asset version history by assetNo
assetRoutes.get("/versions/:assetNo", async (c) => {
  try {
    const assetNo = c.req.param("assetNo");
    
    // Get all versions of the asset with the given assetNo
    const assetVersions = await prisma.asset.findMany({
      where: {
        assetNo: assetNo,
        deletedAt: null,
      },
      orderBy: {
        version: "desc", // Latest versions first
      },
      include: {
        projectCode: true,
        locationDesc: true,
        detailsLocation: true,
      },
    });

    if (assetVersions.length === 0) {
      return c.json({ error: `No assets found with asset number ${assetNo}` }, 404);
    }

    return c.json(assetVersions);
  } catch (error) {
    console.error("Error fetching asset versions:", error);
    return c.json({ error: "Failed to fetch asset versions" }, 500);
  }
});

// CREATE asset
assetRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // Prepare the data for Prisma - using any to bypass TypeScript checks
    const createData: any = {
      version: 1,
      isLatest: true,
      assetNo: body.assetNo,
      lineNo: body.lineNo,
      assetName: body.assetName,
      remark: body.remark ?? null,
      condition: body.condition,
      pisDate: new Date(body.pisDate),
      transDate: new Date(body.transDate),
      categoryCode: body.categoryCode,
      afeNo: body.afeNo ?? null,
      adjustedDepre: parseFloat(body.adjustedDepre as any),
      poNo: body.poNo ?? null,
      acqValueIdr: parseFloat(body.acqValueIdr as any),
      acqValue: parseFloat(body.acqValue as any),
      accumDepre: parseFloat(body.accumDepre as any),
      ytdDepre: parseFloat(body.ytdDepre as any),
      bookValue: parseFloat(body.bookValue as any),
      taggingYear: body.taggingYear ?? null,
      images: body.images || [], // Set images with a default empty array
    };
    
    // Add relation connections
    if (body.projectCode_id) {
      createData.projectCode = {
        connect: { id: Number(body.projectCode_id) }
      };
    }
    
    if (body.locationDesc_id) {
      createData.locationDesc = {
        connect: { id: Number(body.locationDesc_id) }
      };
    }
    
    if (body.detailsLocation_id) {
      createData.detailsLocation = {
        connect: { id: Number(body.detailsLocation_id) }
      };
    }

    // Send to Prisma
    const asset = await prisma.asset.create({ data: createData });

    return c.json(asset, 201);
  } catch (error: any) {
    console.error("Error creating asset:", error);

    const isPrismaError = error.code && error.meta;

    return c.json(
      {
        error: "Failed to create asset",
        message: error.message,
        ...(isPrismaError && {
          prisma: {
            code: error.code,
            target: error.meta?.target,
            cause: error.meta?.cause,
            details: error.meta,
          },
        }),
        raw:
          process.env.NODE_ENV === "development"
            ? JSON.stringify(error, null, 2)
            : undefined,
      },
      500
    );
  }
});

// UPDATE asset (creates new version)
assetRoutes.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const old = await prisma.asset.findUnique({ where: { id } });
    if (!old || old.deletedAt || !old.isLatest) {
      return c.json({ error: "Asset not found or already versioned" }, 404);
    }

    // Mark previous version as not latest
    await prisma.asset.update({
      where: { id: old.id },
      data: { isLatest: false },
    });
    
    // Prepare the data for Prisma - using any to bypass TypeScript checks
    const createData: any = {
      version: old.version + 1,
      isLatest: true,
      parentId: old.parentId || old.id,
      assetNo: body.assetNo ?? old.assetNo,
      lineNo: body.lineNo ?? old.lineNo,
      assetName: body.assetName ?? old.assetName,
      remark: body.remark ?? old.remark,
      condition: body.condition ?? old.condition,
      pisDate: body.pisDate ? new Date(body.pisDate) : old.pisDate,
      transDate: body.transDate ? new Date(body.transDate) : old.transDate,
      categoryCode: body.categoryCode ?? old.categoryCode,
      afeNo: body.afeNo ?? old.afeNo,
      adjustedDepre: body.adjustedDepre ?? old.adjustedDepre,
      poNo: body.poNo ?? old.poNo,
      acqValueIdr: body.acqValueIdr ?? old.acqValueIdr,
      acqValue: body.acqValue ?? old.acqValue,
      accumDepre: body.accumDepre ?? old.accumDepre,
      ytdDepre: body.ytdDepre ?? old.ytdDepre,
      bookValue: body.bookValue ?? old.bookValue,
      taggingYear: body.taggingYear ?? old.taggingYear,
      images: Array.isArray(body.images) ? body.images : (old as any).images || [], // Default to old images or empty array
    };
    
    // Add relation connections, keeping old connections if not changed
    if (body.projectCode_id || old.projectCode_id) {
      createData.projectCode = {
        connect: { id: Number(body.projectCode_id ?? old.projectCode_id) }
      };
    }
    
    if (body.locationDesc_id || old.locationDesc_id) {
      createData.locationDesc = {
        connect: { id: Number(body.locationDesc_id ?? old.locationDesc_id) }
      };
    }
    
    if (body.detailsLocation_id || old.detailsLocation_id) {
      createData.detailsLocation = {
        connect: { id: Number(body.detailsLocation_id ?? old.detailsLocation_id) }
      };
    }

    // Send to Prisma
    const newAsset = await prisma.asset.create({ data: createData });

    return c.json(newAsset);
  } catch (error: any) {
    console.error("Error updating asset:", error);

    const isPrismaError = error.code && error.meta;

    return c.json(
      {
        error: "Failed to update asset",
        message: error.message,
        ...(isPrismaError && {
          prisma: {
            code: error.code,
            target: error.meta?.target,
            cause: error.meta?.cause,
            details: error.meta,
          },
        }),
        raw:
          process.env.NODE_ENV === "development"
            ? JSON.stringify(error, null, 2)
            : undefined,
      },
      500
    );
  }
});

// SOFT DELETE asset
assetRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset || asset.deletedAt) {
      return c.json({ error: "Asset not found or already deleted" }, 404);
    }

    await prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return c.json({ message: "Asset soft-deleted" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return c.json({ error: "Failed to delete asset" }, 500);
  }
});

export default assetRoutes;
