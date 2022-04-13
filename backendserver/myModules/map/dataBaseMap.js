const { json } = require('express/lib/response');
const fs = require('fs');
function loadMap(newMapObject, data){
        fs.readFile('database/map/database.txt', function(error, data){
            try{
                data = JSON.parse(data);
            }catch{
                return;
            }
            for(var index = 0; index < data.length; index++){
                newMapObject.newMap.set(data[index][0], data[index][1]);
            };
        });
}
class map{
    newMap;
    constructor(){
        this.newMap = new Map();
        loadMap(this);
    }
    setMap(key, value){
        var newFILENAME = "database/labs/"+key+".txt";
        // console.log(newFILENAME);
        fs.writeFile(newFILENAME, JSON.stringify(value), function (error) {
            if(error){

            }
        });
        this.newMap.set(key, newFILENAME);
        this.saveMap(key, newFILENAME);
    }
    saveMap(hash, filename){
        var newRoute = {
            route : hash,
            fileName : filename
        }
        fs.writeFile('database/map/database.txt', JSON.stringify([...this.newMap]), function (err) {
          });
    }
    getMap(key){
        var fileName = this.newMap.get(key);
        return fileName;
    }

}
module.exports = function(){
    return new map();
};