describe('User Registration', () => {
    beforeEach(() => {
      // Visit the homepage before each test
      cy.visit('https://povio-at.herokuapp.com')
    })
  
    it('should successfully register a new user', () => {
      // Generate a unique email using timestamp
      const timestamp = new Date().getTime()
      const testEmail = `testuser${timestamp}@example.com`
      const testPassword = 'TestPassword123!'
      const testUsername = `testuser${timestamp}`
  
      // Click on Sign up link
      cy.contains('Sign up').click()
  
      // Verify we're on the registration page
      cy.url().should('include', '/users/sign_up')
  
      // Debug: Log the form elements
      cy.get('form').then($form => {
        console.log($form.html())
      })
  
      // Fill out the registration form using more generic selectors initially
      cy.get('input#user_username').type(testUsername)
      cy.get('input#user_email').type(testEmail)
      cy.get('input#user_password').type(testPassword)
      cy.get('input#user_password_confirmation').type(testPassword)
  
      // Submit the form
      cy.get('input[type="submit"], button[type="submit"]').click()
  
      // Verify successful registration
      cy.url().should('not.include', '/users/sign_up')
      
      // Verify user is logged in
      cy.contains(testUsername).should('be.visible')
    })
  
    it('should show validation errors for invalid input', () => {
      // Click on Sign up link
      cy.contains('Sign up').click()
  
      // Try to submit empty form
      cy.get('input[type="submit"], button[type="submit"]').click()
  
      // Verify validation errors are shown
      cy.get('form').should('contain', 'can\'t be blank')
    })
  })
  