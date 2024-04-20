const FRONTEND_BASE_URL = `http://localhost:3000`;

describe('Logout functionality', () => {
    beforeEach(() => {
        cy.visit(`${FRONTEND_BASE_URL}/login`); // Visit the root URL of your application before each test
        // Log in
        cy.get('.login-form[name="email"]').type('john.doe@gmail.com');
        cy.get('.login-form[name="password"]').type('John@123');
        cy.get('.login-button').click();
        // Ensure the URL changes to the homepage after login
        cy.url().should('include', '/homepage');
    });

    it('should be able to logout', () => {
        // Click on the Profile link
        cy.contains('Logout').click();
        // Ensure the URL changes to the profile page
        cy.url().should('include', '/');
    });
});