import { ProductCardProps } from "@/type/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";


export function ProductCard({ title, price, image }: ProductCardProps) {
  return (
    <Card className="w-72 rounded-xl overflow-hidden shadow-md">
        <div>

        </div>
       <div>
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="px-3 flex flex-col gap-3">
        <span className="text-xl font-semibold">{title}</span>
        <hr className="border-black border" />
        <div className="flex">
            <span className="text-xl justify-center font-bold">{price}</span>
            <Button className="bg-red-800 ml-auto w-30 h-8">Add to Cart</Button>
        </div>
      </div>
    </Card>
  );
}


