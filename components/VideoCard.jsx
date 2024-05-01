import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from "react-native";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import { likeDislikeVideo } from '../lib/appwrite';

const VideoCard = ({VideoItem : {title, $id , liked, thumbnail ,video, creator:{username, avatar}},allitem}) => {
    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [isliking , setIslikning] = useState(false);

    const bookmarkPost = async () => {
      try {
        setIslikning(true);
        await likeDislikeVideo(user.$id, $id);
        setBookmark(!bookmark);
        Alert.alert('Success', `Video ${!bookmark ? 'Likes' : 'Dislike'}`);
      } catch (error) {
        setIslikning(false)
        Alert.alert('Error', error.message);
        console.log(error);
      }finally{
        setIslikning(false)
      }
    }
    
    return (
        <View className="flex flex-col items-center px-4 mb-14">
           <View className="flex absolute justify-center items-center top-2/4 left-2/4 z-20" style={Platform.OS === 'android' ? {transform: [{ translateX: -40 }, { translateY: -25 }]} : {transform: [{ translateX: -20 }, { translateY: -20 }]}}>
              <ActivityIndicator size={Platform.OS === 'android' ? 80 : "large"} color="rgb(249,115,22)" animating={isliking}/> 
           </View>
          <View className="flex flex-row gap-3 items-start">
            <View className="flex justify-center items-center flex-row flex-1">
              <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
    
              <View className="flex justify-center flex-1 ml-3 gap-y-1">
                <Text
                  className="font-psemibold text-sm text-white"
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text
                  className="text-xs text-gray-100 font-pregular"
                  numberOfLines={1}
                >
                  {username}
                </Text>
              </View>
            </View>

            <View className="pt-2">
            <TouchableOpacity className="w-full items-end mr-10" onPress={() => bookmarkPost()}>
                <Image source={liked != undefined ? (liked.length > 0 || bookmark ? icons.heart_fill: icons.heart) : icons.heart} className={liked != undefined ? (liked.length > 0 || bookmark ? "w-7 h-7" : "w-5 h-5") : icons.heart} resizeMode="contain" />
            </TouchableOpacity>
            </View>
          </View>
    
           {play ? (
            <Video
            source={{ uri: video }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                setPlay(false);
                }
            }}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPlay(true)}
              className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
            >
              <Image
                source={{ uri: thumbnail }}
                className="w-full h-full rounded-xl mt-3"
                resizeMode="cover"
              />
    
              <Image
                source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )} 
        </View>
      );
    
}

export default VideoCard