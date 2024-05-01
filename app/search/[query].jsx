import { View, Text, FlatList, Image, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { searchPost } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from './../../components/VideoCard';
import  images  from '../../constants/images'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'

const Search = () => {

    const { query } = useLocalSearchParams();
    const { data: posts , refetch } = useAppwrite(() => {
      searchPost(query)
    });
  
    useEffect(() => {
     refetch();
    },[query])

    return (
      <SafeAreaView className="bg-primary h-full">
        <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard  VideoItem={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
              <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
              <Text className="font-psemibold text-white text-2xl">{query}</Text>

              <View className="mt-6 mb-8">
                <SearchInput intialQuery = {query}/>
              </View>
          </View>
        )}
  
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No videos found with this query"
          />
        )}
        />
      </SafeAreaView>
    )
}

export default Search