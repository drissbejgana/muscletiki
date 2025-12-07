import { Youtube, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2B4C8F] text-white py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:underline">Conditions</a>
          <span>|</span>
          <a href="#" className="hover:underline">Droits d'auteur</a>
          <span>|</span>
          <a href="#" className="hover:underline">Politique de confidentialité</a>
          <span>|</span>
          <a href="#" className="hover:underline">Newsletter</a>
          <span>|</span>
          <a href="#" className="hover:underline">À propos</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <a href="#" className="hover:opacity-80">
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on the App Store" 
                className="h-10"
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play" 
                className="h-10"
              />
            </a>
          </div>

          <div className="flex gap-3 pl-4 border-l border-white/20">
            <a href="#" className="hover:text-accent transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
