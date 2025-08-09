import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Clock, User } from "lucide-react";

export default function Tutorial() {
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with RAHMAT Monitor",
      description: "Learn the basics of setting up and configuring your monitoring dashboard for optimal performance.",
      videoId: "dQw4w9WgXcQ", // Example YouTube video ID
      duration: "15:32",
      author: "RAHMAT Team",
      difficulty: "Beginner",
      topics: ["Setup", "Configuration", "First Steps"]
    },
    {
      id: 2,
      title: "Advanced GPS Tracking Features",
      description: "Explore advanced GPS tracking capabilities including geofencing, route optimization, and location analytics.",
      videoId: "dQw4w9WgXcQ",
      duration: "22:18",
      author: "RAHMAT Team",
      difficulty: "Intermediate",
      topics: ["GPS", "Tracking", "Analytics"]
    },
    {
      id: 3,
      title: "Camera Feed Management",
      description: "Master camera feed configuration, quality settings, and security features for comprehensive monitoring.",
      videoId: "dQw4w9WgXcQ",
      duration: "18:45",
      author: "RAHMAT Team",
      difficulty: "Intermediate",
      topics: ["Camera", "Security", "Monitoring"]
    },
    {
      id: 4,
      title: "Alert System Configuration",
      description: "Set up intelligent alerts and notifications to stay informed about critical events and system status changes.",
      videoId: "dQw4w9WgXcQ",
      duration: "12:56",
      author: "RAHMAT Team",
      difficulty: "Beginner",
      topics: ["Alerts", "Notifications", "Automation"]
    }
  ];

  const articles = [
    {
      id: 1,
      title: "Best Practices for Device Monitoring",
      excerpt: "Discover proven strategies for effective device monitoring that ensure optimal performance and reliability.",
      readTime: "8 min read",
      category: "Best Practices"
    },
    {
      id: 2,
      title: "Understanding Real-time Data Analytics",
      excerpt: "Learn how to interpret and leverage real-time data from your monitoring dashboard for better decision making.",
      readTime: "12 min read",
      category: "Analytics"
    },
    {
      id: 3,
      title: "Security Guidelines for Remote Monitoring",
      excerpt: "Essential security practices to protect your monitoring infrastructure and sensitive data from threats.",
      readTime: "10 min read",
      category: "Security"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="tutorial-title">
          RAHMAT Monitor Tutorial Center
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="tutorial-description">
          Master your monitoring dashboard with our comprehensive guides and video tutorials
        </p>
      </div>

      {/* Video Tutorials Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <Play className="text-primary" size={24} />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="video-tutorials-title">
            Video Tutorials
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`tutorial-card-${tutorial.id}`}>
              <div className="relative">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <a 
                    href={`https://www.youtube.com/watch?v=${tutorial.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-16 h-16 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200"
                    data-testid={`play-video-${tutorial.id}`}
                  >
                    <Play className="text-white ml-1" size={24} />
                  </a>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/70 text-white" data-testid={`duration-${tutorial.id}`}>
                    {tutorial.duration}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg" data-testid={`tutorial-title-${tutorial.id}`}>
                    {tutorial.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(tutorial.difficulty)} data-testid={`difficulty-${tutorial.id}`}>
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <CardDescription data-testid={`tutorial-description-${tutorial.id}`}>
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User size={16} className="mr-2" />
                    <span data-testid={`author-${tutorial.id}`}>{tutorial.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tutorial.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs" data-testid={`topic-${tutorial.id}-${index}`}>
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-primary" size={24} />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="articles-title">
            Featured Articles
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" data-testid={`article-card-${article.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <Badge variant="outline" data-testid={`category-${article.id}`}>
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} className="mr-1" />
                    <span data-testid={`read-time-${article.id}`}>{article.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-lg" data-testid={`article-title-${article.id}`}>
                  {article.title}
                </CardTitle>
                <CardDescription data-testid={`article-excerpt-${article.id}`}>
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="getting-started-title">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="getting-started-description">
          Explore our comprehensive monitoring dashboard and discover how RAHMAT Monitor can help you maintain optimal system performance and security.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://www.youtube.com/playlist?list=PLrAXtmRdnEQKWkrm-XDDmzn5GQCvw3qyF" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            data-testid="watch-playlist-button"
          >
            <Play size={20} className="mr-2" />
            Watch Full Playlist
          </a>
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
            data-testid="back-to-dashboard-button"
          >
            Back to Dashboard
          </a>
        </div>
      </section>
    </div>
  );
}