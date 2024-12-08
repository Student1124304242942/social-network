function Header() {
    return (
      <div className="py-[20px] px-0 flex justify-center items-center font-[800] text-white">
        <div>
          <a 
            href="#" 
            className="text-[35px] block transition-all duration-500 relative hover:scale-[1.5] hover:translate-x-[-65px] group"
          >
            <span className="transition-all duration-700  group-hover:pr-[128px]">S</span>
            <span className=" transition-all duration-700 absolute opacity-0 left-[20px] -top-[20px] group-hover:opacity-100 group-hover:top-0">tudent</span>
            <span className="transition-all duration-700 ">Y</span>
            <span className="transition-all duration-700  absolute opacity-0 -right-[80px] -bottom-[20px]  group-hover:opacity-100 group-hover:bottom-0">unus</span>
          </a>
        </div>
      </div>
    );
}

export default Header;
