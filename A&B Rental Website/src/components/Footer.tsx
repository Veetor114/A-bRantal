import { Heart, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-6 right-6 h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
        size="icon"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </Button>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="text-center mb-8">
          <h3 className="text-white text-xl mb-3">A&B Rentals</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Creating digital experiences that make a difference. Thank you for taking the time to explore our rental platform.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-sm text-gray-400">
            © 2024 A&B Rentals. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
