"use server";
import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
import { decreaseAvaiableCount } from "@/lib/orgLimit";
import { checkSubscription } from "@/lib/subscription";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };
  const isPro = await checkSubscription();
  const { id } = data;
  let board;
  try {
    board = await db.board.delete({
      where: { id, orgId },
    });
    if (!isPro) {
      decreaseAvaiableCount();
    }
    await createAuditLog({
      entityId: board.id,
      entityType: ENTITY.BOARD,
      entityTitle: board.title,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return { error: "Failed to delete" };
  }
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
