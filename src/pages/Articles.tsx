import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";

const articles = [
  { id: 1, category: "Training", author: "Dr. John Smith", readTime: "8 min", date: "Dec 5, 2025", image: "/assets/workout-1.jpg" },
  { id: 2, category: "Nutrition", author: "Sarah Johnson", readTime: "6 min", date: "Dec 3, 2025", image: "/assets/workout-2.jpg" },
  { id: 3, category: "Recovery", author: "Mike Chen", readTime: "5 min", date: "Dec 1, 2025", image: "/assets/workout-3.jpg" },
  { id: 4, category: "Training", author: "Dr. John Smith", readTime: "7 min", date: "Nov 28, 2025", image: "/assets/workout-1.jpg" },
  { id: 5, category: "Nutrition", author: "Sarah Johnson", readTime: "6 min", date: "Nov 25, 2025", image: "/assets/workout-2.jpg" },
  { id: 6, category: "Health", author: "Dr. Lisa Park", readTime: "9 min", date: "Nov 22, 2025", image: "/assets/workout-3.jpg" },
];

const categoryList = ["All", "Training", "Nutrition", "Recovery", "Health"];

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { t } = useTranslation();

  const filteredArticles = articles.filter((article) => {
    const title = t(`articles.items.${article.id}.title`);
    const desc = t(`articles.items.${article.id}.description`);
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Training": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Nutrition": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Recovery": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Health": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('articles.title')}</h1>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-8">{t('articles.subtitle')}</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('articles.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categoryList.map((cat) => (
            <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}>
              {cat === "All" ? t('articles.all') : t(`articles.categories.${cat}`)}
            </Button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <Card key={article.id} className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02]" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative h-48 overflow-hidden">
                <img src={article.image} alt={t(`articles.items.${article.id}.title`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3"><Badge variant="outline" className={`${getCategoryColor(article.category)} border`}>{t(`articles.categories.${article.category}`)}</Badge></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">{t(`articles.items.${article.id}.title`)}</CardTitle>
                <CardDescription className="line-clamp-2">{t(`articles.items.${article.id}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{article.author}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{article.readTime}</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <Button variant="ghost" size="sm" className="group/btn">{t('articles.readMore')}<ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredArticles.length === 0 && (<div className="text-center py-16"><p className="text-muted-foreground text-lg">{t('articles.noArticles')}</p></div>)}
      </section>
    </div>
  );
};

export default Articles;
