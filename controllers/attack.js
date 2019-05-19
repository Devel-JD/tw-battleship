import Battle from '../models/Battle'
import History from '../models/History'
import { Types } from 'mongoose'
import { checkOceanCondition } from './addShip'

const attack = (req, res, next) => {
    const { coordinate: attackCoord } = req.body;

    if( checkOceanCondition( attackCoord ) ){
        res.status(400).json({message: 'Out of Ocean'});
    }else{
        Promise.resolve( Battle.findOne().sort({createdDate: -1}).lean() ).then( ( battle ) => {
            const { ships, attacked } = battle;
            //console.log(battle)
            if( ships.length < 1 ) {
                res.status(401).json({message: 'Unauthorized to attack empty fleet. Setup the fleet first.'})
            }else{
                //console.log( attacked.findIndex( idx => idx.x === attackCoord.x && idx.y === attackCoord.y ) )
                if( attacked.findIndex( idx => idx.x === attackCoord.x && idx.y === attackCoord.y ) !== -1 ){
                    res.status(400).json({message: 'This coordinate has been attacked already.'})
                }else{
                    let BreakException = {};
                    let hitShip = "";
                    let hit = false;
                    let isSank = false;
    
                    try{
                        ships.forEach( ( ship, shipIdx ) => {
                            ship.coordinates.forEach( ( coordinate, coordIndx ) => {
                                //console.log( coordinate )
                                if( coordinate.x === attackCoord.x && coordinate.y === attackCoord.y ) {
                                    //console.log( 'inside:', ships[shipIdx] )
                                    hitShip = ships[shipIdx].shipType;
                                    ships[shipIdx].coordinates.splice( coordIndx, 1 );
                                    isSank = ships[shipIdx].coordinates.length < 1;
                                    if( isSank ){
                                        ships.splice( shipIdx, 1 )
                                    }
                                    hit = true;
                                    throw BreakException;
                                }
                            } );
                        } )
                    } catch( e ) {
                        console.log( "A ship has been hit" );
                    }
                    
                    attacked.push( { ...attackCoord, hit: hit ? true:false } )
                    Promise.resolve( Battle.updateOne({ "_id": Types.ObjectId(battle._id) }, { $set: { "ships": ships, "attacked": attacked } }) ).then( result => {
                        let message = "";
                        if( hit ) {
                            if(!isSank){
                                message = "Hit";
                                //res.json({message: "Hit"})
                            } else {
                                if(ships.length > 0){
                                    message = `You just sank the ${hitShip}`;
                                    //res.json({message: `You just sank the ${hitShip}`})
                                } else {
                                    message = `Game Over, required shots: ${attacked.length}, missed shots: ${attacked.filter( item => item.hit === false ).length}`;
                                    //res.json({message: 'Game Over', requiredShots: attacked.length, missedShots: attacked.filter( item => item.hit === false ).length });
                                }
                            }
                        } else {
                            message = "Miss";
                            //res.json({ message: "Miss" })
                        }
    
                        const history = new History({
                            board_id: battle._id,
                            coordinates: attackCoord,
                            message: message
                        });
    
                        history.save( result => {
                            res.json({ message: message });
                        } );
                    });
    
                }
            }
        }).catch( ( err ) => {
            console.log( 'Find battle', err )
        } )
    }
}

export default attack;