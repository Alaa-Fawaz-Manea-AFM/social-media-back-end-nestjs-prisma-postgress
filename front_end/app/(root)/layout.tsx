import { SideBar } from "@/components";

const LayoutRoot = ({ children }: { children: React.ReactNode }) => (
  <div className="flex max-ssx:flex-col relative h-screen overflow-hidden max-w-screen-lgg mx-auto max-md:gap-5">
    <SideBar />
    <div className="overflow-hidden px-5 w-full h-screen">{children}</div>
  </div>
);

export default LayoutRoot;
