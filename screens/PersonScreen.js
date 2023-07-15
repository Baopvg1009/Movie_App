import {
  View,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "my-3";
import { styles, theme } from "../theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/MovieList";
import Loading from "../components/loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovie,
  image342,
} from "../api/moviedb";
export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const navigation = useNavigation();
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState([]);

  const [loading, SetLoadding] = useState(false);

  useEffect(() => {
    SetLoadding(true);
    // console.log("person: ", item);
    getPersonDetail(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetail = async (id) => {
    const data = await fetchPersonDetails(id);
    // console.log("got person details", data);
    if (data) setPerson(data);
    SetLoadding(false);
  };
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovie(id);
    // console.log("got person movie", data);
    if (data) setPersonMovies(data.cast);
    // SetLoadding(false);
  };
  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Back button */}
      <SafeAreaView
        className={
          " z-20 w-full flex-row justify-between items-center px-4  " +
          verticalMargin
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
          <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
              <Image
                // source={require("../assets/images/castImage2.png")}
                source={{
                  uri: image342(person?.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              ></Image>
            </View>
          </View>
          <View className="mt-6">
            <Text className=" text text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className=" text-base text-neutral-500 text-center">
              {person?.place_of_birth}
            </Text>
          </View>
          <View className=" mx-3 p-4 mt-6 flex-row justify-betweenn items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.gender == 1 ? "Female" : "Male"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.birthday}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Know for</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.known_for_department}
              </Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.popularity?.toFixed(2)} %{/* Lam tron 2 con so cuoi */}
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-300 tracking-wide">
              {person?.biography || "N/A"}
            </Text>
          </View>
          {/* Movies */}
          <MovieList title={"Movies"} hideSeeAll={true} data={personMovies} />
        </View>
      )}

      {/* person detail */}
    </ScrollView>
  );
}
