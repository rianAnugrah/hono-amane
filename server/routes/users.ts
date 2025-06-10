import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const users = new Hono();
const prisma = new PrismaClient();

// Handle user registration requests and auto-registration
users.post("/register-request", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return c.json({ 
        message: "User already exists",
        user: existingUser
      }, 200);
    }

    // Get default location (first one)
    const defaultLocation = await prisma.locationDesc.findFirst({
      orderBy: { id: 'asc' }
    });

    if (!defaultLocation) {
      return c.json({ error: "No default location found" }, 500);
    }

    // Auto-register user with read_only role
    const newUser = await prisma.users.create({
      data: {
        email,
        name: name || email.split('@')[0],
        role: "read_only",
        userLocations: {
          create: [{ locationId: defaultLocation.id }]
        }
      },
      include: {
        userLocations: {
          include: { location: true }
        }
      }
    });

    return c.json({
      message: "User registered successfully",
      user: {
        ...newUser,
        locations: newUser.userLocations.map(ul => ul.location)
      }
    }, 201);
  } catch (error) {
    console.error("Error processing registration request:", error);
    return c.json({ error: "Failed to process registration request" }, 500);
  }
});

users.get("/", async (c) => {
  try {
    const {
      q,
      role,
      placement,
      locationId,
      sort = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = c.req.query();

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const parsedLocationId = locationId ? Number(locationId) : undefined;

    const where = {
      deletedAt: null,
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { email: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {},
        role ? { role } : {},
        placement ? { placement } : {},
        parsedLocationId
          ? {
              userLocations: {
                some: { locationId: parsedLocationId },
              },
            }
          : {},
      ].filter(condition => Object.keys(condition).length > 0),
    };

    const [rawUsers, total] = await Promise.all([
      prisma.users.findMany({
        where,
        orderBy: { [sort as string]: order === "asc" ? "asc" : "desc" },
        skip,
        take: pageSize,
        include: {
          userLocations: {
            include: { location: true },
          },
        },
      }),
      prisma.users.count({ where }),
    ]);

    // 💡 Add `locations` array manually
    const usersWithLocations = rawUsers.map((user) => ({
      ...user,
      locations: user.userLocations.map((ul) => ul.location),
    }));

    return c.json({
      data: usersWithLocations,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users." }, 500);
  }
});

// GET deleted users
users.get("/deleted", async (c) => {
  try {
    const {
      q,
      role,
      placement,
      locationId,
      sort = "deletedAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = c.req.query();

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const parsedLocationId = locationId ? Number(locationId) : undefined;

    const where = {
      deletedAt: { not: null },
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { email: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {},
        role ? { role } : {},
        placement ? { placement } : {},
        parsedLocationId
          ? {
              userLocations: {
                some: { locationId: parsedLocationId },
              },
            }
          : {},
      ].filter(condition => Object.keys(condition).length > 0),
    };

    const [rawUsers, total] = await Promise.all([
      prisma.users.findMany({
        where,
        orderBy: { [sort as string]: order === "asc" ? "asc" : "desc" },
        skip,
        take: pageSize,
        include: {
          userLocations: {
            include: { location: true },
          },
        },
      }),
      prisma.users.count({ where }),
    ]);

    // Add `locations` array manually
    const usersWithLocations = rawUsers.map((user) => ({
      ...user,
      locations: user.userLocations.map((ul) => ul.location),
    }));

    return c.json({
      data: usersWithLocations,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching deleted users:", error);
    return c.json({ error: "Failed to fetch deleted users." }, 500);
  }
});

users.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        userLocations: {
          include: { location: true },
        },
      },
    });

    if (!user) return c.notFound();

    // Add `locations` array derived from `userLocations`
    return c.json({
      ...user,
      locations: user.userLocations.map((ul) => ul.location),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user." }, 500);
  }
});

// GET user by EMAIL
users.get("/by-email/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        userLocations: {
          include: { location: true },
        },
      },
    });
    if (!user) return c.notFound();

    // Add `locations` array derived from `userLocations`
    return c.json({
      ...user,
      locations: user.userLocations.map((ul) => ul.location),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user." }, 500);
  }
});
// CREATE user
users.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, role, placement, locationIds = [] } = body;

    const newUser = await prisma.users.create({
      data: {
        email,
        name,
        role,
        placement,
        userLocations: {
          create: locationIds.map((locationId: number) => ({
            locationId,
          })),
        },
      },
      include: {
        userLocations: {
          include: { location: true },
        },
      },
    });

    return c.json(newUser, 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user." }, 400);
  }
});

// UPDATE user
users.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { name, role, placement, locationIds = [] } = await c.req.json();

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return c.notFound();

    await prisma.$transaction([
      prisma.userLocation.deleteMany({ where: { userId: id } }),
      prisma.users.update({
        where: { id },
        data: {
          name,
          role,
          placement,
          userLocations: {
            create: locationIds.map((locationId: number) => ({
              locationId,
            })),
          },
        },
      }),
    ]);

    const updatedUser = await prisma.users.findUnique({
      where: { id },
      include: {
        userLocations: {
          include: { location: true },
        },
      },
    });

    return c.json({ message: "User updated", data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Failed to update user." }, 400);
  }
});

// DELETE user (soft delete)
users.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const deleted = await prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return c.json({ message: "User soft-deleted", data: deleted });
  } catch (error) {
    console.error("Error soft-deleting user:", error);
    return c.json({ error: "Failed to soft-delete user." }, 400);
  }
});

// RESTORE user
users.post("/:id/restore", async (c) => {
  try {
    const id = c.req.param("id");
    const restored = await prisma.users.update({
      where: { id },
      data: { deletedAt: null },
    });
    return c.json({ message: "User restored", data: restored });
  } catch (error) {
    console.error("Error restoring user:", error);
    return c.json({ error: "Failed to restore user." }, 400);
  }
});

export default users;
