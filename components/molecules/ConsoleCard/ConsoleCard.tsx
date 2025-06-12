// components/molecules/ConsoleCard.tsx
import Image from "next/image";
interface ConsoleCardProps {
  name: string;
  consoleName: string;
  brand: string;
  imageUrl: string;
  description: string;
}

const ConsoleCard = ({ name, consoleName, brand, imageUrl, description }: ConsoleCardProps) => {
  return (
    <div className="border p-4 rounded shadow-lg">
      <Image src={imageUrl} alt={name} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-xl font-semibold">{name}</h3>
      <h2 className="text-xl font-semibold">{consoleName}</h2>
      <p className="text-gray-500">{brand}</p>
      <p className="text-sm text-gray-700 mt-2">{description}</p>
    </div>
  );
};

export default ConsoleCard;
