class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {

    };

    //Simulate when a user press a button outside the elevator.
    requestElevator(_floor, _direction) {

    };

}

class Elevator {
    constructor(_id, _amountOfFloors) {
        
    }  

    //Simulate when a user press a button inside the elevator
    requestFloor(_floor) {

    }
    
    //Should make the elevator move to every floor requested. 
    move() { 
        
    }

}

class CallButton {
    constructor(_id, _floor, _direction) {
        
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        
    }
}

class Door {
    constructor(_id) {
        
    }
}

module.exports = {Column, Elevator, CallButton, FloorRequestButton, Door} 