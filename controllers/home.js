import Battle from '../models/Battle'
import { Board } from './battle-board'

const home = (req, res, next) => {
    Promise.resolve( Battle.findOne().sort({createdDate: -1}) )
        .then( battle => {
            console.log( battle );
            const boardSize = Board.row * Board.column;
            const { ships } = battle;

            res.json({
                board: `Board size: ${boardSize} grids`,
                BattleshipAlive: ships.filter( ship => ship.shipType === 'Battleship' ).length,
                CruisersAlive: ships.filter( ship => ship.shipType === 'Cruisers' ).length,
                DestroyersAlive: ships.filter( ship => ship.shipType === 'Destroyers' ).length,
                SubmarinesAlive: ships.filter( ship => ship.shipType === 'Submarines' ).length,
                attackedCount: battle.attacked.length,
                attackedSlot: battle.attacked
            })
        } );
}

export default home;