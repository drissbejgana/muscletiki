import { Home, Dumbbell, Calendar, Wrench, FileText, User, UserPlus, ChevronDown, LogOut } from "lucide-react";
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
import { useTranslation } from "@/i18n";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [trainingsOpen, setTrainingsOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handlelogout = () => {
    logout();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-[#2B4C8F]">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-white">
          <Dumbbell className="w-8 h-8" />
          {!collapsed && <span className="font-bold text-xl">{t('common.appName')}</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                <NavLink to="/" activeClassName="bg-white/20">
                  <Home className="h-4 w-4" />
                  {!collapsed && <span>{t('nav.home')}</span>}
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
                        <span>{t('nav.workouts')}</span>
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
                      {t('nav.workouts')}
                    </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/training" activeClassName="bg-white/20">
                    <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                      {t('nav.trainingLog')}
                    </SidebarMenuButton>
                  </NavLink>
                  <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                    {t('nav.generator')}
                  </SidebarMenuButton>
                </CollapsibleContent>
              )}
            </Collapsible>

            <SidebarMenuItem>
              <NavLink to={'/routines'}>
                <SidebarMenuButton className="text-white hover:bg-white/10">
                  <Calendar className="h-4 w-4" />
                  {!collapsed && <span>{t('nav.routines')}</span>}
                </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>

            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-white hover:bg-white/10">
                    <Wrench className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span>{t('nav.tools')}</span>
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
                      {t('nav.calorieCalculator')}
                    </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/macro_calculator" activeClassName="bg-white/20">
                    <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                      {t('nav.macroCalculator')}
                    </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/one_rep_max_tool" activeClassName="bg-white/20">
                    <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                      {t('nav.oneRMCalculator')}
                    </SidebarMenuButton>
                  </NavLink>
                  <NavLink to="/tdee_calculator" activeClassName="bg-white/20">
                    <SidebarMenuButton className="pl-8 text-white hover:bg-white/10">
                      {t('nav.tdeeCalculator')}
                    </SidebarMenuButton>
                  </NavLink>
                </CollapsibleContent>
              )}
            </Collapsible>

            <SidebarMenuItem>
              <NavLink to="/articles" activeClassName="bg-white/20">
                <SidebarMenuButton className="text-white hover:bg-white/10">
                  <FileText className="h-4 w-4" />
                  {!collapsed && <span>{t('nav.articles')}</span>}
                </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {!user ? (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/auth" activeClassName="bg-white/20">
                  <SidebarMenuButton className="text-white hover:bg-white/10">
                    <User className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.login')}</span>}
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/auth" activeClassName="bg-white/20">
                  <SidebarMenuButton className="text-white hover:bg-white/10">
                    <UserPlus className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.signup')}</span>}
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handlelogout} className="text-white hover:bg-white/10">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>{t('nav.logout')}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-4 text-xs text-white/80 border-t border-white/10">
          <p className="mb-2">{t('footer.rights')}</p>
          <div className="flex flex-col gap-1">
            <a href="#" className="hover:underline">{t('footer.terms')}</a>
            <a href="#" className="hover:underline">{t('footer.copyright')}</a>
            <a href="#" className="hover:underline">{t('footer.privacy')}</a>
            <a href="#" className="hover:underline">{t('footer.newsletter')}</a>
            <a href="#" className="hover:underline">{t('footer.about')}</a>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
