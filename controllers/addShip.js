import { Board } from './battle-board'
import Battle from '../models/Battle'
import History from '../models/History'

const BATTLESHIP_LENGTH = 4;
const CRUISERS_LENGTH = 3;
const DESTROYERS_LENGTH = 2;
const SUBMARINES_LENGTH = 1;

export const checkOceanCondition = coordinate => {
    return coordinate.x < 0 || coordinate.x >= Board.column || coordinate.y >= Board.row || coordinate.y < 0
}

/// Function to test whether a specific coordinate is surrounded by other fleets.
const checkSurroundingGrids = async coordinate => {
    //console.log( 'checkSurroundingGrids', coordinate )
    const battle = await Battle.findOne().sort({createdDate: -1}).lean();
    //console.log(battle);
    const hostingShips = battle ? battle.ships : [];    
    //console.log( 'hostingShips', hostingShips )
    let BreakException = {};
    try{
        hostingShips.forEach( fleet => {
            fleet.coordinates.forEach( coord => {
                //console.log( 'check condition', coordinate.x, coordinate.y, coord.x, coord.y, checkDiagonalNeighborCoordinate( coordinate, coord ) )
                if( checkDuplicateCoordinate( coordinate, coord ) || checkSideNeighborCoordinate( coordinate, coord ) || checkDiagonalNeighborCoordinate( coordinate, coord ) )
                    throw BreakException;
            } )
        } )
    }catch(e){
        if( e !== BreakException ) throw e;
        return true;
    }
}

//// Check diagonal grids
const checkDiagonalNeighborCoordinate = ( coordinate, coord ) => ( coordinate.x + 1 === coord.x && coordinate.y - 1 === coord.y ) ||
                                                                    ( coordinate.x - 1 === coord.x && coordinate.y - 1 === coord.y ) ||
                                                                    ( coordinate.x - 1 === coord.x && coordinate.y + 1 === coord.y ) ||
                                                                    ( coordinate.x + 1 === coord.x && coordinate.y + 1 === coord.y );

/// Check top,right,bottom, and left grids
const checkSideNeighborCoordinate = ( coordinate, coord ) => ( coordinate.x + 1 === coord.x && coordinate.y === coord.y ) || 
                                                                ( coordinate.x - 1 === coord.x && coordinate.y === coord.y ) || 
                                                                ( coordinate.x === coord.x && coordinate.y - 1 === coord.y ) || 
                                                                ( coordinate.x === coord.x && coordinate.y + 1 === coord.y );

/// Check if the ship is placed in duplicated position
const checkDuplicateCoordinate = ( coordinate, coord ) => coordinate.x === coord.x && coordinate.y === coord.y;

const createShip = async ( blocks, coordinate, direction ) => {
    //console.log('createShip', direction)
    let ship = [];
    if( direction === 'horizontal' ){
        let unableToGoRight = false;
        for( let x = coordinate.x; x < coordinate.x + blocks; x++ ){
            if( checkOceanCondition({x: x, y: coordinate.y}) || await checkSurroundingGrids({x: x, y: coordinate.y})){
                unableToGoRight = true;
                ship = [];
                //console.log( 'Illegal Placement' )
                break;
            }else{
                //console.log( 'push', x, coordinate.y )
                ship.push( { x: x, y: coordinate.y } );
            }
        }

        if(unableToGoRight){
            //console.log( 'go left' )
            for( let x = coordinate.x; x > coordinate.x - blocks; x--){
                if(checkOceanCondition({x: x, y: coordinate.y}) || await checkSurroundingGrids({x: x, y: coordinate.y})){
                    //console.log( 'Illegal Placement 2' )
                    return null;
                }else{
                    //console.log( 'push here', x, coordinate.y )
                    ship.push( { x: x, y: coordinate.y } );
                }
            }
        }
    }else{
        let unableToGoDown = false;
        for( let y = coordinate.y; y < coordinate.y + blocks; y++ ){
            if( checkOceanCondition({x: coordinate.x, y: y}) || await checkSurroundingGrids({x: coordinate.x, y: y})){
                unableToGoDown = true;
                ship = [];
                //console.log( 'Illegal Placement' )
                break;
            }else{
                //console.log( 'push', x, coordinate.y )
                ship.push( { x: coordinate.x, y: y } );
            }
        }

        if(unableToGoDown){
            //console.log( 'go up' )
            for( let y = coordinate.y; y > coordinate.y - blocks; y--){
                if(checkOceanCondition({x: coordinate.x, y: y}) || await checkSurroundingGrids({x: coordinate.x, y: y})){
                    //console.log( 'Illegal Placement 2' )
                    return null;
                }else{
                    //console.log( 'push here', x, coordinate.y )
                    ship.push( { x: coordinate.x, y: y } );
                }
            }
        }
    }
    //console.log( 'ship', ship );
    return ship;
}

export const addShip = async ( req, res ) => {
    const { shipType, coordinate, shipDirection } = req.body;
    if ( checkOceanCondition( coordinate ) ){
        res.status(400).json({message: 'Out of Ocean'});
    } else {
        if(shipDirection === 'horizontal' || shipDirection === 'vertical'){
            let addedShip, shipLength;
            switch(shipType){
                case "Battleship": {
                    addedShip = await createShip(BATTLESHIP_LENGTH, coordinate, shipDirection);
                    shipLength = BATTLESHIP_LENGTH;
                    break;
                }
                case "Cruisers": {
                    addedShip = await createShip(CRUISERS_LENGTH, coordinate, shipDirection);
                    shipLength = CRUISERS_LENGTH;
                    break;
                }
                case "Destroyers": {
                    addedShip = await createShip(DESTROYERS_LENGTH, coordinate, shipDirection);
                    shipLength = DESTROYERS_LENGTH;
                    break;
                }
                case "Submarines": {
                    addedShip = await createShip(SUBMARINES_LENGTH, coordinate, shipDirection);
                    shipLength = SUBMARINES_LENGTH;
                    break;
                }
                default:
                    res.status(400).json({message: 'Ship Type is invalid'});
            }

            //console.log( 'addedShip', addedShip );
            
            if( addedShip ) {
                Battle.findOne().sort({createdDate: -1}).exec((err, battle) => {
                    if( err ) throw err;
                    //console.log(battle)
                    let newShip = {
                        shipType: shipType,
                        coordinates: addedShip,
                        length: shipLength
                    }

                    

                    if( battle ){
                        battle.ships.push( newShip );
                    }else{
                        battle = new Battle({
                            ships: newShip,
                            attacked: []
                        });
                    }

                    Promise.resolve( battle.save() )
                        .then( result =>  {
                            //console.log(result )
                            let history = new History({
                                board_id: result._id,
                                coordinates: addedShip,
                                message: `${shipType} was placed`
                            })
                            return history.save()
                        } )
                        .then( result => res.status(200).json({message: `${shipType} is placed.`}) );
                    //battle.save( (err) =>  );

                })
    
                
            }else{
                res.status(400).json({message: "The ship placement is illegal or not allowed."});
            }

        }else{
            res.status(400).json({message: 'Placement direction is invalid'});
        }
    }

}