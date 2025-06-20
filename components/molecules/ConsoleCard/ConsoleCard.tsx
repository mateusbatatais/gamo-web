// components/molecules/ConsoleCard.tsx
import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
interface ConsoleCardProps {
  name: string;
  consoleName: string;
  brand: string;
  imageUrl: string;
  description: string;
  slug: string;
}

const ConsoleCard = ({
  name,
  consoleName,
  brand,
  imageUrl,
  description,
  slug,
}: ConsoleCardProps) => {
  return (
    <div className="border p-4 rounded shadow-lg">
      <Image
        width={200}
        height={100}
        src={`/${imageUrl}`}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="font-semibold">{consoleName}</h2>
      <h3 className="text-xs">{name}</h3>
      <p className="text-gray-500">{brand}</p>
      <p className="text-sm text-gray-700 mt-2">{description}</p>
      <Link href={`/console/${slug}`} className="block">
        <Button label="View Details" className="mt-4" />
      </Link>
    </div>
  );
};

export default ConsoleCard;
