import { UserProfile } from '@/components/ui/UserProfile';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Vehicle Logging</h1>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;