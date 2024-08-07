const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2U0YjcwMTVlOGEwOTNhNjZjNWRkM2Y0MWY2MzNhNCIsIm5iZiI6MTcxOTM4ODYyOS43MjIwNjIsInN1YiI6IjY0Yjc2ZjBiZjI2M2JhMDEzOWYzZmQ2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0BkrHQM5ZY1GIepygYoKohjAfWx8-OLG9OBYWnUo-zQ'; // Replace with your actual Bearer token

const API_BASE_URL = 'https://api.themoviedb.org/3';

// Movie Endpoints
const getTrendingMoviesUrlByDay = () => `${API_BASE_URL}/trending/movie/day?language=en-US`;
const getTrendingMoviesUrlByWeek = () => `${API_BASE_URL}/trending/movie/week?language=en-US`;
const getUpcomingMoviesUrl = () => `${API_BASE_URL}/movie/upcoming?language=en-US&page=1`;
const getTopRatedMoviesUrl = () => `${API_BASE_URL}/movie/top_rated?language=en-US&page=1&sort_by=vote_average.desc`;
const getPopularMoviesUrl = () => `${API_BASE_URL}/movie/popular?language=en-US&page=1`;
const getTheatresMoviesUrl = () => `${API_BASE_URL}/movie/now_playing?language=en-US&page=1`;

const getMovieDetailsUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}&language=en-US?append_to_response=external_ids`;
const getMovieCreditsUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/credits`;
const getSimilarMoviesUrl = (movieId, page = 1) => `${API_BASE_URL}/movie/${movieId}/similar?language=en-US&page=${page}`;
const getMovieReviewsUrl = (movieId, page = 1) => `${API_BASE_URL}/movie/${movieId}/reviews?language=en-US&page=${page}`;
const getYoutubeVideosUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/videos`;
const getWatchProvidersUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/watch/providers`;
const getGenresUrl = () => `${API_BASE_URL}/genre/movie/list`;
const getMoviesByGenreUrl = (genreId, page) => `${API_BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}`;
const getMovieReleaseDate = (movieId) => `${API_BASE_URL}/movie/${movieId}/release_dates`;
const getMovieBackdrops = (movieId) => `${API_BASE_URL}/movie/${movieId}/images`;
const getRecommendation= (movieId) => `${API_BASE_URL}/movie/${movieId}/recommendations`;
const getKeywords = (movieId) => `${API_BASE_URL}/movie/${movieId}/keywords`;

// Person Endpoints
const getTrendingTvUrlByDay = () => `${API_BASE_URL}/trending/tv/day?language=en-US`;
const getTrendingTvUrlByWeek = () => `${API_BASE_URL}/trending/tv/week?language=en-US`;
const getPersonDetailsUrl = (personId) => `${API_BASE_URL}/person/${personId}?append_to_response=external_ids`;
const getPersonImagesUrl = (personId) => `${API_BASE_URL}/person/${personId}/images`;
const getPersonCombinedCreditsUrl = (personId) => `${API_BASE_URL}/person/${personId}/combined_credits?language=en-US`;
const getPopularPersonUrl = (page) => `${API_BASE_URL}/person/popular?language=en-US&page=${page}`;
const getSearchPersonUrl = (query, page) => `${API_BASE_URL}/search/person?query=${encodeURIComponent(query)}&include_adult=true&language=en-US&page=${page}`;

// TV Endpoints
const getTvDetailsUrl = (tvId) => `${API_BASE_URL}/tv/${tvId}?language=en-US&append_to_response=external_ids`;
const getTvCreditsUrl = (tvId) => `${API_BASE_URL}/tv/${tvId}/aggregate_credits?language=en-US`;
const getTrendingTvUrl = (page) => `${API_BASE_URL}/trending/tv/day?language=en-US&page=${page}`;
const getAirOnToday = (page) => `${API_BASE_URL}/tv/airing_today?language=en-US&page=${page}`;
const getOnTheAir = (page) => `${API_BASE_URL}/tv/on_the_air?language=en-US&page=${page}`;
const getPopularTvShow = (page) => `${API_BASE_URL}/tv/popular?language=en-US&page=${page}`;
const getTopRatedTvShow = (page) => `${API_BASE_URL}/tv/top_rated?language=en-US&page=${page}`;
const getSimilarTvSeries = (tvId, page = 1) => `${API_BASE_URL}/tv/${tvId}/similar?language=en-US&page=${page}`;
const getTvSeriesByCategory = () => `${API_BASE_URL}/genre/tv/list?language=en-US`;
const getTvSeriesReview = (tvId, page = 1) => `${API_BASE_URL}/tv/${tvId}/reviews?language=en-US&page=${page}`;
const getTvYoutubeVideosUrl = (tvId) => `${API_BASE_URL}/tv/${tvId}/videos`;
const getTvWatchProvidersUrl = (tvId) => `${API_BASE_URL}/tv/${tvId}/watch/providers`;
const getTvReleaseDate = (tvId) => `${API_BASE_URL}/tv/${tvId}/release_dates`;
const getTvBackdrops = (tvId) => `${API_BASE_URL}/tv/${tvId}/images`;
const getTvRecommnedation = (tvId) => `${API_BASE_URL}/tv/${tvId}/recommendations`;
const getTvKeywords = (tvId) => `${API_BASE_URL}/tv/${tvId}/keywords`;
const getViewAllSeasons = (tvId) => `${API_BASE_URL}/tv/${tvId}?language=en-US`;

