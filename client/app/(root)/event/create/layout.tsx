import { GridOneWrapper } from "@/components/GridOneWarpper";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};



interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <GridOneWrapper>
        {" "}
        <div className=" max-w-2xl mx-auto h-full mt-10">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Create event</h2>
            <p className="text-muted-foreground">
            Provide the necessary information to create your event.
            </p>
          </div>
          <div className="mt-4 ">
          {children}
          </div>
        </div>
      </GridOneWrapper>
    </>
  );
}
