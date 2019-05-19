import Battle from '../models/Battle'

const reset = (req, res, next) => {
    const battle = new Battle({
            ships: [],
            attacked: []
    });

    battle.save( ( err ) => {
        if(err) throw err;

        res.json({message: 'reset succesfully'})
    } )
}

export default reset;