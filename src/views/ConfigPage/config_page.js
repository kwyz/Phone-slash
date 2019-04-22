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
        }
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
    updated(){
   
    },
    methods: {
        nextCharacter(){
            if(this.characterNr === 6){
                this.characterNr = 1
            } else {
            this.characterNr++
            }
            localStorage['characterNumber'] = this.characterNr
        },
        prevCharacter(){
            if(this.characterNr === 1){
                this.characterNr = 6
            } else {
               this.characterNr--
            }
            localStorage['characterNumber'] = this.characterNr
        }
    }
}