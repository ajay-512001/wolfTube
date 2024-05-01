import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import FormField from './../../components/FormField';
import { ResizeMode, Video } from 'expo-av';
import { icons } from '../../constants';
import CustomButton from './../../components/CustomButton';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useGlobalContext } from './../../context/GlobalProvider';
import { createVideo } from '../../lib/appwrite';

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title : "",
    video : null,
    thumbnail : null,
    prompt : ""
  })

  const openPicker = async(selectType) => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type : selectType == "image" ? ['image/png' , 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif']
    // })

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ?  ImagePicker.MediaTypeOptions.Images :  ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled){
      if(selectType == "image"){
        setForm({...form , thumbnail : result.assets[0]})
      }

      if(selectType == "video"){
        setForm({...form , video : result.assets[0]})
      }
    }/* else{
      setTimeout(() => {
        Alert.alert("Document Picked" , JSON.stringify(result,null,2))
      })
    } */
  }
  const submit = async () => {
    if(!form.prompt || !form.video || !form.thumbnail || !form.title){
      Alert.alert("Please fill all the data")
    }else{
      setUploading(true);
      try {
        await createVideo({...form , userId : user.$id});

        Alert.alert("Success" , "Post created Successfully");
        router.push("/home")
      } catch (error) {
        Alert.alert("Error" , error.message)
      }finally{
        setForm({
          title : "",
          video : null,
          thumbnail : null,
          prompt : ""
        })
        setUploading(false);
      }
    }
  }

  return ( /* ( uploading ? 
  <View className="flex flex-1 justify-center items-center bg-loaderPrimary">
    <ActivityIndicator size='large' color="rgb(249,115,22)"/> 
  </View> 

  : */

<SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6 mt-12">
      <View className="flex absolute justify-center items-center top-2/4 left-2/4 z-20" style={Platform.OS === 'android' ? {transform: [{ translateX: -40 }, { translateY: -25 }]} : {transform: [{ translateX: -20 }, { translateY: -20 }]}}>
            <ActivityIndicator size={Platform.OS === 'android' ? 80 : "large"} color="rgb(249,115,22)" animating={uploading}/> 
        </View>
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>

        <FormField 
          title="Video Title"
          value={form.title}
          placeHolder="Give your video a catch title....."
          handleChangeText={(e) => setForm({...form,title : e})}
          otherStyle="mt-10"
          isdisabled = {uploading}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')} disabled={uploading}>
            {form.video? (
              <Video
                source={{uri : form.video.uri}}
                className="rounded-2xl w-full h-64"
                resizeMode={ResizeMode.COVER}
                // useNativeControls
                // isLooping
              />
            ): (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} 
                    resizeMode='contain' className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
            
          </TouchableOpacity>
        </View>


        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')} disabled={uploading}>
            {form.thumbnail? (
             <Image 
              source={{uri:form.thumbnail.uri}}
              resizeMode='cover'
              className = "w-full h-64 rounded-2xl"
             />
            ): (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload} 
                    resizeMode='contain' className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a File
                  </Text>
              </View>
            )}
            
          </TouchableOpacity>
        </View>

        <FormField 
          title="AI Prompt"
          value={form.prompt}
          placeHolder="Give your AI prompt that you useed to create video"
          handleChangeText={(e) => setForm({...form,prompt : e})}
          otherStyle="mt-7"
          isdisabled = {uploading}
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
    
/*   ) */
}

export default Create