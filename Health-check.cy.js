describe('Povio Website Health Check', () => {
    beforeEach(() => {
      // Clear any previous state
      cy.clearCookies();
      cy.clearLocalStorage();
  
      // Set up console error tracking
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });
    });
  
    it('performs end-to-end health check of the Povio website', () => {
      // Step 1: Visit the homepage
      cy.visit('https://povio-at.herokuapp.com')
        .then(() => {
          cy.log('Successfully loaded the homepage');
        });
  
      // Step 2: Verify navigation bar
      cy.get('nav')
        .should('exist')
        .within(() => {
          // Check if "Toggle navigation" button exists
          cy.contains('Toggle navigation')
            .should('exist')
            .then(() => {
              cy.log('Navigation toggle is present');
            });
        });
  
      // Step 3: Verify homepage content
      cy.contains('Welcome')
        .should('be.visible')
        .then(() => {
          cy.log('Welcome message is visible');
        });
  
      // Step 4: Check authentication links
      cy.contains('Sign in')
        .should('exist')
        .and('have.attr', 'href')
        .then(() => {
          cy.log('Sign in link is present');
        });
  
      cy.contains('Sign up')
        .should('exist')
        .and('have.attr', 'href')
        .then(() => {
          cy.log('Sign up link is present');
        });
  
      // Step 5: Verify basic page structure
      cy.get('body')
        .should('not.be.empty')
        .within(() => {
          // Check if main content area exists
          cy.get('main, .container, .content')
            .should('exist')
            .then(() => {
              cy.log('Main content area is present');
            });
        });
  
      // Step 6: Check for any console errors
      cy.get('@consoleError').then((spy) => {
        expect(spy).to.not.be.called;
        cy.log('No console errors detected');
      });
  
      // Step 7: Verify server health
      cy.request({
        url: 'https://povio-at.herokuapp.com',
        failOnStatusCode: false,
        timeout: 10000
      }).then((response) => {
        expect(response.status).to.be.within(200, 299);
        cy.log('Server is responding correctly');
      });
  
      // Step 8: Final health status
      cy.log('✅ All health checks passed successfully');
    });
  
    afterEach(function() {
      // Take screenshot if test fails
      if (this.currentTest.state === 'failed') {
        cy.screenshot('povio-health-check-failure');
        cy.log('❌ Health check failed - screenshot taken');
      }
    });
  }); 