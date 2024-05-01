import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const FormField = ({title, value, placeHolder, handleChangeText, otherStyle, ...props}) => {
  
  const [showPassword, setShowPassword] = useState(false);

    return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>

      <View className='w-full bg-black-100 h-16 px-4 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput 
            className='flex-1 text-white font-psemibold text-base'
            value={value}
            placeholder={placeHolder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            readOnly = {props.isdisabled}
        /> 

        {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={props.isdisabled}>
                <Image 
                    className='w-8 h-8'
                    resizeMode='contain'
                    source={showPassword ? icons.eye : icons.eyeHide}
                />
            </TouchableOpacity>
        ) }
      </View>
    </View>
  )
}

export default FormField