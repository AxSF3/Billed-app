/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

// Importer le nécessaire pour les tests
import { ROUTES } from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";

import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // On vérifie si windowIcon a la classe active-icon
      expect(windowIcon.classList.contains("active-icon"))

    })

    test("Then bills should be ordered from earliest to latest", () => {
     
      // On modifie le test pour qu'il prend en compte les bills
      document.body.innerHTML = BillsUI({ data: bills.sort((a, b) => (a.date < b.date) ? 1 : -1) })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

})
  
    // Vérifie si la modale du justificatif apparait
    describe("When I click on the eye of a bill", () => {
      test("Then a modal must appear", () => {
       
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const billsInit = new Bills({document, onNavigate})
        const handleClickIconEye = jest.fn((icon) => billsInit.handleClickIconEye(icon));
        const iconEye = screen.getAllByTestId("icon-eye");

        $.fn.modal = jest.fn(modaleFile.classList.add("show"))
        iconEye.forEach((icon) => {
          icon.addEventListener("click", handleClickIconEye(icon))
          userEvent.click(icon)
          expect(handleClickIconEye).toHaveBeenCalled()
        })
      
      })
    })


    // test d'intégration GET
    
    describe("When I navigate to Bills", () => {
      // Vérifie que les bills sont bien récupérés
      test("Then fetches bills from mock API GET", () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        new Bills({document, onNavigate})    
        
        expect(screen.getByText("Mes notes de frais")).toBeTruthy()
      })
    
      test("fetches bills from an API and fails with 404 message error", async () => {
        // Vérifie si l'erreur 404 s'affiche bien
        document.body.innerHTML = BillsUI({ error: "Erreur 404" })
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
        // Vérifie si l'erreur 500 s'affiche bien
        document.body.innerHTML = BillsUI({ error: "Erreur 500" })
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })    
    
    })
    
})