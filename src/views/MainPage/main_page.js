export default {
    name: "MainPage",
    methods: {
        routeTo(action) {
            this.$router.push({path: "/"+action})
        },
        setPlayerStatus(status){
            if(status === "playGame"){
                this.$router.push({path:"/play"})
            }
        }
    }
}