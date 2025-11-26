"use client";

import { LibraryBig, CirclePlus, Tag, Newspaper, ShoppingBag } from "lucide-react";
import { IconType } from "./menuData";

export function renderIcon(iconType?: IconType) {
  switch (iconType) {
    case "library":
      return <LibraryBig size={18} />;
    case "plus":
      return <CirclePlus size={18} />;
    case "tag":
      return <Tag size={18} />;
    case "newspaper":
      return <Newspaper size={18} />;
    case "shopping-bag":
      return <ShoppingBag size={18} />;
    default:
      return null;
  }
}
