import tempData from '@/assets/tempData.json'
import { GET } from "@/api/index.js"
import { POST } from '../../api';
var Timer = {}
var takenDamage = 0 ;
export default {
    name: "play",
    data() {
        return {
            figthResults: [],
            Interval: '',
            health: 100,
            enemyStatus: "",
            playerStatus: "",
            Interval: {},
            gameStatus: "",
            experienceEarned: "",
            gameStart: false,
            style: {
                alignItems: "center",
                backgroundImage: require('../../assets/arena/playBackground.png'),
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%"
            },
            enemyExist: false,

        }
    },
    created() {
        this.getCharConfig();
        this.changeStatus()
    },
    beforeDestroy() {
        window.clearTimeout(Timer)
        window.clearInterval(this.Interval)
        POST("LeaveGame", {
            id: window.device.serial
        })
    },
    updated() {
        if (this.health <= 0) {
            this.health = 100
            this.figthResults = []
        }
    },
    computed: {
        getCharacterAvatarNumber() {
            return localStorage['characterNumber']
        },
        getCharacterAvatar() {
            return require("@/assets/characters/" + this.getCharacterAvatarNumber + ".png");
        },
        getRandomCharacter() {
            return require("@/assets/characters/" + Math.ceil(Math.random() * 7) + ".png");
        },
        getEnemyStatus() {
            return this.enemyStatus
        },
        getPlayerStatus() {
            return this.playerStatus
        }
    },
    methods: {
        processData(data) {                      
            console.log(data.Value)
            const gameActivities = data.Value.activity
            var health = data.Value.players.player.hp === 0 ? data.Value.players.enemy.hp : 100
            var enemyHealth = data.Value.players.enemy.hp === 0 ? data.Value.players.enemy.hp : 100
            let self = this
            var aIndex = 0
            this.gameStart = true
            this.Interval = setInterval(function () {
                if (aIndex < gameActivities.length) {
                    let activity = gameActivities[aIndex]
                    self.setPlayersStatus(activity)
                    if (activity.action === 'defence' && !activity.lucky) {
                        health = self.calcPlayerHealth(health, activity.damage)
                    } else if (activity.action === 'hit' && activity.lucky) {
                        enemyHealth = self.calcEnemyHealth(enemyHealth, activity.damage)
                    }
                    aIndex++
                } else {
                    if (enemyHealth <= 0 || health <= 0) {
                        if(health <=0) document.getElementById("heartPlayer").setAttribute("src", require("@/assets/interface/HP/basic/background.png"))
                        if(enemyHealth<=0) document.getElementById("heartEnemy").setAttribute("src", "@/assets/interface/HP/basic/background.png")
                        clearInterval(self.Interval)
                        self.gameStatus = "You " + tempData.results[1].result
                        self.experienceEarned = "You earn " + tempData.results[1].expirience
                        self.enemyStatus = ""
                        self.playerStatus = ""
                        self.gameStart = false
                        console.log("Taken damage "+takenDamage)
                    }
                }
            }, 300)
        },
        resetHealth() {
            document.getElementById('playerHP').style.width ="100px"
            document.getElementById('enemyHP').style.width = "100px"
            document.getElementById("heartPlayer").setAttribute("src", require("@/assets/interface/HP/basic/heart.png"))
            document.getElementById("heartEnemy").setAttribute("src", require("@/assets/interface/HP/basic/heart.png"))
        },
        calcPlayerHealth(health, damage) {
            let remainhealth = (health - damage)
            takenDamage +=damage
            document.getElementById('playerHP').style.width = remainhealth +"px"
            return remainhealth
        }, 
        calcEnemyHealth(health, damage) {
            let remainhealth = health - damage
            document.getElementById('enemyHP').style.width = remainhealth +"px"
            return remainhealth
        },
        setPlayersStatus(activity) {
            if (activity.action === "defence" && !activity.lucky) {
                this.playerStatus = "- " + activity.damage
                this.enemyStatus = ""
            } else if (activity.action === "defence" && activity.lucky) {
                this.playerStatus = "Defence"
                this.enemyStatus = "Miss"
            } else if (activity.action === "hit" && activity.lucky) {
                this.enemyStatus = "- " + activity.damage
                this.playerStatus = ""
            } else if (activity.action === "hit" && !activity.lucky) {
                this.enemyStatus = "Defence"
                this.playerStatus = "Miss"
            }
        },
        cancelState(){
            this.figthResults = [];
            this.Interval= '';
            this.health = 100;
            this.enemyStatus = "";
            this.playerStatus = "";
            this.Interval = {};
            this.gameStatus = "";
            this.experienceEarned = "";
            this.gameStart = false;
            this.style = {
                alignItems: "center",
                backgroundImage: require('../../assets/arena/playBackground.png'),
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%"
            }
        },
        cancelGame() {
            this.cancelState()
            this.$router.push({path:"/"})
        },
        async reloadGame(){
            this.resetHealth()
            setTimeout(()=>{
                this.cancelState();
                this.processData();
            },2000)
        },
        getCharConfig(){
            const _this = this
            setTimeout(async function(){
                await navigator.geolocation.getCurrentPosition(pos=>{
                    const GEO = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                    const IMEI = window.device.serial
                    const preparedURL = "GetCharacter?id="+IMEI+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                    let result = GET(preparedURL).then(success=>{
                        _this.health = success.data.Health;
                    }).catch(error=>{
                        console.log(error)
                    })
                    return result;
                })
            },1000)
        },
        async changeStatus(){
            const _this = this
            await navigator.geolocation.getCurrentPosition(pos=>{
                const GEO = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
                const IMEI = window.device.serial
                const preparedURL = "ChangeStatus?id="+IMEI+"&status="+1+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                let result = GET(preparedURL).then(success=>{
                    _this.health = success.data.Health;
                    _this.searchOponent();
                }).catch(error=>{
                    console.log(error)
                })
                return result;
            })
        },
        async searchOponent(){
            const _this = this
            await navigator.geolocation.getCurrentPosition(pos=>{
                const GEO = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
                const IMEI = window.device.serial
                const SearchOpponent = "SearchOpponent?id="+IMEI+"&longitude="+GEO.longitude+"&latitude="+GEO.latitude;
                GET(SearchOpponent).then(success=>{
                    if(success.status !== 200){
                        _this.enemyExist = false      
                       Timer = setTimeout(()=>{
                            _this.searchOponent()
                        },2000)
                    } else if(success.status === 200) {
                        _this.enemyExist = true      
                        Timer = setTimeout(()=>{
                            _this.processData(success.data)
                        },2000)        
                    }   
                })
            })
        }
    }
}