const getAiringTodayTvUrl = () => `${API_BASE_URL}/tv/airing_today?language=en-US&page=1`;
const getOnTheAirTvUrl = () => `${API_BASE_URL}/tv/on_the_air?language=en-US&page=1`;
const getPopularTvUrl = () => `${API_BASE_URL}/tv/popular?language=en-US&page=1`;
const getTopRatedTvUrl = () => `${API_BASE_URL}/tv/top_rated?language=en-US&page=1`;


// Collection Endpoint
const getCollectionUrl = (collectionId) => `${API_BASE_URL}/collection/${collectionId}?language=en-US`;

// Other Endpoints
const WATCH_PROVIDERS_URL = `${API_BASE_URL}/watch/providers/movie?watch_region=IN`;
const DISCOVER_TV_FREE_TO_WATCH_URL = (providerId) => `${API_BASE_URL}/discover/tv?with_watch_providers=${providerId}&watch_region=IN`;
const DISCOVER_MOVIE_FREE_TO_WATCH_URL = (providerId) => `${API_BASE_URL}/discover/movie?with_watch_providers=${providerId}&watch_region=IN`;

// Season Enpoints
export const getTVSeasonDataUrl = (seriesId, seasonNumber) =>`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?language=en-US`;
export const getTVCastDataUrl = (seriesId, seasonNumber) =>`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/credits?language=en-US`;
export const getTVImagesDataUrl = (seriesId, seasonNumber) =>`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/images`;
export const getTVVideosDataUrl = (seriesId, seasonNumber) =>`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/videos?language=en-US`;


export const getEpisodeDetails = (tvId, seasonNumber, episodeNumber) =>`${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`;
export const getEpisodeImages = (tvId, seasonNumber, episodeNumber) =>`${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images`;
export const getEpisodeVideos = (tvId, seasonNumber, episodeNumber) =>`${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`;

// Exporting all constants and functions
module.exports = {
  BEARER_TOKEN,
  API_BASE_URL,
  getTrendingMoviesUrlByDay,
  getTrendingMoviesUrlByWeek,
  getUpcomingMoviesUrl,
  getTopRatedMoviesUrl,
  getPopularMoviesUrl,
  getMovieDetailsUrl,
  getMovieCreditsUrl,
  getSimilarMoviesUrl,
  getMovieReviewsUrl,
  getYoutubeVideosUrl,
  getWatchProvidersUrl,
  getGenresUrl,
  getMoviesByGenreUrl,
  getMovieReleaseDate,
  getMovieBackdrops,
  getRecommendation,
  getKeywords,
  getPersonDetailsUrl,
  getPersonImagesUrl,
  getPersonCombinedCreditsUrl,
  getPopularPersonUrl,
  getSearchPersonUrl,
  getTvDetailsUrl,
  getTvCreditsUrl,
  getAirOnToday,
  getOnTheAir,
  getPopularTvShow,
  getTopRatedTvShow,
  getSimilarTvSeries,
  getTvSeriesByCategory,
  getTvSeriesReview,
  getTvYoutubeVideosUrl,
  getTvWatchProvidersUrl,
  getTvReleaseDate,
  getTvBackdrops,
  getTvRecommnedation,
  getTvKeywords,
  getCollectionUrl,
  WATCH_PROVIDERS_URL,
  DISCOVER_TV_FREE_TO_WATCH_URL,
  DISCOVER_MOVIE_FREE_TO_WATCH_URL,
  getViewAllSeasons,
  getTVSeasonDataUrl,
  getTVCastDataUrl,
  getTVImagesDataUrl,
  getTVVideosDataUrl,
  getEpisodeDetails,
  getEpisodeImages,
  getEpisodeVideos,
  getTheatresMoviesUrl,
  getAiringTodayTvUrl,
  getOnTheAirTvUrl,
  getPopularTvUrl,
  getTopRatedTvUrl,
  getTrendingTvUrlByDay,
  getTrendingTvUrlByWeek,
  getTrendingTvUrl
};



