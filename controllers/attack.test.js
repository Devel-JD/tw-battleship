import attack from './attack'
import httpMocks from 'node-mocks-http'

describe('attack', () => {
    it('should be function', () => {
        expect(attack).toBeInstanceOf(Function);
    });

    it('Out of Ocean', () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/attack',
            body: {
                coordinate: { x: 10, y: 10 }
            }
        })

        const response = httpMocks.createResponse();

        attack(request, response, ( err ) => {
            expect(err).toBeFalsy();
        });

        const { message } = JSON.parse(response._getData());

        expect( message ).toBe('Out of Ocean')
    });
});