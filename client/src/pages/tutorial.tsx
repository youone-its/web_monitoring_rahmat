import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Clock, User } from "lucide-react";

export default function Tutorial() {
  const tutorials = [
    {
      id: 1,
      title: "RAHMAt Monitor?",
      description: "video ini dibuat untuk membantu kamu memahami cara menggunakan RAHMAT Monitor",
      videoId: "2Gxz9DIltCE",
    },
    {
      id: 2,
      title: "Tracking GPS",
      description: "di video ini kamu bisa tahu gimana cara menggunakan fitur GPS pada RAHMAt",
      videoId: "2Gxz9DIltCE",
    },
    {
      id: 3,
      title: "Camera Monitoring",
      description: "Di sini ada penjelasan tentang cara memantau kamera pendant RAHMAt",
      videoId: "2Gxz9DIltCE",
    },
    {
      id: 4,
      title: "RAHMAt Device Tutorial",
      description: "Ini video untuk menjelaskan cara menggunakan RAHMAt device",
      videoId: "2Gxz9DIltCE",
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
        <p className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="tutorial-description">
          Laman ini disediakan untuk memberi penjelasan terkait penggunaan RAHMAt device dan monitor. Jika ada informasi yang tidak tersedia di laman ini, silahkan hubungi kami via email        </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="tutorial-description">
          @rahmatits2025@gmail.com        </p>
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
                {/* Duration removed */}
              </div>
              
              <CardHeader>
                <div className="flex items-start">
                  <CardTitle className="text-lg" data-testid={`tutorial-title-${tutorial.id}`}>
                    {tutorial.title}
                  </CardTitle>
                </div>
                <CardDescription data-testid={`tutorial-description-${tutorial.id}`}>
                  {tutorial.description}
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