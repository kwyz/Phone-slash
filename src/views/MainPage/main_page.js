import {GET} from "@/api/index.js"
export default {
    name: "MainPage",
    data(){
        return {
            status: "Inactive",
        }
    },
    methods: {
        routeTo() {
            const _this = this
            setTimeout(async function(){
                _this.status = "Active"
                await navigator.geolocation.getCurrentPosition(pos=>{
                    const GEO = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                    const IMEI = window.device.serial
                    const changeStatus = "ChangeStatus?id="+IMEI+"&status="+1+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                    GET(changeStatus)
                    const preparedURL = "GetCharacter?id="+IMEI+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                    let result = GET(preparedURL).then(success=>{
                        localStorage["characterExist"] = true
                        _this.$router.push({path: "/play"})
                    }).catch(error=>{
                        _this.$router.push({path: "/config"})
                        localStorage["characterExist"] = false
                    })
                    return result;
                })
             
            },1000)
        },
        setPlayerStatus(status){
            const _this = this
            setTimeout(async function(){
                await navigator.geolocation.getCurrentPosition(pos=>{
                    const IMEI = window.device.serial
                    const GEO = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                    const changeStatus = "ChangeStatus?id="+IMEI+"&status="+0+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                    GET(changeStatus)
                    _this.status = "Inactive"
                })
            },1000)
        },
        goToConfig(){
            this.$router.push({path: "/config"})
        },  
    }
}