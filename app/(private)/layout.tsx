import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "sonner";

const dmSans = localFont({
  src: [
    { path: "../fonts/DMSans-Regular.ttf", weight: "400" },
    { path: "../fonts/DMSans-Medium.ttf", weight: "500" },
    { path: "../fonts/DMSans-SemiBold.ttf", weight: "600" },
    { path: "../fonts/DMSans-Bold.ttf", weight: "700" },
  ],
  variable: "--dm",
});

const openSans = localFont({
  src: [
    { path: "../fonts/OpenSans-Regular.ttf", weight: "400" },
    { path: "../fonts/OpenSans-Medium.ttf", weight: "500" },
    { path: "../fonts/OpenSans-SemiBold.ttf", weight: "600" },
    { path: "../fonts/OpenSans-Bold.ttf", weight: "700" },
  ],
  variable: "--open",
});

const nunitoSans = localFont({
  src: [{ path: "../fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf" }],
  variable: "--nunito",
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${openSans.variable} ${nunitoSans.variable}`}
    >
      {session ? (
        <>
          <SessionProvider>
            <body className="font-open relative" suppressHydrationWarning>
              <SidebarProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  {children}
                </SidebarInset>
              </SidebarProvider>
              <Toaster />
            </body>
          </SessionProvider>
      
        </>
      ) : (
        <SessionProvider>
          <body className="font-open" suppressHydrationWarning>
            {children}
          </body>
        </SessionProvider>
      )}
    </html>
  );
}
