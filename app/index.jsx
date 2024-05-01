import { StatusBar } from 'expo-status-bar';
import { ScrollView, Image, Text, View, ActivityIndicator, Platform } from 'react-native';
import { Link, Redirect, router  } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '.././constants'
import CustomButton from './../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {

  const { isLogged, loading } = useGlobalContext();

  if(!loading && isLogged ) return <Redirect href="/home"/>

  return (
    /* ( loading ? 
      <View className="flex flex-1 justify-center items-center bg-loaderPrimary">
        <ActivityIndicator size='large' color="rgb(249,115,22)"/> 
      </View> 
    
      : */
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{height:'100vh'}}>
      <View className="flex absolute justify-center items-center top-2/4 left-2/4 z-20" style={Platform.OS === 'android' ? {transform: [{ translateX: -40 }, { translateY: -25 }]} : {transform: [{ translateX: -20 }, { translateY: -20 }]}}>
            <ActivityIndicator size={Platform.OS === 'android' ? 80 : "large"} color="rgb(249,115,22)" animating={loading}/> 
      </View>
        <View className="w-full min-h-[85vh] items-center justify-center px-4">
          <Image
            source={images.logo}
            className = "w-[130px] h-[84px]"
            resizeMode='contain'
          />
          <Image
            source={images.cards}
            className = "max-w-[380px] w-full h-[300px]"
            resizeMode='contain'
          />

          <View className='relative mt-5'>
            <Text className='text-3xl text-white font-bold text-center'>Discover Endless Posibilites with {' '}
              <Text className='text-secondary-200'><Link href="/home">Auro</Link></Text></Text>
              <Image
                source={images.path}
                className = "w-[236px] h-[15px] absolute -bottom-3 right-11"
                resizeMode='contain'
              />
          </View>
          <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>Where creativity meets innovation : embark on a journey of limitness exporation with Auro!</Text>
          
          <CustomButton 
          title="Continue with Email"
          handlePress={() => router.push('/sign_in')}
          containerStyles="w-full mt-7"
          isLoading={loading}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style="light" />
      
    </SafeAreaView>




    /* <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pbold">WolfTube is Live!</Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{color:'blue'}} >Go to Home</Link>
    </View> */
  )/* ) */
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 */