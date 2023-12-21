import { DashboardNavbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <DashboardNavbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
