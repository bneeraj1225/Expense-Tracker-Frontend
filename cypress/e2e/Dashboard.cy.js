const FRONTEND_BASE_URL = `http://104.131.74.55:3000`;

describe('Dashboard Component', () => {
    beforeEach(() => {
        cy.visit(`${FRONTEND_BASE_URL}/login`); // Visit the root URL of your application before each test
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
        cy.get('input[name="price"]').type('50'); // Expected Price
        cy.get('input[name="expectedPrice"]').type('45'); // Actual Price
        cy.get('input[type="date"]').type('2024-04-19'); // Date
    
        // Submit the form
        cy.get('button[name="expenseButton"]').click();
    
        // Ensure the modal closes after submitting the form
        cy.get('.modal-overlay').should('not.be.visible');
    
        // Ensure the added budget appears in the list
        cy.contains('Test Expense').should('exist');
    });

    it('should navigate to dashboard check charts', () => {
        // Visit the profile page
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the profile page
        cy.url().should('include', '/dashboard');
    });

    it('should display SpeedometerChart on dashboard', () => {

        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Check if SpeedometerChart is rendered
        cy.get('h2').contains('Speedometer Chart').should('exist');
        cy.get('div').contains('Total amount spent').should('exist');
        cy.get('div').contains('Total amount spent for this month').should('exist');
        cy.get('div').contains('Total amount spent for this year').should('exist');
    });

    it('should display PieCharts for actual and expected prices', () => {
    
        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Wait for the PieCharts to be rendered
        cy.get('.pie-chart').should('exist').then(() => {
            // Check if actual price PieChart is rendered
            cy.get('.pie-chart h2').contains('Pie Chart - Actual Price').should('exist');
            cy.get('canvas[data-testid="mock-pie-chart1"]').should('exist'); // Check if the canvas is rendered
    
            // Check if expected price PieChart is rendered
            cy.get('.pie-chart h2').contains('Pie Chart - Expected Price').should('exist');
            cy.get('canvas[data-testid="mock-pie-chart2"]').should('exist'); // Check if the canvas is rendered
        });
    });
    
        
    it('should display BarChart for actual and expected prices', () => {    
        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Wait for the BarChart canvas to be rendered
        cy.get('canvas[data-testid="mocked-bar-chart"]').should('exist').then(() => {
            // Check if the BarChart title is rendered
            cy.contains('Actual vs Expected Expenditure by Category').should('exist');
        });
    });

    it('should display DoughnutChart for expenses by category', () => {    
        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Wait for the DoughnutChart canvas to be rendered
        cy.get('canvas[data-testid="mocked-doughnut-chart"]').should('exist').then(() => {
            // Check if the DoughnutChart title is rendered
            cy.contains('Doughnut Chart').should('exist');
        });
    });

    it('should display LineChart for actual and expected prices by category', () => {
        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Wait for the LineChart canvas to be rendered
        cy.get('canvas[data-testid="mocked-line-chart"]').should('exist').then(() => {
            // Check if the LineChart title is rendered
            cy.contains('Line Chart').should('exist');
        });
    });
    

    it('should display BarChart for month', () => {
        // Visit the dashboard
        cy.contains('Dashboard').click();
    
        // Ensure the URL changes to the dashboard page
        cy.url().should('include', '/dashboard');
    
        // Wait for the LineChart canvas to be rendered
        cy.get('canvas[data-testid="mocked-bar-chart-month"]').should('exist').then(() => {
            // Check if the LineChart title is rendered
            cy.contains('Monthly Expenditure by Category for').should('exist');
        });
    });
    
});