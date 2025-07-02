
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar } from "lucide-react";

// Mock data for movies
const featuredMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
    rating: 8.4,
    genre: ["Action", "Adventure", "Drama"],
    language: "English",
    duration: "181 min",
    releaseDate: "2019-04-26",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins."
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop",
    rating: 8.2,
    genre: ["Action", "Adventure", "Sci-Fi"],
    language: "English",
    duration: "148 min",
    releaseDate: "2021-12-17",
    description: "Spider-Man's identity is revealed and he can no longer separate his normal life from his superhero responsibilities."
  },
  {
    id: 3,
    title: "The Batman",
    poster: "https://images.unsplash.com/photo-1635863138275-d9864d73fda5?w=300&h=450&fit=crop",
    rating: 7.8,
    genre: ["Action", "Crime", "Drama"],
    language: "English",
    duration: "176 min",
    releaseDate: "2022-03-04",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues."
  }
];

const allMovies = [
  ...featuredMovies,
  {
    id: 4,
    title: "Dune",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    rating: 8.0,
    genre: ["Action", "Adventure", "Drama"],
    language: "English",
    duration: "155 min",
    releaseDate: "2021-10-22",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset."
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=450&fit=crop",
    rating: 8.3,
    genre: ["Action", "Drama"],
    language: "English",
    duration: "130 min",
    releaseDate: "2022-05-27",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator."
  },
  {
    id: 6,
    title: "Black Panther",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 7.3,
    genre: ["Action", "Adventure", "Sci-Fi"],
    language: "English",
    duration: "134 min",
    releaseDate: "2018-02-16",
    description: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people."
  }
];

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const genres = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Crime"];

  const filteredMovies = selectedGenre === "All" 
    ? allMovies 
    : allMovies.filter(movie => movie.genre.includes(selectedGenre));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-red-600">BookMyShow</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Mumbai</span>
              </div>
              <Button variant="outline" size="sm">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Featured Movies */}
      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Featured Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMovies.map((movie) => (
              <Card key={movie.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
                <div className="flex">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-l-lg"
                  />
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{movie.rating}/10</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-white/80 mb-2">{movie.duration}</p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Book Now
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Movie Listings */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Movies in Mumbai</h2>
            
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <Card key={movie.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    {movie.rating}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">{movie.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genre.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{movie.language} • {movie.duration}</span>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="sm">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">BookMyShow</h3>
          <p className="text-gray-400 text-sm">Your ultimate destination for movie bookings</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
