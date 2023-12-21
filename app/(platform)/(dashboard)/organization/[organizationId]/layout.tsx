import { auth } from "@clerk/nextjs";
import { OrganisationControl } from "./_components/org-control";
import { startCase } from "lodash";

export async function generateMetadata() {
  const { orgSlug } = auth();
  return {
    title: startCase(orgSlug || "organization"),
  };
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrganisationControl />
      {children}
    </>
  );
};

export default layout;
