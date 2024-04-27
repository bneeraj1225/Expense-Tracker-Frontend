const FRONTEND_BASE_URL = `http://104.131.74.55:3000`;

describe('Login Component', () => {
    beforeEach(() => {
        cy.visit(`${FRONTEND_BASE_URL}/login`); // Visit the root URL of your application before each test
    });

    it('User should be able to login successful', () => {
        
        cy.get('.login-form[name="email"]').type('john.doe@gmail.com');
        cy.get('.login-form[name="password"]').type('John@123');

        cy.get('.login-button').click();

        cy.url().should('include', '/homepage');    
      });

      it(`User shouldn't be able to login with wrong credentials`, () => {
        
        cy.get('.login-form[name="email"]').type('john.doe@gmail.com');
        cy.get('.login-form[name="password"]').type('John@1234');

        cy.get('.login-button').click();

        cy.contains('Invalid email or password').should('be.visible');    
      });  
});