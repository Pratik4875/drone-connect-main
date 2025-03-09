import AvatarProfile from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Globe, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { leaveCompany } from "@/api/user_api";
const CompanyInfo = ({
  name,
  website,
  logo,
  id,
  canLeave,
}: {
  name: string;
  website: string;
  logo: string;
  id: string;
  canLeave: boolean;
}) => {
  const queryClient = useQueryClient(); // Access React Query's query client

  const mutation = useMutation({
    mutationFn: leaveCompany,
    onMutate: () => {
      const toastId = toast.loading("Leaving the company...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully leaved!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["professional"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const handleDelete = () => {
    mutation.mutate(id); // Trigger the mutation with the platform as input
  };

  return (
    <Card className="w-full mx-auto mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <AvatarProfile
            className="md:size-40 size-32 rounded-xl overflow-hidden bg-muted"
            src={`https://res.cloudinary.com/dmuhioahv/image/upload/v1736958453/${logo}`} // Display file URL if file selected, else fallback to default src
            fallbackClassName="text-3xl"
            fallbackText={name}
          />
          <div className="space-y-4 flex-grow w-full items-center">
            <div>
              <h2 className="text-2xl md:text-left text-center font-bold tracking-tight">
                {name}
              </h2>
              <div className="flex justify-center md:justify-start gap-2 mt-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {website.replace(/^https?:\/\//, "")}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Website not available
                  </span>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                {website && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href={website} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Link>
                  </Button>
                )}
                {canLeave && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Leave Company
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CompanyInfo;
