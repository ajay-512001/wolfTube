import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router';

const SearchInput = ({intialQuery}) => {
  
  const [showSearch, setShowsearch] = useState(false);
  const pathName = usePathname();
  const [query, setQuery] = useState(intialQuery || ''); 

    return (
      <View className='w-full bg-black-100 h-16 px-4 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
        <TextInput 
            className='text-base mt-0.5 text-white flex-1 font-pregular'
            value={query}
            placeholder="search for a video topic"
            placeholderTextColor='#cdcde0'
            onChangeText={(e) => setQuery(e)}
        /> 

            <TouchableOpacity onPress={() => {
              if(!query){return Alert.alert("Missing Query" , "Please input something to search")}

              if(pathName.startsWith("/search")){router.setParams({ query })}
              else{router.push(`/search/${query}`)}
            }}>
                
                
                <Image 
                    className='w-5 h-5'
                    resizeMode='contain'
                    source={icons.search}
                />
            </TouchableOpacity>
      </View>
  )
}

export default SearchInput