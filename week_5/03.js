class Car {
    constructor(modelName, modelYear, type, price) {
        this._modelName = modelName;
        this._modelYear = modelYear;
        this.type = type;
        this.price = price;
    }

    get modelName (){
        return this._modelName
    }

    set modelName (value){
        this._modelName = value;
    }



    makeNoise(){
        console.log(`${this._modelName}": 빵빵"`);
    }

    printmodelYear(){
        console.log(`${this._modelYear}년도에 제작된 ${this._modelName}입니다.`)
    }
}

const newCar1 = new Car("BMW", 2025, "Sedan", "2천만원");
const newCar2 = new Car("Benz", 2025, "SUV", "4천만원");
const newCar3 = new Car("Ferrari", 2025, "Truck", "9천만원");

newCar1.makeNoise();
newCar1.printmodelYear();
