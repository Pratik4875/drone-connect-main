// import ArrowRight from "@/assets/arrow-right.svg";
// import Logo from "@/assets/logosaas.png";
// import MenuIcon from "@/assets/menu.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="py-0">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* <Image src={Logo} alt="Saas logo" height={40} width={40} />
            <MenuIcon className="h-5 w-5 md:hidden" /> */}
            {/* <nav className="hidden md:flex gap-6 text-black/60 dark:text-white items-center">
              <a href="">About</a>
              <a href="">Features</a>
              <a href="">Custmers</a>
              <a href="">Updates</a>
              <a href="">Help</a>
              <button className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight">
                Get for free
              </button>
            </nav> */}
          </div>
        </div>
      </div>
    </header>
  );
};
