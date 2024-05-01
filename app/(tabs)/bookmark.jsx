import { FlatList, RefreshControl, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { getLikedVideos } from '../../lib/appwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import useAppwrite from '../../lib/useAppwrite';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(() => getLikedVideos(user?.$id));
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
//   posts = addIdToArray(posts);

//   function addIdToArray(posts) {
//     return posts.map((post, index) => {
//         return {
//             ...post,
//             liked: [{ $id: index + 1 }] // Assuming ids start from 1
//         };
//     });
// }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <VideoCard  VideoItem={item} allitem={item}/>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-psemibold text-3xl text-white">
                Saved Videos
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput placeholder="Search your saved videos" />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos Found"
            subtitle="No videos found for this search query"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;