"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { UpdateBoard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const { title, id } = data;
  let board;
  try {
    board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });
    await createAuditLog({
      entityId: board.id,
      entityType: ENTITY.BOARD,
      entityTitle: board.title,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return { error: "Failed to update" };
  }
  revalidatePath(`/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
