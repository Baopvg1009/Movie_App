import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

export default function Cast({ cast }) {
  let personName = " Keanu Reevs";
  let characterName = "John Wick";
  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity key={index} className="mr-4 items-center">
                <Text className="text-white text text-xs mt-1">
                  {characterName.length > 10
                    ? characterName.slice(0, 10) + "...."
                    : characterName}
                </Text>
                <Text className="text-neutral-400 text text-xs mt-1">
                  {personName.length > 10
                    ? personName.slice(0, 10) + "...."
                    : personName}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
