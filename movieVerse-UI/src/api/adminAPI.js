import axiosInstance from "../utils/axiosInstance"

// Redis Related APIs
export const adminClearRedis=async()=>{
    const res=await axiosInstance.delete('/admin/clear-redis',{withCredentials:true});
    return res;
}

export const adminGetRedis=async()=>{
    const res=await axiosInstance.get('/admin/get-redis',{withCredentials:true});
     return res;
}

// Streaming Related APIs

export const adminGetPresignedUrl=async(file)=>{
    const metadeta={
        name:file.name,
        type:file.type
    }
     const res = await axiosInstance.post('/admin/get-presigned-url',metadeta,
      {
        headers: {  "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res;
}

export const adminUploadRawVideoPresignedUrl=async(uploadUrl,file,config={})=>{
    const res=await axiosInstance.put(uploadUrl, file, 

        {
        headers: { "Content-Type": file.type },
        ...config
      }
  );
    return res;
}
export const adminSaveVideoMetadata=async(videoDetails)=>{
    const res=await axiosInstance.post('/admin/save-video-metadata',videoDetails,{withCredentials:true});
    return res;
}
export const adminUploadRawVideo=async(formData,config={})=>{
    const res=await axiosInstance.post('/admin/upload-raw-video', formData,
     {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        ...config
      }
    );
    return res;
}

export const adminGetandUploadProcessedVideos=async(videoDetails)=>{
    const res=await axiosInstance.post('/admin/get-and-upload-processed-videos', videoDetails, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return res;
}