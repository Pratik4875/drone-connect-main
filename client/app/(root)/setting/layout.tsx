import { GridOneWrapper } from "@/components/GridOneWarpper";
import { SidebarNav } from "@/components/tabs";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Setting",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/setting",
    user: ['c','o','p','a']
  },
  {
    title: "Professional",
    href: "/setting/professional",
    user: ['p']
  },
  {
    title: "Company",
    href: "/setting/company",
    user: ['o']
  },
  {
    title: "Socials",
    href: "/setting/socials",
    user: ['p']
  },
  {
    title: "Certifications",
    href: "/setting/certifications",
    user: ['p']
  },
  {
    title: "Exprience",
    href: "/setting/experience",
    user: ['p']
  },
  {
    title: "Password",
    href: "/setting/password",
    user: ['c','o','p','a']
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <GridOneWrapper>
        {" "}
        <div className="min-h-full max-w-2xl mx-auto mt-28 md:mt-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings.
            </p>
          </div>
          <div className="mt-10">
            <SidebarNav items={sidebarNavItems} />
            <Separator />
          </div>
          <div className="mt-10">
          {children}
          </div>
        </div>
      </GridOneWrapper>
    </>
  );
}
