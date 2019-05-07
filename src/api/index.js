import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.0.7:56671/api/Game/"
});

export async function GET (controllerURL){
    let result = await axiosInstance.get(controllerURL).then(success=>{
        return success;
    }).catch(error=>{
        return error;
    })
    return result;
}
export async function POST (controllerURL ,data){
    let result = await axiosInstance.post(controllerURL,data).then(success=>{
        return success;
    }).catch(error=>{
        return error;
    })
    return result;
}