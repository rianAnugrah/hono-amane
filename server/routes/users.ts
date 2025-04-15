// src/routes/users.ts
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const users = new Hono();

const prisma = new PrismaClient();
// GET /users
users.get("/", async (c) => {
    const { q, role, placement, sort = "createdAt", order = "desc", page = "1", limit = "10" } = c.req.query();
  
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
  
    const where = {
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
users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return c.notFound();
  return c.json(user);
});

// CREATE user
users.post("/", async (c) => {
  const body = await c.req.json();
  const newUser = await prisma.users.create({ data: body });
  return c.json(newUser, 201);
});

// UPDATE user
users.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const updatedUser = await prisma.users.update({
    where: { id },
    data: body,
  });
  return c.json(updatedUser);
});

// DELETE user
users.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.users.delete({ where: { id } });
  return c.json({ message: "User deleted" });
});

export default users;
