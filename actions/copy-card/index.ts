"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CopyCard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const { id, boardId } = data;
  let card;
  try {
    const cardToCopy = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
    });
    if (!cardToCopy) return { error: "Card not found" };
    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;
    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });
    await createAuditLog({
      entityId: card.id,
      entityType: ENTITY.CARD,
      entityTitle: card.title,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return { error: "Failed to copy" };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
