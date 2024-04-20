const FRONTEND_BASE_URL = `http://localhost:3000`;

describe('Homepage Component', () => {
    beforeEach(() => {
        cy.visit(`${FRONTEND_BASE_URL}/login`); // Visit the root URL of your application before each test
                // Log in
                cy.get('.login-form[name="email"]').type('john.doe@gmail.com');
                cy.get('.login-form[name="password"]').type('John@123');
                cy.get('.login-button').click();
            
                // Ensure the URL changes to the homepage after login
                cy.url().should('include', '/homepage');
    });

    it('should navigate to Budget List and add a budget', () => {
    
        // Click on the link to add new expenses
        cy.contains('Want to add New Expenses? Click here.').click();
    
        // Ensure the modal is open for adding expenses
        cy.get('.modal-overlay').should('be.visible');
    
        // Fill out the form with necessary details
        cy.get('input[type="text"]').type('Test Expense');
        cy.get('select').select('Groceries');
        cy.get('input[type="number"]').eq(0).type('50'); // Price
        cy.get('input[type="number"]').eq(1).type('45'); // Expected Price
        cy.get('input[type="date"]').type('2024-04-19'); // Date
    
        // Submit the form
        cy.get('button[type="submit"]').click();
    
        // Ensure the modal closes after submitting the form
        cy.get('.modal-overlay').should('not.be.visible');
    
        // Ensure the added budget appears in the list
        cy.contains('Test Expense').should('exist');
    });
    
    it('should navigate to Budget List and edit an expense', () => {
    
        // Wait for the expense list to be loaded
        cy.get('table tbody tr').should('have.length.gt', 0);
    
        // Find the row containing the expense to edit
        cy.contains('Test Expense').parent('tr').within(() => {
            // Click on the edit button
            cy.get('td').eq(5).find('i.fa.fa-pencil').click();
        });
    
        // Ensure the modal is open for editing expenses
        cy.get('.modal-overlay').should('be.visible');
    
        // Modify the expense details
        cy.get('input[type="text"]').clear().type('Updated Test Expense');
        cy.get('select').select('Clothing');
        cy.get('input[type="number"]').eq(0).clear().type('60'); // Price
        cy.get('input[type="number"]').eq(1).clear().type('55'); // Expected Price
        cy.get('input[type="date"]').clear().type('2024-04-02'); // Date
    
        // Submit the form
        cy.get('button[type="submit"]').click();
    
        // Ensure the modal closes after submitting the form
        cy.get('.modal-overlay').should('not.be.visible');
    
        // Ensure the edited expense appears in the list
        cy.contains('Updated Test Expense').should('exist');
    });
    
    it('should navigate to Budget List and delete an expense', () => {    
        // Get the initial row count
        cy.get('table tbody tr').should('have.length.gt', 0).as('initialRowCount');
    
        // Find the row containing the expense to delete
        cy.contains('Test Expense').parent('tr').within(() => {
            // Click on the delete button
            cy.get('td').eq(5).find('i.fa.fa-trash').click();
        });
    
        // Ensure the initial row count is greater than the final row count
        cy.get('@initialRowCount').then(initialRowCount => {
            cy.get('table tbody tr').should('have.length.lt', initialRowCount.length);
        });
    });
    
});