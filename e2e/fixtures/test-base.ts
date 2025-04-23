/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { HomePage } from "../page-objects/home-page";
import { GeneratePage } from "../page-objects/generate-page";
import { ApiContext } from "../helpers/api-context";

// Rozszerzamy bazowy test Playwright o nasze Page Objects i konteksty
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  generatePage: GeneratePage;
  apiContext: ApiContext;
}>({
  // Definicje fixture'ów - będą dostępne w każdym teście
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  generatePage: async ({ page }, use) => {
    const generatePage = new GeneratePage(page);
    await use(generatePage);
  },
  apiContext: async ({ request }, use) => {
    const apiContext = new ApiContext(request);
    await use(apiContext);
  },
});

// Eksportujemy expect, aby ułatwić import w plikach testowych
export { expect } from "@playwright/test";
