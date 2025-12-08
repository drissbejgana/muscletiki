import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "The Ultimate Guide to Building Muscle",
    description: "Learn the science-backed strategies for maximizing muscle growth through proper training and nutrition.",
    category: "Training",
    author: "Dr. John Smith",
    readTime: "8 min read",
    date: "Dec 5, 2025",
    image: "/assets/workout-1.jpg",
  },
  {
    id: 2,
    title: "Nutrition Basics for Beginners",
    description: "Everything you need to know about macros, meal timing, and eating for your fitness goals.",
    category: "Nutrition",
    author: "Sarah Johnson",
    readTime: "6 min read",
    date: "Dec 3, 2025",
    image: "/assets/workout-2.jpg",
  },
  {
    id: 3,
    title: "Recovery: The Missing Piece",
    description: "Why rest days are just as important as workout days for achieving your fitness goals.",
    category: "Recovery",
    author: "Mike Chen",
    readTime: "5 min read",
    date: "Dec 1, 2025",
    image: "/assets/workout-3.jpg",
  },
  {
    id: 4,
    title: "Progressive Overload Explained",
    description: "Master the fundamental principle that drives all strength and muscle gains.",
    category: "Training",
    author: "Dr. John Smith",
    readTime: "7 min read",
    date: "Nov 28, 2025",
    image: "/assets/workout-1.jpg",
  },
  {
    id: 5,
    title: "Pre-Workout vs Post-Workout Nutrition",
    description: "What to eat before and after your workouts to optimize performance and recovery.",
    category: "Nutrition",
    author: "Sarah Johnson",
    readTime: "6 min read",
    date: "Nov 25, 2025",
    image: "/assets/workout-2.jpg",
  },
  {
    id: 6,
    title: "How to Prevent Common Gym Injuries",
    description: "Stay safe and injury-free with these essential tips for proper form and technique.",
    category: "Health",
    author: "Dr. Lisa Park",
    readTime: "9 min read",
    date: "Nov 22, 2025",
    image: "/assets/workout-3.jpg",
  },
];

const categories = ["All", "Training", "Nutrition", "Recovery", "Health"];

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Training":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Nutrition":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Recovery":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Health":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Fitness Articles
          </h1>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-8">
            Expert advice, training tips, and nutrition guides to help you reach your fitness goals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <Card
              key={article.id}
              className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="outline" 
                    className={`${getCategoryColor(article.category)} border`}
                  >
                    {article.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <Button variant="ghost" size="sm" className="group/btn">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Articles;