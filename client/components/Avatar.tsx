import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";

// Function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// Mapping of initials to colors
const colorMapping: Record<string, string> = {
    A: "bg-gradient-to-r from-red-400 to-pink-500 text-white",
    B: "bg-gradient-to-r from-red-200 to-yellow-200 text-black",
    C: "bg-gradient-to-r from-green-400 to-blue-500 text-white",
    D: "bg-gradient-to-r from-yellow-600 to-red-600 text-white",
    E: "bg-gradient-to-r from-violet-400 to-purple-300 text-white",
    F: "bg-gradient-to-r from-red-400 to-red-900 text-white",
    G: "bg-gradient-to-b from-rose-400 to-pink-600 text-white",
    H: "bg-gradient-to-r from-rose-400 to-red-500 text-white",
    I: "bg-gradient-to-r from-purple-500 to-purple-900 text-white",
    J: "bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white",
    K: "bg-gradient-to-r from-rose-400 to-orange-300 text-white",
    L: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
    M: "bg-gradient-to-r from-blue-300 to-blue-800 text-white",
    N: "bg-gradient-to-tl from-amber-500 to-yellow-400 text-white",
    O: "bg-gradient-to-r from-violet-500 to-purple-500 text-white",
    P: "bg-gradient-to-r from-blue-800 to-indigo-900 text-white",
    Q: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
    R: "bg-gradient-to-r from-pink-600 to-purple-500 text-white",
    S: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    T: "bg-gradient-to-r from-blue-500 to-teal-400 text-white",
    U: "bg-gradient-to-r from-green-200 to-blue-500 text-white",
    V: "bg-gradient-to-r from-rose-300 to-rose-500 text-white",
    W: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
    X: "bg-gradient-to-r from-teal-200 to-lime-200",
    Y: "bg-gradient-to-b from-sky-400 to-sky-200 text-black",
    Z: "bg-gradient-to-r from-violet-200 to-pink-200",
  };
  

// Function to get background color based on the first initial
function getBackgroundColor(name: string): string {
  const firstInitial = getInitials(name).charAt(0); // Take the first initial
  return colorMapping[firstInitial] || "bg-gray-500"; // Default background color
}

interface AvatarProfileProps {
  className?: string; // Class name for the Avatar
  fallbackClassName?: string; // Class name for the AvatarFallback
  src?: string | null; // Source for the AvatarImage
  alt?: string; // Alt text for the AvatarImage
  fallbackText?: string; // Fallback text to display in AvatarFallback
}

const AvatarProfile: React.FC<AvatarProfileProps> = ({
  className,
  fallbackClassName,
  src = "",
  alt = "Avatar",
  fallbackText = "CN", // Default fallback text
}) => {
  const initials = getInitials(fallbackText); // Calculate initials
  const bgColor = getBackgroundColor(fallbackText); // Get background color for the initials

  return (
    <Avatar className={clsx("md:size-40 size-32", className)}>
      {src ? (
        <AvatarImage src={src} alt={alt} className="object-cover" />
      ) : (
        <AvatarFallback
          className={clsx(
            fallbackClassName,
            bgColor // Dynamically apply background color
          )}
        >
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default AvatarProfile;
