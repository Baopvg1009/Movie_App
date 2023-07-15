import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import Cast1 from "../components/cast";
import MovieList from "../components/MovieList";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchCreditsMovie,
  fetchDetailsMovies,
  fetchSimilarMovie,
  image500,
} from "../api/moviedb";
var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-1";

export default function MovieScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovies, setsimilarMovies] = useState([]);
  const [loading, SetLoadding] = useState(false);
  const [movie, setMovie] = useState([]);
  let movieName = "Ant-Man and the wasp: Qualumiana";

  useEffect(() => {
    //call the api
    // console.log("id", item.id);
    SetLoadding(true);
    getMovieDetail(item.id);
    getMovieCredits(item.id);
    getMovieSimilar(item.id);
  }, [item]);

  const getMovieDetail = async (id) => {
    const data = await fetchDetailsMovies(id);
    // console.log("got the movie", data);
    if (data) setMovie(data);
    SetLoadding(false);
  };
  const getMovieCredits = async (id) => {
    const data = await fetchCreditsMovie(id);
    // console.log("got credits:", data);
    if (data && data.cast) setCast(data.cast);
  };
  const getMovieSimilar = async (id) => {
    const data = await fetchSimilarMovie(id);
    // console.log("got similar:", data);
    if (data && data.results) setsimilarMovies(data.results);
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      className="flex-1 bg-neutral-900 pt-7"
    >
      {/* back button and movie poster */}
      <View className="w-full">
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4  " +
            topMargin
          }
        >
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon
              size="28"
              style={styles.background}
              strokeWidth={2.5}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size="35"
              color={isFavourite ? theme.background : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              // source={require("../assets/images/moviePoster2.png")}
              source={{
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      {/* Movie detail */}
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        {/* Title */}
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie?.title}
        </Text>
        {/* status, release, runtime */}

        {movie?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {movie?.status} • {movie?.release_date?.split("-")[0]} •
            {movie?.runtime} min
          </Text>
        ) : null}
        {/* genres */}
        <View className="flex-row justify-center mx-4 space-x-2">
          {movie?.genres?.map((genres, index) => {
            let showDot = index + 1 != movie.genres.length;
            return (
              <Text
                key={index}
                className="text-neutral-400 font-semibold text-base text-center"
              >
                {genres?.name} {showDot ? "•" : null}
                {/* nếu biến showDot là true, dấu chấm động (•) sẽ được hiển thị */}
              </Text>
            );
          })}
        </View>
        {/* Destcription */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {movie?.overview}
        </Text>
      </View>
      {/* Cast */}
      <Cast1 navigation={navigation} cast={cast} />
      {/* similat movies */}
      <MovieList
        title="Similar Movies"
        hideSeeAll={true}
        data={similarMovies}
      />
    </ScrollView>
  );
}
