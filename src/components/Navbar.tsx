import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const NAV_ITEMS = [
  'Module',
  'Case Records',
  'Biotech',
  'Tiers',
  'Live Demo',
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

interface NavbarProps {
  activeItem: NavItem;
  onSelectItem: (item: NavItem) => void;
  onConnectClick: () => void;
}

const LOGO_PATH =
  'M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z';

function BrandMark() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={LOGO_PATH} fill="#ffffff" />
    </svg>
  );
}

export function Navbar({
  activeItem,
  onSelectItem,
  onConnectClick,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileSelect = (item: NavItem) => {
    onSelectItem(item);
    setMobileOpen(false);
  };

  const handleMobileConnect = () => {
    setMobileOpen(false);
    onConnectClick();
  };

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5"
      >
        {/* Desktop centered pill */}
        <div className="hidden md:flex bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1 nav-drop">
          <button
            type="button"
            onClick={() => onSelectItem('Module')}
            aria-label="Home"
            className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <BrandMark />
          </button>

          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onSelectItem(item)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onConnectClick}
            className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 ml-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Connect
          </button>
        </div>

        {/* Mobile left logo pill */}
        <button
          type="button"
          onClick={() => handleMobileSelect('Module')}
          aria-label="Home"
          className="md:hidden bg-black/60 backdrop-blur-md rounded-full p-2.5 flex items-center justify-center nav-drop cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          <BrandMark />
        </button>

        {/* Mobile right hamburger toggle pill */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden bg-black/60 backdrop-blur-md rounded-full p-2.5 text-white flex items-center justify-center nav-drop cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile full-width white dropdown */}
      {mobileOpen && (
        <div
          role="region"
          aria-label="Mobile menu"
          className="fixed top-0 left-0 right-0 z-40 bg-white pt-16 pb-6 px-5 shadow-lg md:hidden"
        >
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = activeItem === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleMobileSelect(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-3 border-b border-gray-100 text-left text-sm cursor-pointer transition-colors ${
                    isActive
                      ? 'text-gray-950 font-semibold'
                      : 'text-gray-800 font-medium hover:text-gray-950'
                  }`}
                >
                  {item}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleMobileConnect}
              className="mt-4 w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </>
  );
}
