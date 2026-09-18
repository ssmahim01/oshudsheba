// import Navbar from "@/components/modules/Navbar";

import AnnouncementBar from "@/components/modules/AnnouncementBar";
import Navbar from "@/components/modules/Navbar";
import React from "react";
import NavbarMenu from "@/components/modules/NavbarMenu";
import OshudShebaFooter from "@/components/public-view/common/OshudShebaFooter";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      {/* <AnnouncementBar />
            <Navbar />
            <NavbarMenu /> */}
      <main>{children}</main>
      {/* <OshudShebaFooter /> */}
      {/* </UserProvider> */}
    </TooltipProvider>
  );
}
