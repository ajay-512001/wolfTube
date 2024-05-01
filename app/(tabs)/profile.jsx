import { View, Text, FlatList, Image, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserPosts, signOut, uploadProfilePicture } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from './../../components/VideoCard';
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from './../../context/GlobalProvider';
import { Images, icons } from '../../constants';
import { ResizeMode } from 'expo-av';
import InfoBox from '../../components/InfoBox';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  const [outing, setOuting] = useState(false);
  let { user, setIsLogged, setUser } = useGlobalContext();
  const { data: posts , refetch } = useAppwrite(() => getUserPosts(user.$id));
  const [image, setImage] = useState("");
  const [editbtn, setEditbtn] = useState(false);

  const [Refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false)
  }


  const openPicker = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled){
      setImage(result.assets[0])
      setEditbtn(true)
    }
  }

  const submit = async() => {
    setOuting(true);
    try {
      let updateuser = await uploadProfilePicture(image , user?.$id);
      Alert.alert("Success" , "Profile updated successfully");
      // const result = await getCurrentUser();
      // setUser(result);
      user["avatar"] = updateuser.avatar;
      setEditbtn(false);
      setRefreshing(true)
      await refetch();
      setRefreshing(false)
    } catch (error) {
      Alert.alert("Error here" , error.message)
    }finally{
      setImage("")
      setOuting(false);
      setEditbtn(false);
    }
  }

  const logout = async () => {
    
    Alert.alert("Confirmation" , "Are you want to sign-out ?" , [
      {
        text:"Yes",
        onPress: async () =>{
          setOuting(true);
          await signOut();
          setIsLogged(false)
          setUser(null)
          setOuting(false);
          router.replace('/sign_in');
        }},
        {
          text:"No",

        }
    ])
  }

    return (
      /* ( outing ? 
        <View className="flex flex-1 justify-center items-center bg-loaderPrimary">
          <ActivityIndicator size='large' color="rgb(249,115,22)"/> 
        </View> 
      
        : */
      <SafeAreaView className="bg-primary h-full">
        <View className="flex absolute justify-center items-center top-2/4 left-2/4 z-20" style={Platform.OS === 'android' ? {transform: [{ translateX: -40 }, { translateY: -25 }]} : {transform: [{ translateX: -20 }, { translateY: -20 }]}}>
            <ActivityIndicator size={Platform.OS === 'android' ? 80 : "large"} color="rgb(249,115,22)" animating={outing}/> 
        </View>
        <FlatList 
        scrollEnabled={!outing}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard  VideoItem={item}  allitem={item}/>
        )}
        ListHeaderComponent={() => (
         <View className="w-full justify-center items-center mb-12 mt-10 px-8">
            <TouchableOpacity className="w-full items-end mb-10"
            onPress={logout}
            >
              <Image source={icons.logout} ResizeMode="contain" className="w-6 h-6"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={openPicker}>
            <View className="w-16 h-16 justify-center border border-secondary rounded-lg items-center">
            
              <Image source={editbtn ? {uri : image.uri } : {uri : user?.avatar}} 
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
              
            </View>
            </TouchableOpacity>
           <View>{
            editbtn &&
            <CustomButton
              title="Update"
              handlePress={submit}
              containerStyles="min-h-[22px] mt-2"
              textStyles="text-sm ml-2 mr-2"
              other
              isLoading={outing}
            />
            }
            </View>


            <InfoBox
              title={user?.username}
              containerStyle='mt-5'
              titleStyle = "text-lg"
            />
            <View className="flex-1 flex-row justify-center items-center">
              <InfoBox
                title={posts.length || 0}
                subTitle ="Posts"
                containerStyle='mr-10'
                titleStyle = "text-xl"
              />
              <InfoBox
                title="1.2K"
                subTitle ="Followers"
                titleStyle = "text-xl"
              />
            </View>
         </View>
        )}
  
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No videos found with this query"
          />
        )}

        refreshControl={<RefreshControl 
          refreshing={Refreshing} 
          onRefresh={onRefresh} 
          tintColor="rgb(249,115,22)" 
          title="Pull to refresh" 
          titleColor="#fff" 
          size="large" 
          progressBackgroundColor="rgba(0,0,0,0)" 
          colors={['#DB4437', '#0F9D58' ,'#4285F4','#F4B400']}
          />}
        />
      </SafeAreaView>
    )/* ) */
}

export default Profile