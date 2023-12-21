import { generateLogMessage } from "@/lib/generate-log-message";
import { format } from "date-fns";
import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";

interface ActivityItemProps {
  data: AuditLog;
}

const ActivityItem = ({ data }: ActivityItemProps) => {
  const formatedDate = format(
    new Date(data.createdAt),
    "MMM d, yyyy 'at' h:mm a"
  );
  return (
    <li className="flex item-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage} alt={data.userName} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {data.userName}
          </span>{" "}
          {generateLogMessage(data)}
          <p className="text-xs text-muted-foreground">{formatedDate}</p>
        </p>
      </div>
    </li>
  );
};

export default ActivityItem;
