import { addShip } from './addShip'
import httpMocks from 'node-mocks-http'

describe('addShip', () => {
    it('should be function', () => {
        expect(addShip).toBeInstanceOf(Function);
    });

    it('Out of Ocean', () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/ship',
            body: {
                shipType: 'Battleship',
                coordinate: { x: 10, y: 10 },
                shipDirection: 'vertical'
            }
        })

        const response = httpMocks.createResponse();

        addShip(request, response, ( err ) => {
            expect(err).toBeFalsy();
        });

        const { message } = JSON.parse(response._getData());

        expect( message ).toBe('Out of Ocean')
    });

});