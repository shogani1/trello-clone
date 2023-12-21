import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY } from "@prisma/client";
import { db } from "./db";

interface Props {
  entityId: string;
  entityType: ENTITY;
  entityTitle: string;
  action: ACTION;
}
export const createAuditLog = async (props: Props) => {
  try {
    const { userId, orgId } = auth();
    const user = await currentUser();
    if (!orgId || !user) return;
    const { entityId, entityType, entityTitle, action } = props;
    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: `${user?.firstName} ${user.lastName || ""}`,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]");
  }
};
