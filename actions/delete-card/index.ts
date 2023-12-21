"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { DeleteCard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const { id, boardId } = data;
  let card;
  try {
    card = await db.card.delete({
      where: { id, list: { board: { orgId } } },
    });
    await createAuditLog({
      entityId: card.id,
      entityType: ENTITY.CARD,
      entityTitle: card.title,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return { error: "Failed to delete" };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
