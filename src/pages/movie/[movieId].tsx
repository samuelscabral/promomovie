import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllMovies, getMovie } from "utils/apiWrapper";
import { MovieDetailed } from "utils/apiWrapper/apiTypes";
import { ParsedUrlQuery } from "querystring";

interface MovieProps {
  movie: MovieDetailed;
}

export default function Movies({ movie }: MovieProps) {
  return <div key={movie.id}> {movie.title}</div>;
}

interface PageParams extends ParsedUrlQuery {
  movieId: string;
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PageParams>): Promise<
  GetStaticPropsResult<MovieProps>
> {
  const movieId = params?.movieId;

  if (!movieId)
    return {
      notFound: true,
    };

  const movie = await getMovie(movieId);

  if (!movie)
    return {
      notFound: true,
    };

  return {
    props: {
      movie,
    },
    revalidate: 60 * 60 * 24,
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<PageParams>
> {
  const movieList = await getAllMovies();
  const paths = movieList.results.map((movie) => ({
    params: {
      movieId: movie.id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
