import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

import Loading from "../components/loading";
import debounce from "lodash.debounce";
import { fallbackMoviePoster, image185, searchMovie } from "../api/moviedb";
var { width, height } = Dimensions.get("window");
export default function SearchScrean() {
  const navigation = useNavigation();
  const [results, SetResults] = useState([]);
  const [loading, SetLoadding] = useState(false);
  let movieName = "Ant-Man and the wasp: Qualumiana";
  const handleSearch = (value) => {
    if (value && value.length > 2) {
      SetLoadding(true);
      searchMovie({
        query: value,
         include_adult: 'false',
         language: 'en-US',
          page: '1'
      }).then((data) => {
        SetLoadding(false);
        // console.log("got search results", data);

        if (data && data.results) SetResults(data.results);
      });
    } else {
      SetLoadding(false);
      SetResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 600), []);
  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View className=" mx-4 mb3 flex-row justify-between items-center border border-e-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          className="pb-1 flex-1 pl-6 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon size="25" color="white" />
        </TouchableOpacity>
      </View>
      {/* results */}

      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      className="rounded-3xl"
                      // source={require("../assets/images/moviePoster2.png")}
                      source={{uri: image185(item?.poster_path) || fallbackMoviePoster}}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-neutral-300 ml-1">
                      {item?.title?.length > 22
                        ? item?.title.slice(0, 22) + "..."
                        : item?.title}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            source={require("../assets/images/movieTime.png")}
            className="h-96 w-96"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
