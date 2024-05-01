import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import  images  from '../../constants/images'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPost, getLatestPost } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from './../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider'
 
const Home = () => {

  const { data: posts , refetch } = useAppwrite(getAllPost);
  const { data: latestPosts , refetch : LatestRefetch } = useAppwrite(getLatestPost);
  const { user, setIsLogged, setUser } = useGlobalContext();

  const [Refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    await LatestRefetch();
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <VideoCard  VideoItem={item} allitem={item}/>
      )}
      ListHeaderComponent={() => (
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
            <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
            <Text className="font-psemibold text-white text-2xl">{user?.username}</Text>
            </View>
            <View className="mt-1.5">
              <Image 
                source={images.logoSmall}
                className="w-10 h-10"
                resizeMode='contain'
              />
            </View>
          </View>

          <SearchInput />

          <View className="w-full pt-5 pb-8 flex-1">
            <Text className="text-gray-100 text-lg font-pregular mb-3" >Latest Videos</Text>

            <Trending post={latestPosts ?? []}/>
          </View>
        </View>
      )}

      ListEmptyComponent={() => (
        <EmptyState 
          title="No Videos Found"
          subtitle="Be the first one to uplaod the video"
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
  )
}

export default Home