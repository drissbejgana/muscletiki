import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

const articles = [
  { id: 1, category: "Training",   author: "Dr. John Smith",  readTime: "8 min", date: "Dec 5, 2025",  image: "/assets/workout-1.jpg" },
  { id: 2, category: "Nutrition",  author: "Sarah Johnson",   readTime: "6 min", date: "Dec 3, 2025",  image: "/assets/workout-2.jpg" },
  { id: 3, category: "Recovery",   author: "Mike Chen",       readTime: "5 min", date: "Dec 1, 2025",  image: "/assets/workout-3.jpg" },
  { id: 4, category: "Training",   author: "Dr. John Smith",  readTime: "7 min", date: "Nov 28, 2025", image: "/assets/workout-1.jpg" },
  { id: 5, category: "Nutrition",  author: "Sarah Johnson",   readTime: "6 min", date: "Nov 25, 2025", image: "/assets/workout-2.jpg" },
  { id: 6, category: "Health",     author: "Dr. Lisa Park",   readTime: "9 min", date: "Nov 22, 2025", image: "/assets/workout-3.jpg" },
];

const categoryList = ["All", "Training", "Nutrition", "Recovery", "Health"];

const getCategoryStyle = (category: string): string => {
  switch (category) {
    case "Training":  return "bg-primary/20 text-primary border-primary/30";
    case "Nutrition": return "bg-accent/20 text-accent border-accent/30";
    case "Recovery":  return "bg-secondary text-foreground border-border";
    case "Health":    return "bg-primary/10 text-primary/80 border-primary/20";
    default:          return "bg-secondary text-muted-foreground border-border";
  }
};

const Articles = () => {
  const [searchTerm, setSearchTerm]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { t } = useTranslation();

  const filteredArticles = articles.filter((article) => {
    const title = t(`articles.items.${article.id}.title`);
    const desc  = t(`articles.items.${article.id}.description`);
    const matchesSearch   = title.toLowerCase().includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4 mx-auto flex justify-center w-fit">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Articles</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-center text-foreground mb-3">{t("articles.title")}</h1>
          <p className="text-muted-foreground text-center text-base max-w-xl mx-auto mb-8">{t("articles.subtitle")}</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("articles.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              )}
            >
              {cat === "All" ? t("articles.all") : t(`articles.categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article, index) => (
            <div
              key={article.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={t(`articles.items.${article.id}.title`)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border", getCategoryStyle(article.category))}>
                    {t(`articles.categories.${article.category}`)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2 leading-snug">
                  {t(`articles.items.${article.id}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {t(`articles.items.${article.id}.description`)}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">{article.date}</span>
                  <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
                    {t("articles.readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("articles.noArticles")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
