import { OrganizationList } from "@clerk/nextjs";

const CreateOrgPage = () => {
  return (
    <div>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
      />
    </div>
  );
};

export default CreateOrgPage;
