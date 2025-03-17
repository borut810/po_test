describe('Registration - Duplicate Email Check', () => {
    const testEmail = `test${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const testName = 'Test User'
  
    before(() => {
      // Increase event listener limit to avoid warnings
      Cypress.config('maxListeners', 100)
    })
  
    beforeEach(() => {
      // Configure longer timeout
      Cypress.config('defaultCommandTimeout', 30000)
      Cypress.config('pageLoadTimeout', 30000)
  
      // Set up a new session for each test
      cy.session('registration-test', () => {})
    })
  
    it('should not allow registration with an existing email', () => {
      // First registration
      cy.visit('https://povio-at.herokuapp.com/users/sign_up')
      
      // Wait for the page to be fully loaded
      cy.get('body').should('be.visible')
      cy.get('main[role="main"]').should('be.visible')
      
      // Wait for form to be present and visible
      cy.get('form.new_user').should('exist').within(() => {
        // Fill out the first registration form
        cy.get('input[name="user[name]"]')
          .should('be.visible')
          .clear()
          .type(testName)
        
        cy.get('input[name="user[email]"]')
          .should('be.visible')
          .clear()
          .type(testEmail)
        
        cy.get('input[name="user[password]"]')
          .should('be.visible')
          .clear()
          .type(testPassword)
        
        cy.get('input[name="user[password_confirmation]"]')
          .should('be.visible')
          .clear()
          .type(testPassword)
        
        // Submit using the form submit button
        cy.get('input[type="submit"]')
          .should('be.visible')
          .click()
      })
  
      // Wait for registration to complete
      cy.wait(2000)
  
      // Second registration attempt
      cy.visit('https://povio-at.herokuapp.com/users/sign_up')
      
      // Wait for the page to be fully loaded
      cy.get('body').should('be.visible')
      cy.get('main[role="main"]').should('be.visible')
      
      // Wait for form to be present and visible
      cy.get('form.new_user').should('exist').within(() => {
        // Fill out the second registration form
        cy.get('input[name="user[name]"]')
          .should('be.visible')
          .clear()
          .type(testName)
        
        cy.get('input[name="user[email]"]')
          .should('be.visible')
          .clear()
          .type(testEmail)
        
        cy.get('input[name="user[password]"]')
          .should('be.visible')
          .clear()
          .type(testPassword)
        
        cy.get('input[name="user[password_confirmation]"]')
          .should('be.visible')
          .clear()
          .type(testPassword)
        
        // Submit using the form submit button
        cy.get('input[type="submit"]')
          .should('be.visible')
          .click()
      })
  
      // Check for error message
      cy.get('.form-group')
        .should('exist')
        .and('contain.text', /email|taken|exists|already/i)
    })
  
    afterEach(() => {
      // Clean up after each test
      cy.clearCookies()
      cy.clearLocalStorage()
    })
  
    // Add a retry mechanism
    Cypress.Commands.add('retryFillForm', { prevSubject: false }, (options) => {
      const maxAttempts = 3
      let attempts = 0
  
      function attempt() {
        if (attempts >= maxAttempts) return
        attempts++
  
        cy.get('form.new_user').then($form => {
          if ($form.length) {
            fillForm()
          } else {
            cy.wait(1000)
            attempt()
          }
        })
      }
  
      attempt()
    })
  
    it('should debug the sign-up page structure', () => {
      // Visit the sign-up page
      cy.visit('https://povio-at.herokuapp.com/users/sign_up', {
        failOnStatusCode: false,
        timeout: 30000
      })
      
      // Log the current URL to see if we're being redirected
      cy.url().then(url => {
        cy.log('Current URL:', url)
      })
  
      // Log all forms on the page
      cy.get('form').then($forms => {
        cy.log('Number of forms found:', $forms.length)
        $forms.each((i, form) => {
          cy.log('Form details:', {
            id: form.id,
            className: form.className,
            action: form.action,
            method: form.method
          })
        })
      })
  
      // Log all inputs on the page
      cy.get('input').then($inputs => {
        cy.log('Number of inputs found:', $inputs.length)
        $inputs.each((i, input) => {
          cy.log('Input details:', {
            type: input.type,
            name: input.name,
            id: input.id,
            value: input.value
          })
        })
      })
  
      // Log the entire page content
      cy.get('html').then($html => {
        cy.log('Page HTML:', $html.html())
      })
  
      // Pause the test so we can inspect the page
      cy.pause()
    })
  
    it('should be able to access the sign-up page', () => {
      // Visit the homepage first
      cy.visit('https://povio-at.herokuapp.com/')
      
      // Log the current URL
      cy.url().then(url => {
        cy.log('Current URL:', url)
      })
  
      // Log all links on the page
      cy.get('a').each($a => {
        cy.log('Link:', $a.text(), 'href:', $a.attr('href'))
      })
  
      // Log all forms on the page
      cy.get('form').each($form => {
        cy.log('Form:', $form.attr('id'), 'action:', $form.attr('action'))
      })
  
      // Pause the test for manual inspection
      cy.pause()
    })
  }) 