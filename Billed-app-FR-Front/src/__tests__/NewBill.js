/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen } from "@testing-library/dom";
 import NewBillUI from "../views/NewBillUI.js";
 import NewBill from "../containers/NewBill.js";
 import { ROUTES, ROUTES_PATH } from "../constants/routes";

 import userEvent from "@testing-library/user-event"
 import mockStore from "../__mocks__/store";
 
 describe("Given I am connected as an employee", () => {
   describe("When I submit a new Bill", () => {
     // Vérifie que la page fonctionne
     test("It must save the bill", () => {

       document.body.innerHTML = NewBillUI()
   
       const formNewBill = screen.getByTestId("form-new-bill")
       expect(formNewBill).toBeTruthy()
     });
 
   })


   //Vérifier que la note de frais à été créee
   test("Then verify the file bill", async() => {

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }      

    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))

    document.body.innerHTML = NewBillUI()

    const newBillInit = new NewBill({ document, onNavigate, store: mockStore })

    const file = new File(['image'], 'image.png');
    const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
    const formNewBill = screen.getByTestId("form-new-bill")
    const billFile = screen.getByTestId('file');

    billFile.addEventListener("change", handleChangeFile);     
    userEvent.upload(billFile, file)
    
    expect(billFile.files[0].name).toBeDefined()
    expect(handleChangeFile).toBeCalled()
   
    const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
    formNewBill.addEventListener("submit", handleSubmit);     
    fireEvent.submit(formNewBill);
    expect(handleSubmit).toHaveBeenCalled();

  })



    //Vérfier que la note de frais a été créée (POST)
    test("The bill is created", async () => {
      
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }      
  
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
  
    document.body.innerHTML = NewBillUI()
  
    const newBillInit = new NewBill({ document, onNavigate})
    
    
    //Note de frais
    const prototypeBill = {
            type: "Restaurants et bars",
            name: "Restaurant",
            date: "2022-05-23",
            amount: 105,
            vat: 80,
            pct: 60,
            commentary: "Test form",
            fileUrl: "test.jpg",
            fileName: "test.jpg",
            status: "pending"
        };
    
    //On remplit les champs
    screen.getByTestId("expense-type").value = prototypeBill.type;
    screen.getByTestId("expense-name").value = prototypeBill.name;
    screen.getByTestId("datepicker").value = prototypeBill.date;
    screen.getByTestId("amount").value = prototypeBill.amount;
    screen.getByTestId("vat").value = prototypeBill.vat;
    screen.getByTestId("pct").value = prototypeBill.pct;
    screen.getByTestId("commentary").value = prototypeBill.commentary;
          
    newBillInit.updateBill = jest.fn();
    
    //On récupère le bouton et on simule le click
    let buttonSendBill = document.getElementById("btn-send-bill")
    userEvent.click(buttonSendBill)
          
    //Vérfier que la note de frais a été créée
    expect(newBillInit.updateBill).toHaveBeenCalled()
       
  })



   


 })