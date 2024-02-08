import Image from "next/image";
import arrowRight from "@/public/assets//icons/arrow-right.svg";
import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";
import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2 border-red-50">
        <div className="flex max-xl:flex-col gap-6">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Welcome to Price Tracker:
              <Image src={arrowRight} alt="Hel" />
            </p>
            <h1 className="head-text">
              Track prices of products from commerce
              <span className="text-primary"> websites.</span>
            </h1>
            <p className="mt-6">
              We help you track prices of products from various e-commerce
              websites and notify you when the price drops.
            </p>

            <SearchBar />
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending Products</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product, index) => {
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Home;
