import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-[#00b4ff] via-[#3ec7b0] to-[#7ed98b] px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo bên trái */}
      <div className="flex flex-col leading-tight cursor-pointer">
        <span 
          className="text-white text-2xl font-bold italic tracking-wider"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          VTR
        </span>
        <span 
          className="text-white text-xl font-bold italic ml-4"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          STUDY
        </span>
      </div>

      {/* Menu bên phải */}
      <div className="flex items-center space-x-8">
        <Link href="#" className="text-white font-semibold hover:text-opacity-80 transition-all">
          Giới thiệu
        </Link>
        <Link href="#" className="text-white font-semibold hover:text-opacity-80 transition-all">
          Dịch vụ
        </Link>
        <Link href="#" className="text-white font-semibold hover:text-opacity-80 transition-all">
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;