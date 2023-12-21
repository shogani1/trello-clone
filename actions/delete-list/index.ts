"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { DeleteList } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const { id, boardId } = data;
  let list;
  try {
    list = await db.list.delete({
      where: { id, boardId, board: { orgId } },
    });
    await createAuditLog({
      entityId: list.id,
      entityType: ENTITY.LIST,
      entityTitle: list.title,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return { error: "Failed to delete" };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
