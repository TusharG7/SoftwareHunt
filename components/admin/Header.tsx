// import { auth } from '@/auth';
import Link from 'next/link';
// import UserSection from './UserSection';
// import DropdownNotification from './DropdownNotification';

const Header = async () => {
  return (
    <header className="flex items-center justify-end px-4 py-4 bg-stone-700 text-white">
      <Link href="/admin" prefetch={false} className="col-span-2 hidden md:block outline-none hover:text-yellow-300"></Link>
      <div className="flex items-center space-x-4">
        Admin Page
      </div>
    </header>
  );
};

export default Header;