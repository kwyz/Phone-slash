import {GET, POST} from "@/api/index.js"
export default {
    name :"settings",
    data(){
        return {
        characterNr: 1,
        charactersUrl: "",
        charactersNames: {
            1: "Fallen Elf Archer",
            2: "Fallen Elf Rogue",
            3: "Fallen Elf Knight",
            4: "Ice Golem",
            5: "Earth Golem",
            6: "Fire Golem",
        },
        characterConfig:[
            {title:"Armor", value: 5},
            {title:"Agility", value:10},
            {title:"CriticalPower", value: 6},
            {title:"Strength", value: 10},
   
        ],
        isSelectedCharacter: false,
        availablePoints: 0,
        charData: {}
    }
    },
    computed:{
        getCharacterUrl (){
            return  require("@/assets/characters/"+this.characterNr+".png");
        },
        getCharacterName(){
            return this.charactersNames[this.characterNr]
        }
    },
    created(){
        this.isSelectedCharacter =  localStorage['characterNumber'] !== undefined
    },
    mounted(){
        this.isSelectedCharacter = Boolean(localStorage["characterExist"] !== undefined ? localStorage["characterExist"] : "true");
        this.getCharConfig()
    },
    methods: {
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
                        _this.updateCharConfig(success.data);
                    }).catch(error=>{
                         _this.addNewChar();
                    })
                    return result;
                })
            },1000)
        },
        updateCharConfig(data){
            this.characterConfig[0].value = data.Armor;
            this.characterConfig[1].value = data.Agility;
            this.characterConfig[2].value = data.CriticalPower;
            this.characterConfig[3].value = data.Strength;
            this.characterNr = data.Avatar;
            this.availablePoints = data.Points;
            this.charData = data;
            localStorage['characterNumber'] =  this.characterNr
        },
        nextCharacter(){
            this.characterNr === 6 ?  this.characterNr = 1 : this.characterNr++
        },
        prevCharacter(){
            this.characterNr === 1 ?  this.characterNr = 6 : this.characterNr--
        },
        add(caracteristic){
            let index = this.characterConfig.findIndex(element => {
               return element.title == caracteristic.title
            })
            if(this.availablePoints > 0){
                this.characterConfig[index].value = caracteristic.value + 1
                this.availablePoints--;
            }
        },
        saveSelectedCharacter(){
            if(localStorage["characterExist"] !== undefined){
                const exist = Boolean(localStorage["characterExist"])
                exist === true ? this.updateChar() : this.addNewChar()
            }
        },
        addNewChar(){
            const charConfig = {
                id: window.device.serial,
                name: window.device.model,
                avatar: this.characterNr
            };
            localStorage['characterNumber'] =  this.characterNr
            POST("AddCharacter",charConfig)
        },
        updateChar(){
            let charState = {};
            let _this = this;
            this.characterConfig.forEach(state=>{
                charState[state.title] = state.value;
            })
            charState.SmartphoneID = window.device.serial;
            charState.NickName = window.device.model;
            charState.Avatar = this.characterNr;
            charState.CharacterDetails = this.charData.CharacterDetails;
            POST("UpdateCharacter", charState).then(success=>{
                _this.$router.push({path: "/"})
            })      
        }
    }
}