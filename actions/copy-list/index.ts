"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CopyList } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const { id, boardId } = data;
  let list;
  try {
    const listCopy = await db.list.findUnique({
      where: { id, boardId, board: { orgId } },
      include: { cards: true },
    });
    if (!listCopy) {
      return { error: "list not found" };
    }
    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;
    list = await db.list.create({
      data: {
        boardId: listCopy.boardId,
        title: `${listCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: { cards: true },
    });
    await createAuditLog({
      entityId: list.id,
      entityType: ENTITY.LIST,
      entityTitle: list.title,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return { error: "Failed to copy" };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
