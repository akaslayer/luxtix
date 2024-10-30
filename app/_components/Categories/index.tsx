import categoryItems from "@/utils/categoryItems";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface CategoryItemProps {
  name: string;
  img: StaticImageData;
  link: string;
}

function CategoryItem({ name, img, link }: CategoryItemProps) {
  return (
    <div className="text-center">
      <Link href={`events?category=${link}`} scroll={false}>
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden">
          <Image src={img} alt={name} className="h-full w-full object-cover" />
        </div>
        <p className="mt-4 text-xs sm:text-md font-medium text-luxtix-1">
          {name}
        </p>
      </Link>
    </div>
  );
}

function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <h2 className="text-3xl font-bold text-luxtix-5 mb-8">
        Explore Categories
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
        {categoryItems.map((category) => (
          <CategoryItem
            key={category.name}
            name={category.name}
            img={category.img}
            link={category.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Categories;
