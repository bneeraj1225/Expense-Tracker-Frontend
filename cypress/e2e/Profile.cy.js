const FRONTEND_BASE_URL = `http://localhost:3000`;

describe('Profile Component', () => {
    beforeEach(() => {
        cy.visit(`${FRONTEND_BASE_URL}/login`); // Visit the root URL of your application before each test
        // Log in
        cy.get('.login-form[name="email"]').type('john.doe@gmail.com');
        cy.get('.login-form[name="password"]').type('John@123');
        cy.get('.login-button').click();
        // Ensure the URL changes to the homepage after login
        cy.url().should('include', '/homepage');
    });

    it('should navigate to Profile and check user details', () => {
        // Click on the Profile link
        cy.contains('Profile').click();
        // Ensure the URL changes to the profile page
        cy.url().should('include', '/profile');
        // Check if email and phone number are displayed correctly
        cy.get('#email').should('have.value', 'john.doe@gmail.com');
    });

    it('should update profile name', () => {
        // Click on the Profile link
        cy.contains('Profile').click();
        // Ensure the URL changes to the profile page
        cy.url().should('include', '/profile');
        // Clear the input field for name
        cy.get('#name').clear();
        // Type the new name
        cy.get('#name').type('Harry Potter');
        // Submit the form
        cy.get('.update-btn').click();
        // Wait for the alert
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Profile updated successfully!');
        });
    });
});
