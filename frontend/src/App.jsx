import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // Stato per tenere traccia dell'ordine di ordinamento

  const fetchMovies = () => {
    setLoading(true);

    return fetch('http://localhost:8000/movies')
      .then(response => response.json())
      .then(data => {
        // Ordina i film in base all'anno di uscita e all'ordine corrente
        const sortedMovies = sortOrder === 'asc' ? data.sort((a, b) => a.year - b.year) : data.sort((a, b) => b.year - a.year);
        setMovies(sortedMovies);
        console.log(sortedMovies)
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, [sortOrder]); // Aggiungi sortOrder come dipendenza per richiamare fetchMovies quando cambia

  // Gestore di eventi per il click del bottone di ordinamento per il rating
  const handleSortByRatingClick = () => {
    // Creazione di una copia dell'array
    const moviesCopy = [...movies];

    // Ordina i film in base al rating
    const sortedMovies = moviesCopy.sort((a, b) => b.rating - a.rating);
    setMovies(sortedMovies);
  };

  const filterMoviesByCategory = (category) => {
    // Filtra i film che corrispondono alla categoria specificata
    const filteredMovies = movies.filter(movie => movie.category === category);
    setMovies(filteredMovies);
  };

  // Gestore di eventi per il click del bottone di ordinamento
  const handleSortClick = () => {
    // Cambia l'ordine corrente in base all'ordine attuale
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Layout>
      <Heading />

      <div className="flex justify-end mb-4 mr-4">
        {/* Aggiungi il bottone di ordinamento */}
        <Button color="primary" size="sm" onClick={handleSortClick}>
          {sortOrder === 'asc' ? 'Ordina per Anno (Asc)' : 'Ordina per Anno (Desc)'}
        </Button>
        {/* Aggiungi il bottone di ordinamento per rating */}
        <Button color="primary" size="sm" onClick={handleSortByRatingClick}>
          Ordina per Rating
        </Button>
        <Button color="primary" size="sm" onClick={() => filterMoviesByCategory('action')}>
          Filtra per Categoria: Azione
        </Button>
      </div>
      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="max-w-screen-sm mx-auto mb-8 text-center lg:mb-16">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Movie Collections
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col h-full p-3 grow">
        <div className="mb-3 grow last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between mb-2 text-xs font-medium text-gray-900 align-middle">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="mb-1 text-lg font-semibold leading-tight text-gray-900">
            {props.title}
          </h3>

          <p className="mb-4 text-sm leading-normal text-gray-600 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
