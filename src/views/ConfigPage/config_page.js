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
            {title:"Armor", value: 1},
            {title:"Agility", value:1},
            {title:"Critical", value: 1},
            {title:"Health", value: 1},
            {title:"Strength", value: 1},
   
        ],
        isSelectedCharacter: false,
        isSearchForCharacter: false
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
    methods: {
        nextCharacter(){
            this.characterNr === 6 ?  this.characterNr = 1 : this.characterNr++
            this.isSearchForCharacter = true
        },
        prevCharacter(){
            this.characterNr === 1 ?  this.characterNr = 6 : this.characterNr--
            this.isSearchForCharacter = true
        },
        saveSelectedCharacter(){
            localStorage['characterNumber'] = this.characterNr
            this.$router.push({path:"/"})
        },
        add(caracteristic){
            let index = this.characterConfig.findIndex(element => {
               return  element.title == caracteristic.title
            })
           this.characterConfig[index].value = caracteristic.value + 1
        },
    }
}