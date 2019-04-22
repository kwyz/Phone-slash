import tempData from '@/assets/tempData.json'

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
            }

        }
    },
    created() {
        this.gameStart = true
        if (localStorage['characterNumber'] === undefined) {
            this.$router.push({ path: '/config' })
        } else {

            // document.getElementById("background-game").style = "background-image: url('../../assets/arena/playBackground.png');"
            this.processData()

        }
    },
    beforeDestroy() {
        window.clearInterval(this.Interval)
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
        processData() {
            const gameActivities = tempData.activity
            var health = tempData.players.player.hp
            var enemyHealth = tempData.players.enemy.hp
            let self = this
            var aIndex = 0
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
                        clearInterval(self.Interval)
                        self.gameStatus = "You " + tempData.results[1].result
                        self.experienceEarned = "You earn " + tempData.results[1].expirience
                        self.enemyStatus = ""
                        self.playerStatus = ""
                        self.gameStart = false

                    }
                    // setTimeout(function(){

                    // },5000)
                }
            }, 300)

        },
        resetHealth() {
            document.getElementById('sechealthPlayer').style = "clip: rect(0, 100px, 200px, 0);"
            document.getElementById('sechealthEnemy').style = "clip: rect(0, 100px, 200px, 0);"
        },
        calcPlayerHealth(health, damage) {
            let remainhealth = health - damage
            // document.getElementById('sechealthPlayer').style = "clip: rect(0, " + (remainhealth * 1.2) + "px,200px, 0);"
            return remainhealth
        },
        calcEnemyHealth(health, damage) {
            let remainhealth = health - damage
            // document.getElementById('sechealthEnemy').style = "clip: rect(0, " + (remainhealth * 1.2) + "px,200px, 0);"
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
        }
    }
}