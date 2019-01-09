describe("dialogs", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`new feature dialog should 
  -not show a warning for a circular feature that fits within the sequence bounds if the sequence is circular

  `, ()=> {
    //open the new feature dialog
    cy.get(".tg-menu-bar").contains("Edit").click()
    cy.contains("New Feature").click()
    //change the start/end inputs to be making an origin spanning feature
    cy.get(".tg-test-name input").clear().type("Fake name")
    cy.get(".tg-test-start input").clear().type("400")
    cy.get(".tg-test-end input").clear().type("20")
    
    // verify that we can make that feature
    cy.get(".tg-upsert-feature").contains("Save").click()
    cy.get(".tg-test-end .bp3-intent-danger").should("not.exist")
    cy.get(".tg-test-start .bp3-intent-danger").should("not.exist")
    cy.get(".veLabelText").contains("Fake name").should("be.visible")
  })
  it(`new part dialog should 
  -show a warning for a circular part that goes beyond the sequence
  -not show a warning for a circular part that fits within the sequence bounds if the sequence is circular

  `, ()=> {
    //open the new feature dialog
    cy.get(".tg-menu-bar").contains("Edit").click()
    cy.contains("New Part").click()
    //change the start/end inputs to be making an origin spanning feature
    cy.get(".tg-test-name input").clear().type("Fake name")
    cy.get(".tg-test-start input").clear().type("400")
    cy.get(".tg-test-end input").clear().type("200000")
    
    // verify that we can't make an out of range part
    cy.get(".tg-upsert-part").contains("Save").click()
    cy.get(".tg-test-start .bp3-intent-danger").should("exist")

    // fix the range issue and verify that we can make that feature    
    cy.get(".tg-test-end input").clear().type("20")
    cy.get(".tg-upsert-part").contains("Save").click()
    cy.get(".tg-test-end .bp3-intent-danger").should("not.exist")
    cy.get(".tg-test-start .bp3-intent-danger").should("not.exist")
    cy.get(".veLabelText").contains("Fake name").should("be.visible")
  })

  it(`part dialog should
  -handle changing strand direction
  -todo handle notes add`, function() {

    //open the edit part dialog by right clicking part 0
    cy.get(".veLabelText").contains("Part 0").trigger('contextmenu', {force: true})
    cy.contains("Edit Part").click()
    //make an assertion that the part strand is currently negative
    cy.get(".tg-test-forward").contains("Negative").find("input").should("be.checked")
    cy.get(".tg-test-forward").contains("Positive").find("input").should("not.be.checked")
    // cy.get(`input[name="forward"]`).should("be.checked")

    //change the part strand from negative to positive 
    cy.get(".tg-test-forward").contains("Positive").click()
    cy.get(".tg-upsert-part").contains("Save").click()

    //re-open the dialog and make sure the strand stays positive
    cy.get(".veLabelText").contains("Part 0").trigger('contextmenu', {force: true})
    cy.contains("Edit Part").click()
    cy.get(".tg-test-forward").contains("Negative").find("input").should("not.be.checked")
    cy.get(".tg-test-forward").contains("Positive").find("input").should("be.checked")

    

    
  })
});