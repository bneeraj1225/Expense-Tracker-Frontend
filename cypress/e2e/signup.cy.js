const FRONTEND_BASE_URL = `http://localhost:3000`;

describe('Signup Component', () => {
  beforeEach(() => {
      cy.visit(FRONTEND_BASE_URL); // Visit the root URL of your application before each test
  });

  it('should successfully sign up a user (E2E)', () => {
    cy.get('.signup-form[name="name"]').type('John Doe');
    cy.get('.signup-form[name="email"]').type('john.doe@gmail.com');
    cy.get('.signup-form[name="password"]').type('John@123');
    cy.get('.signup-form[name="confirmPassword"]').type('John@123');
    cy.get('.signup-form[name="phoneNumber"]').type('1234567890');

    cy.get('.signup-button').click();
    if( cy.contains('Email already taken') ){
        cy.contains('Email already taken').should('be.visible');
    }
    else{
        cy.url().should('include', '/homepage'); // Verify URL changes to homepage after successful signup
    }
  });
  
  it('should handle UserRegistration failure (E2E)', () => {

    cy.get('.signup-form[name="name"]').type('Invalid User');
    cy.get('.signup-form[name="email"]').type('invalid.user@gmail.com');
    cy.get('.signup-form[name="password"]').type('weakPassword');
    cy.get('.signup-form[name="confirmPassword"]').type('weakPassword');
    cy.get('.signup-form[name="phoneNumber"]').type('1234567890');

    cy.get('.signup-button').click();
    cy.get('.error').should('be.visible');

    cy.get('.signup-form[name="password"]').type('Test@123');
    cy.get('.signup-form[name="confirmPassword"]').type('test@123');

    cy.get('.signup-button').click();
    cy.get('.error').should('be.visible');
    cy.contains('Passwords do not match').should('be.visible');
  });
});