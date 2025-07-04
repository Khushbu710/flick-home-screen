
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserButton from '@/components/UserButton';
import LocationSelector from '@/components/LocationSelector';

interface HeaderProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const Header = ({ selectedLocation = "Mumbai", onLocationSelect }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">BookMyShow</h1>
          <div className="flex items-center space-x-4">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect || (() => {})}
            />
            {user ? (
              <UserButton />
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
