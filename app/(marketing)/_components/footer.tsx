import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto w-full flex items-center justify-between ">
          <Button className="" size={"sm"} variant={"ghost"}>
            Privacy Policy
          </Button>
          <Button size={"sm"} variant={"ghost"}>
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
}
