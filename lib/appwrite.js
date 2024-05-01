//import {Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';
import { Account,Avatars, Client, Databases, ID, Query, Storage,  } from "react-native-appwrite";

export const appwriteConfig  = {
    endpoint : "https://cloud.appwrite.io/v1",
    platform : "wolfweb.Reactnative.Aora",
    projectId : "6624b7b648ec7b40dd89",
    databaseId : "6624f050e24397b42cbd",
    userCollectionId : "6624f078272fb5728738",
    videoCollectionId : "6624f0cd780262b6377e",
    storageId : "6624f2f70d7a260e8f3e",
    bookmarkId : "662fc00b000c2ff9d687"
}

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
      if(currentAccount){
        return currentAccount;
      }else{

      }
    } catch (error) {
      console.log(error)
    }
}
  
// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount){}
    else{
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      return currentUser.documents[0];
    }

  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllPost(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    ) 

    return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export async function getLatestPost(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt',Query.limit(7))]
    ) 

    return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export async function searchPost(query){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)]
    ) 

    return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export async function getUserPosts(userId){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId),Query.orderDesc('$createdAt')]
    ) 

    return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export async function signOut(){
  try {
    const session = await account.deleteSession("current");      
    return session;
  } catch (error) {
    throw new Error(error)
  }
}

export async function getFilePreview(fileId, type){
  let fileUrl;

  try {
    if(type == 'image'){
      fileUrl = storage.getFilePreview(appwriteConfig.storageId,fileId,
      2000,2000,'top',100);
    }else if(type == 'video'){
      fileUrl = storage.getFileView(appwriteConfig.storageId,fileId);
    }else{
      throw new Error("Invalid File Type")  
    }

    if(!fileUrl) throw Error

    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}

export async function uploadFile(file,type){
  if(!file){
    return;
   }else{
    // const {mimeType, ...rest} = file
    // const asset = { type : mimeType , ...rest };
    let filesize;
    if(file.fileSize != undefined){
      filesize = file.fileSize
    }else{
      filesize = file.filesize
    }

    const asset = {
      name: file.fileName,
      type: file.mimeType,
      size: filesize,
      uri: file.uri,
    }
    try {
      const uploadFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );

      console.log(uploadFile)
      const fileUrl = await getFilePreview(uploadFile.$id, type);

      return fileUrl;
    } catch (error) {
      throw new Error(error)
    }
   }
}

export async function createVideo(form){
  try {
    const [thumbnailUrl , videoUrl ] = await Promise.all([
      uploadFile(form.thumbnail , "image"),
      uploadFile(form.video , "video")
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
        title : form.title,
        thumbnail : thumbnailUrl,
        video : videoUrl,
        prompt : form.prompt,
        creator : form.userId
      }
    )

    return newPost;
  } catch (error) {
    throw new Error(error)
  }
}

// Handle Like Dislike Video
export async function likeDislikeVideo(userId, videoId){
  try {
    // First get the video
    const existingVideo = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId,
    );
    // console.log({ existingVideo });
    if (existingVideo) {
      if (!existingVideo.liked) {
        existingVideo.liked = [];
      }
    }
    const userIdIndex = existingVideo.liked.indexOf(userId);
    //console.log(userIdIndex)
    if (userIdIndex === -1) {
      // User hasn't liked the video yet, add the like
      existingVideo.liked.push(userId);
    } else {
      // User has already liked the video, remove the like
      existingVideo.liked.splice(userIdIndex,1);
    }
    //console.log(existingVideo.liked)
    const updatedVideo = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId,
      {
        liked: existingVideo.liked,
      },
    );
    return updatedVideo;
  } catch (error) {
    throw new Error(error);
  }
};

export async function getLikedVideos(userId){
  try {
    const userDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    let likedVideo = userDoc.documents.filter(e => e.liked.includes(userId));
    return likedVideo;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    return [];
  }
};


export async function uploadProfilePicture(image,userId){
  try {
    const [thumbnailUrl] = await Promise.all([
      uploadFile(image , "image")
    ])

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        avatar: thumbnailUrl,
      },
    );

   
    return updatedUser;
  } catch (error) {
    console.log("here error" , error)
    throw new Error(error)
  }
}