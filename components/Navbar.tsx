import Image from "next/image";
import Link from "next/link";

import logo from "@/public/assets/icons/logo.svg";

const navIcons = [
  {
    src: "/assets/icons/search.svg",
    alt: "search",
  },
  {
    src: "/assets/icons/black-heart.svg",
    alt: "heart",
  },
  {
    src: "/assets/icons/user.svg",
    alt: "user",
  },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image src={logo} alt="logo" />

          <p className="nav-logo">
            Price<span className="text-primary">Tracker</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={24}
              height={24}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
