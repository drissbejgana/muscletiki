import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

import FitnessPopup from "./components/FitnessPopup";
import { useAuth } from '@/hooks/useAuth';

const Layout = ({ children }) => {

  const {user}=useAuth()

  return (
    <SidebarProvider>
  
            
        {(!user || user?.plan === "free") && (
          <FitnessPopup intervalMinutes={2} />
        )}

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 p-4 overflow-auto">
            {children} 
          </main>

          <Footer />
        </div>
      </div>

    </SidebarProvider>
  );
};

export default Layout;
