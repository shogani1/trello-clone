"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../../lib/createSafeAction";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLogs";
import { ACTION, ENTITY } from "@prisma/client";
import { hasAvaiableCount, incrementAvaiableCount } from "@/lib/orgLimit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId) return { error: "Unauthorized" };
  if (!orgId) return { error: "No org id" };
  const canCreate = await hasAvaiableCount();
  const isPro = await checkSubscription();
  if (!canCreate && !isPro) {
    return {
      error:
        "You have reachet your limit of free boards. Please updrage to create.",
    };
  }
  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
    image.split("|");
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUserName
  )
    return { error: "Missing fiends. Failed to create board." };
  console.log({
    title,
    orgId,
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageUserName,
    imageLinkHtml,
  });
  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHtml,
      },
    });
    await createAuditLog({
      entityId: board.id,
      entityType: ENTITY.BOARD,
      entityTitle: board.title,
      action: ACTION.CREATE,
    });
    if (!isPro) {
      await incrementAvaiableCount();
    }
  } catch (error) {
    return { error: "Failed to create" };
  }
  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
