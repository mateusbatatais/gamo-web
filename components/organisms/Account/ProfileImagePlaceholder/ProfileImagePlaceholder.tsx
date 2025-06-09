// components/Account/ProfileImagePlaceholder.tsx

import React from "react";
import { Joystick } from "lucide-react";

export default function ProfileImagePlaceholder() {
  return (
    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
      <Joystick size={40} className="text-primary" />
    </div>
  );
}
