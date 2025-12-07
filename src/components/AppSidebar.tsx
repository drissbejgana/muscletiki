import { Home, Dumbbell, Calendar, Wrench, FileText, BookOpen, User, UserPlus, ChevronDown, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';
export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [trainingsOpen, setTrainingsOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const collapsed = state === "collapsed";

  const {user,logout}=useAuth()

const handlelogout =()=>{
  logout()
}
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-[#2B4C8F]">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-white">
          <Dumbbell className="w-8 h-8" />
          {!collapsed && <span className="font-bold text-xl">MUSCLETIKI</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                <NavLink to="/" activeClassName="bg-white/20">
                  <Home className="h-4 w-4" />
                  {!collapsed && <span>Accueil</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible open={trainingsOpen} onOpenChange={setTrainingsOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-white hover:bg-white/10">
                    <Dumbbell className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span>Entraînements</span>
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${trainingsOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              {!collapsed && (
                <CollapsibleContent>
                   <NavLink to="/workout" activeClassName="bg-white/20">
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Entraînements
                  </SidebarMenuButton>
                  </NavLink>
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Mes entraînements
                  </SidebarMenuButton>
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Générateur
                  </SidebarMenuButton>
                </CollapsibleContent>
              )}
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-white/10">
                <Calendar className="h-4 w-4" />
                {!collapsed && <span>Routines</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-white hover:bg-white/10">
                    <Wrench className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span>Outils</span>
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              {!collapsed && (
                <CollapsibleContent>
                <NavLink to="/calorie_calculator" activeClassName="bg-white/20">
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Calculatrice de calories
                  </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/macro_calculator" activeClassName="bg-white/20">
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Calculatrice de macros
                  </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/one_rep_max_tool" activeClassName="bg-white/20">
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    Calculatrice de 1RM
                  </SidebarMenuButton>
                        </NavLink>
                </CollapsibleContent>
              )}
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-white/10">
                <FileText className="h-4 w-4" />
                {!collapsed && <span>Articles</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-white/10">
                <BookOpen className="h-4 w-4" />
                {!collapsed && <span>Répertoire</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {
            !user ?
             <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
           <NavLink to="/auth" activeClassName="bg-white/20">
              <SidebarMenuButton className="text-white hover:bg-white/10">
                <User className="h-4 w-4" />
                {!collapsed && <span>Connexion</span>}
              </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/auth" activeClassName="bg-white/20">
                <SidebarMenuButton className="text-white hover:bg-white/10">
                  <UserPlus className="h-4 w-4" />
                  {!collapsed && <span>S'inscrire</span>}
                </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup> :  <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handlelogout} className="text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
             
        }
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-4 text-xs text-white/80 border-t border-white/10">
          <p className="mb-2">© 2025 MuscleWiki SEZC</p>
          <div className="flex flex-col gap-1">
            <a href="#" className="hover:underline">Conditions</a>
            <a href="#" className="hover:underline">Droits d'auteur</a>
            <a href="#" className="hover:underline">Politique de confidentialité</a>
            <a href="#" className="hover:underline">Newsletter</a>
            <a href="#" className="hover:underline">À propos</a>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
