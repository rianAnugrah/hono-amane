// src/routes/users.ts
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const users = new Hono();

const prisma = new PrismaClient();

// GET /users (with soft delete filter)
users.get("/", async (c) => {
  const {
    q,
    role,
    placement,
    sort = "createdAt",
    order = "desc",
    page = "1",
    limit = "10",
  } = c.req.query();

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  const where = {
    deletedAt: null, // 👈 filter out soft-deleted users
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      role ? { role } : {},
      placement ? { placement } : {},
    ],
  };

  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where,
      orderBy: {
        [sort]: order === "asc" ? "asc" : "desc",
      },
      skip,
      take: pageSize,
      include: { location: true },
    }),
    prisma.users.count({ where }),
  ]);

  return c.json({
    data: users,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

// GET user by ID
users.get("/by-email/:email", async (c) => {
  const email = c.req.param("email").toLowerCase();
  const user = await prisma.users.findUnique({
    where: { email },
    include: { location: true },
  });
  if (!user) return c.notFound();
  return c.json(user);
});

// GET user by ID
users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.users.findUnique({
    where: { id },
    include: { location: true },
  });
  if (!user) return c.notFound();
  return c.json(user);
});



// CREATE user
users.post("/", async (c) => {
  const body = await c.req.json();
  const newUser = await prisma.users.create({ data: body });
  return c.json(newUser, 201);
});

users.put("/:id", async (c) => {
  const id = c.req.param("id");
  const payload = await c.req.json();

  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return c.notFound();

  // Save current data as a version
  await prisma.userVersion.create({
    data: {
      userId: id,
      name: user.name,
      role: user.role,
      placement: user.placement,
    },
  });

  // Update user
  const updated = await prisma.users.update({
    where: { id },
    data: {
      name: payload.name,
      role: payload.role,
      placement: payload.placement,
    },
  });

  return c.json({ message: "User updated with versioning", data: updated });
});

// DELETE user
users.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const deleted = await prisma.users.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return c.json({ message: "User soft-deleted", data: deleted });
});

users.post("/:id/restore", async (c) => {
  const id = c.req.param("id");

  const restored = await prisma.users.update({
    where: { id },
    data: { deletedAt: null },
  });

  return c.json({ message: "User restored", data: restored });
});

users.post("/:id/undo", async (c) => {
  const id = c.req.param("id");

  const lastVersion = await prisma.userVersion.findFirst({
    where: { userId: id },
    orderBy: { updatedAt: "desc" },
  });

  if (!lastVersion) return c.json({ message: "No previous version found" });

  const reverted = await prisma.users.update({
    where: { id },
    data: {
      name: lastVersion.name,
      role: lastVersion.role,
      placement: lastVersion.placement,
    },
  });

  return c.json({
    message: "User reverted to previous version",
    data: reverted,
  });
});

export default users;
