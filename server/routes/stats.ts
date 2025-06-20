import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const statRoutes = new Hono();

/**
 * Get basic statistics about assets
 */
statRoutes.get('/overview', async (c) => {
  try {
    //console.log("Fetching asset overview statistics...");
    
    // Count all assets regardless of status to verify data exists
    const allAssetsCount = await prisma.asset.count();
    
    // Count active assets
    const activeAssets = await prisma.asset.count({
      where: {
        deletedAt: null
      }
    });
    
    // If truly no assets, return a clear message
    if (allAssetsCount === 0) {
      return c.json({
        success: false,
        message: "No assets found in the database. Please verify your data.",
        debug: {
          totalAssetsInDb: allAssetsCount
        }
      });
    }
    
    // Get total acquisition value
    const acqValueSum = await prisma.asset.aggregate({
      where: {
        deletedAt: null
      },
      _sum: {
        acqValueIdr: true
      }
    });
    
    // Get total book value
    const bookValueSum = await prisma.asset.aggregate({
      where: {
        deletedAt: null
      },
      _sum: {
        bookValue: true
      }
    });

    // Get newest asset (by creation date)
    const newestAsset = await prisma.asset.findFirst({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        assetName: true,
        createdAt: true,
        categoryCode: true
      }
    });

    return c.json({
      success: true,
      data: {
        totalAssets: activeAssets,
        totalAcqValueIdr: acqValueSum._sum.acqValueIdr || 0,
        totalBookValue: bookValueSum._sum.bookValue || 0,
        newestAsset
      }
    });
  } catch (error) {
    console.error('Error fetching asset overview statistics:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch asset overview statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});



/**
 * Get asset counts by category
 */
statRoutes.get('/by-category', async (c) => {
  try {
    //console.log("Fetching asset statistics by category...");
    
    // Count active assets by category with proper grouping
    const categoryStats = await prisma.asset.groupBy({
      by: ['categoryCode'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });
    
    // Transform to more usable format
    const formattedCategoryStats = categoryStats.map(stat => ({
      category: stat.categoryCode,
      count: stat._count.id
    }));
    
    // Sort by count descending
    formattedCategoryStats.sort((a, b) => b.count - a.count);

    return c.json({
      success: true,
      data: {
        totalCategories: formattedCategoryStats.length,
        categories: formattedCategoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching asset statistics by category:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch asset statistics by category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get asset counts by category
 */
statRoutes.get('/by-type', async (c) => {
  try {
    //console.log("Fetching asset statistics by category...");
    
    // Count active assets by category with proper grouping
    const categoryStats = await prisma.asset.groupBy({
      by: ['type'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });
    
    // Transform to more usable format
    const formattedTypeStats = categoryStats.map(stat => ({
      type: stat.type,
      count: stat._count.id
    }));
    
    // Sort by count descending
    formattedTypeStats.sort((a, b) => b.count - a.count);

    return c.json({
      success: true,
      data: {
        totalCategories: formattedTypeStats.length,
        types: formattedTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching asset statistics by category:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch asset statistics by category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get asset counts by location
 */
statRoutes.get('/by-location', async (c) => {
  try {
    //console.log("Fetching asset statistics by location...");
    
    // Count active assets by location with location description
    const locationStats = await prisma.asset.groupBy({
      by: ['locationDesc_id'],
      where: {
        deletedAt: null,
        locationDesc_id: { not: null }
      },
      _count: {
        id: true
      }
    });

    // Get location descriptions
    const locations = await prisma.locationDesc.findMany({
      where: {
        id: { in: locationStats.map(stat => stat.locationDesc_id).filter(Boolean) as number[] }
      }
    });

    // Create a map of location IDs to descriptions
    const locationMap = new Map(locations.map(loc => [loc.id, loc.description]));
    
    // Transform to more usable format with location descriptions
    const formattedLocationStats = locationStats.map(stat => ({
      location: locationMap.get(stat.locationDesc_id!) || 'Unknown Location',
      count: stat._count.id
    }));
    
    // Sort by count descending
    formattedLocationStats.sort((a, b) => b.count - a.count);

    return c.json({
      success: true,
      data: {
        totalLocations: formattedLocationStats.length,
        locations: formattedLocationStats
      }
    });
  } catch (error) {
    console.error('Error fetching asset statistics by location:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch asset statistics by location',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get asset counts by condition
 */
statRoutes.get('/by-condition', async (c) => {
  try {
    //console.log("Fetching asset statistics by condition...");
    
    // Count active assets by condition
    const conditionStats = await prisma.asset.groupBy({
      by: ['condition'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });
    
    // Transform to more usable format
    const formattedConditionStats = conditionStats.map(stat => ({
      condition: stat.condition,
      count: stat._count.id
    }));
    
    // Sort by count descending
    formattedConditionStats.sort((a, b) => b.count - a.count);

    return c.json({
      success: true,
      data: {
        totalConditions: formattedConditionStats.length,
        conditions: formattedConditionStats
      }
    });
  } catch (error) {
    console.error('Error fetching asset statistics by condition:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch asset statistics by condition',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get all asset statistics in one call
 */
statRoutes.get('/all', async (c) => {
  try {
    //console.log("Fetching all asset statistics...");
    
    // Count all assets regardless of status to verify data exists
    const allAssetsCount = await prisma.asset.count();
    
    // Count active assets
    const activeAssets = await prisma.asset.count({
      where: {
        deletedAt: null
      }
    });
    
    // If truly no assets, return a clear message
    if (allAssetsCount === 0) {
      return c.json({
        success: false,
        message: "No assets found in the database. Please verify your data.",
        debug: {
          totalAssetsInDb: allAssetsCount
        }
      });
    }
    
    // Get asset statistics by category
    const categoryStats = await prisma.asset.groupBy({
      by: ['categoryCode'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });
    
    // Transform category stats
    const formattedCategoryStats = categoryStats.map(stat => ({
      category: stat.categoryCode,
      count: stat._count.id
    })).sort((a, b) => b.count - a.count);
    
    // Get asset statistics by location with descriptions
    const locationStats = await prisma.asset.groupBy({
      by: ['locationDesc_id'],
      where: {
        deletedAt: null,
        locationDesc_id: { not: null }
      },
      _count: {
        id: true
      }
    });

    // Get location descriptions
    const locations = await prisma.locationDesc.findMany({
      where: {
        id: { in: locationStats.map(stat => stat.locationDesc_id).filter(Boolean) as number[] }
      }
    });

    // Create a map of location IDs to descriptions
    const locationMap = new Map(locations.map(loc => [loc.id, loc.description]));
    
    // Transform location stats with descriptions
    const formattedLocationStats = locationStats.map(stat => ({
      location: locationMap.get(stat.locationDesc_id!) || 'Unknown Location',
      count: stat._count.id
    })).sort((a, b) => b.count - a.count);
    
    // Get asset statistics by condition
    const conditionStats = await prisma.asset.groupBy({
      by: ['condition'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });
    
    // Transform condition stats
    const formattedConditionStats = conditionStats.map(stat => ({
      condition: stat.condition,
      count: stat._count.id
    })).sort((a, b) => b.count - a.count);
    
    // Get asset statistics by type
    const typeStats = await prisma.asset.groupBy({
      by: ['type'],
      where: {
        deletedAt: null
      },
      _count: {
        id: true
      }
    });

    // Transform type stats
    const formattedTypeStats = typeStats.map(stat => ({
      type: stat.type,
      count: stat._count.id
    })).sort((a, b) => b.count - a.count);
    
    // Get total acquisition value
    const acqValueSum = await prisma.asset.aggregate({
      where: {
        deletedAt: null
      },
      _sum: {
        acqValueIdr: true
      }
    });
    
    // Get total book value
    const bookValueSum = await prisma.asset.aggregate({
      where: {
        deletedAt: null
      },
      _sum: {
        bookValue: true
      }
    });

    return c.json({
      success: true,
      data: {
        overview: {
          totalAssets: activeAssets,
          totalAcqValueIdr: acqValueSum._sum.acqValueIdr || 0,
          totalBookValue: bookValueSum._sum.bookValue || 0
        },
        categories: {
          totalCategories: formattedCategoryStats.length,
          data: formattedCategoryStats
        },
        locations: {
          totalLocations: formattedLocationStats.length,
          data: formattedLocationStats
        },
        conditions: {
          totalConditions: formattedConditionStats.length,
          data: formattedConditionStats
        },
        types: {
          totalTypes: formattedTypeStats.length,
          data: formattedTypeStats
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all asset statistics:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch all asset statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default statRoutes;