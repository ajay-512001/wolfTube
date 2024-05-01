import { View, Text, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from './../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from './../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {

  const [isSubmitting, setisSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email : "",
    password : ""
  }) 


const submit1 = async () => {
  if(!form.username || !form.email || !form.password){
    Alert.alert("Error" , "Please fill all fields.")
  }
  else{
    setisSubmitting(true);

    try {
      const resultSignUp = await createUser(form.email,form.password,form.username);

      router.replace("/home")
    } catch (error) {
      Alert.alert("Error" , error.message)
    }finally{
      setisSubmitting(false);
    }
  }
}


const submit = async () => {
  if (form.username === "" || form.email === "" || form.password === "") {
    Alert.alert("Error", "Please fill in all fields");
  }
else{
  setisSubmitting(true);
  try {
    const result = await createUser(form.email, form.password, form.username);
    setUser(result);
    setIsLogged(true);

    router.replace("/home");
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setisSubmitting(false);
  }
}
};


  return (
/* ( isSubmitting    ?

      <View className="flex flex-1 justify-center items-center bg-loaderPrimary">
          <ActivityIndicator size='large' color="rgb(249,115,22)"/> 
      </View>

    : */

    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
      <View className="flex absolute justify-center items-center top-2/4 left-2/4 z-20" style={Platform.OS === 'android' ? {transform: [{ translateX: -40 }, { translateY: -25 }]} : {transform: [{ translateX: -20 }, { translateY: -20 }]}}>
            <ActivityIndicator size={Platform.OS === 'android' ? 80 : "large"} color="rgb(249,115,22)" animating={isSubmitting}/> 
        </View>
        <View className='w-full min-h-[85vh] justify-center px-4 my-6' > 
          <Image 
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <Text className='text-2xl text-white text-semibold font-psemibold mt-10'>Register To Auro</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({...form, username:e})}
            otherStyle = "mt-10"
            isdisabled = {isSubmitting}
          />
          
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email:e})}
            otherStyle = "mt-7"
            keyboardType= "email-address"
            isdisabled = {isSubmitting}
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password:e})}
            otherStyle = "mt-7"
            isdisabled = {isSubmitting}
          />

          <CustomButton 
            title="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
            containerStyles="mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account ?</Text>
            <Link disabled={isSubmitting} href="/sign_in" className='text-lg text-secondary font-psemibold'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )/* ) */
}

export default SignUp