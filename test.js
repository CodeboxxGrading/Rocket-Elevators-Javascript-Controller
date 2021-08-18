var _ = require('lodash');
const { Column, Elevator, CallButton, FloorRequestButton, Door } = require('./residential_controller.js')

const scenario = (column, requestedFloor, direction, destination) => {
    let tempColumn = _.cloneDeep(column);
    let selectedElevator = tempColumn.requestElevator(requestedFloor, direction)
    let pickedUpUser = false
    if (selectedElevator.currentFloor == requestedFloor) {
        pickedUpUser = true
    }
    selectedElevator.requestFloor(destination)
    moveAllElevators(tempColumn)

    for (let i = 0; i < tempColumn.elevatorList.length; i++) {
        if (tempColumn.elevatorList[i].ID == selectedElevator.ID) {
            tempColumn.elevatorList[i].currentFloor = selectedElevator.currentFloor
        }
    }

    const results = {
        tempColumn,
        selectedElevator,
        pickedUpUser
    }
    return results

}

//Makes the elevators who already have requests move before continuing with the scenario
const moveAllElevators = (column) => {
    column.elevatorList.forEach(elevator => {
        while (elevator.floorRequestList.length != 0) {
            elevator.move()
        }
    })
}

describe('ResidentialController', () => {
    let column = new Column(1, 10, 2)

    describe("Column's attributes and methods", () => {

        it('Instantiates a Column with valid attributes', () => {
            expect(column instanceof Column).toBe(true)
            expect(column.ID).toEqual(1)
            expect(column.status).not.toBeNull()
            expect(column.elevatorList.length).toEqual(2)
            expect(column.elevatorList[0] instanceof Elevator).toBe(true)
            expect(column.callButtonList.length).toEqual(18)
            expect(column.callButtonList[0] instanceof CallButton).toBe(true)
        })

        it('Has a requestElevator method', () => {
            expect(typeof column.requestElevator).toEqual("function")
        })

        it('Can find and return an elevator', () => {
            const elevator = column.requestElevator(1, 'up')
            expect(elevator instanceof Elevator).toEqual(true)
        })

    })

    describe("Elevator's attributes and methods", () => {
        const elevator = new Elevator(1, 10)

        it('Instantiates an Elevator with valid attributes', () => {
            expect(elevator instanceof Elevator).toBe(true)
            expect(elevator.ID).toEqual(1)
            expect(elevator.status).not.toBeNull()
            expect(elevator.door instanceof Door).toBe(true)
            expect(elevator.floorRequestButtonList.length).toEqual(10)
            expect(elevator.floorRequestList).toEqual([])
        })

        it('Has a requestFloor method', () => {
            expect(typeof elevator.requestFloor).toEqual("function")
        })

        it('Has a move method', () => {
            expect(typeof elevator.move).toEqual("function")
        })

    })

    describe("CallButton's attributes", () => {
        const callButton = new CallButton(1, 1, 'up')

        it('Instantiates a CallButton with valid attributes', () => {
            expect(callButton instanceof CallButton).toBe(true)

            expect(callButton.ID).toEqual(1)
            expect(callButton.status).not.toBeNull()
            expect(callButton.floor).toEqual(1)
            expect(callButton.direction).toEqual('up')

        })
    })

    describe("FloorRequestButton's attributes", () => {
        const floorRequestButton = new FloorRequestButton(1, 1)

        it('Instantiates a FloorRequestButton with valid attributes', () => {
            expect(floorRequestButton instanceof FloorRequestButton).toBe(true)

            expect(floorRequestButton.ID).toEqual(1)
            expect(floorRequestButton.status).not.toBeNull()
            expect(floorRequestButton.floor).toEqual(1)
        })
    })

    describe("Door's attributes", () => {
        const door = new Door(1)

        it('Instantiates a FloorRequestButton with valid attributes', () => {
            expect(door instanceof Door).toBe(true)

            expect(door.ID).toEqual(1)
            expect(door.status).not.toBeNull()
        })
    })

    describe("Functional Scenario 1 reaches the expected outcome", () => {
        let results;
        beforeAll(() => {
            column.elevatorList[0].currentFloor = 2
            column.elevatorList[0].status = 'idle'
            column.elevatorList[1].currentFloor = 6
            column.elevatorList[1].status = 'idle'

            results = scenario(column, 3, 'up', 7)

        })
        test("Part 1 of scenario 1 chooses the best elevator", () => {
            expect(results.selectedElevator.ID).toEqual(1)
        })

        test("Part 1 of scenario 1 picks up the user", () => {
            expect(results.pickedUpUser).toBe(true)
        })

        test("Part 1 of scenario 1 brings the user to destination", () => {
            expect(results.selectedElevator.currentFloor).toEqual(7)
        })

        test("Part 1 of scenario 1 ends with all the elevators at the right position", () => {
            expect(results.tempColumn.elevatorList[0].currentFloor).toEqual(7)
            expect(results.tempColumn.elevatorList[1].currentFloor).toEqual(6)
        })
    })

    describe("Functional Scenario 2 reaches the expected outcome", () => {
        let results1;
        let results2;
        let results3;
        beforeAll(() => {
            column.elevatorList[0].currentFloor = 10
            column.elevatorList[0].status = 'idle'
            column.elevatorList[1].currentFloor = 3
            column.elevatorList[1].status = 'idle'

            results1 = scenario(column, 1, 'up', 6)

            column = results1.tempColumn // Update the column state with last scenario's result

            results2 = scenario(column, 3, 'up', 5)
            column = results2.tempColumn // Update the column state with last scenario's result

            results3 = scenario(column, 9, 'down', 2)
            column = results3.tempColumn // Update the column state with last scenario's result
        });

        describe("Part 1 of scenario 2", () => {
            test("Part 1 of scenario 2 chooses the best elevator", () => {
                expect(results1.selectedElevator.ID).toEqual(2)
            })

            test("Part 1 of scenario 2 picks up the user", () => {
                expect(results1.pickedUpUser).toBe(true)
            })

            test("Part 1 of scenario 2 brings the user to destination", () => {
                expect(results1.selectedElevator.currentFloor).toEqual(6)
            })

            test("Part 1 of scenario 2 ends with all the elevators at the right position", () => {
                expect(results1.tempColumn.elevatorList[0].currentFloor).toEqual(10)
                expect(results1.tempColumn.elevatorList[1].currentFloor).toEqual(6)
            })
        })

        describe("Part 2 of scenario 2", () => {
            test("Part 2 of scenario 2 chooses the best elevator", () => {
                expect(results2.selectedElevator.ID).toEqual(2)
            })

            test("Part 2 of scenario 2 picks up the user", () => {
                expect(results2.pickedUpUser).toBe(true)
            })

            test("Part 2 of scenario 2 brings the user to destination", () => {
                expect(results2.selectedElevator.currentFloor).toEqual(5)
            })

            test("Part 2 of scenario 2 ends with all the elevators at the right position", () => {
                expect(results2.tempColumn.elevatorList[0].currentFloor).toEqual(10)
                expect(results2.tempColumn.elevatorList[1].currentFloor).toEqual(5)
            })
        })

        describe("Part 3 of scenario 2", () => {
            test("Part 3 of scenario 2 chooses the best elevator", () => {
                expect(results3.selectedElevator.ID).toEqual(1)
            })

            test("Part 3 of scenario 2 picks up the user", () => {
                expect(results3.pickedUpUser).toBe(true)
            })

            test("Part 3 of scenario 2 brings the user to destination", () => {
                expect(results3.selectedElevator.currentFloor).toEqual(2)
            })

            test("Part 3 of scenario 2 ends with all the elevators at the right position", () => {
                expect(results3.tempColumn.elevatorList[0].currentFloor).toEqual(2)
                expect(results3.tempColumn.elevatorList[1].currentFloor).toEqual(5)
            })
        })
    })

    describe("Functional Scenario 3 reaches the expected outcome", () => {
        let results1;
        let results2;
        beforeAll(() => {
            column.elevatorList[0].currentFloor = 10
            column.elevatorList[0].status = 'idle'
            column.elevatorList[1].currentFloor = 3
            column.elevatorList[1].direction = 'up'
            column.elevatorList[1].status = 'moving'
            column.elevatorList[1].floorRequestList.push(6)


            results1 = scenario(column, 3, 'down', 2)

            column = results1.tempColumn // update the column state with last scenario's result

            results2 = scenario(column, 10, 'down', 3)
            column = results2.tempColumn // update the column state with last scenario's result
        })



        describe("Part 1 of scenario 3", () => {
            test("Part 1 of scenario 3 chooses the best elevator", () => {
                expect(results1.selectedElevator.ID).toEqual(1)
            })

            test("Part 1 of scenario 3 picks up the user", () => {
                expect(results1.pickedUpUser).toBe(true)
            })

            test("Part 1 of scenario 3 brings the user to destination", () => {
                expect(results1.selectedElevator.currentFloor).toEqual(2)
            })

            test("Part 1 of scenario 3 ends with all the elevators at the right position", () => {
                expect(results1.tempColumn.elevatorList[0].currentFloor).toEqual(2)
                expect(results1.tempColumn.elevatorList[1].currentFloor).toEqual(6)
            })
        })

        describe("Part 2 of scenario 3", () => {
            test("Part 2 of scenario 3 chooses the best elevator", () => {
                expect(results2.selectedElevator.ID).toEqual(2)
            })

            test("Part 2 of scenario 3 picks up the user", () => {
                expect(results2.pickedUpUser).toBe(true)
            })

            test("Part 2 of scenario 3 brings the user to destination", () => {
                expect(results2.selectedElevator.currentFloor).toEqual(3)
            })

            test("Part 2 of scenario 3 ends with all the elevators at the right position", () => {
                expect(results2.tempColumn.elevatorList[0].currentFloor).toEqual(2)
                expect(results2.tempColumn.elevatorList[1].currentFloor).toEqual(3)
            })
        })
    })
})