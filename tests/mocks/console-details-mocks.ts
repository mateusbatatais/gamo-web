// tests/e2e/mocks/console-details-mocks.ts
import { Page, Route } from "@playwright/test";

export const mockConsoleDetailsAPI = async (page: Page) => {
  await page.route("**/api/consoles/*", async (route: Route) => {
    await page.waitForTimeout(500);

    const url = route.request().url();
    const slug = url.split("/").pop() || "ps5-slim";

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        consoleId: 1,
        consoleName: "PlayStation 5",
        name: "Slim",
        slug: slug,
        brand: {
          id: 1,
          slug: "sony",
          imageUrl: "/images/brands/sony.svg",
        },
        generation: 9,
        type: "Home Console",
        releaseDate: "2020-11-12",
        launchDate: "2020-11-12",
        storageOptions: [{ value: 825, unit: "GB", note: "SSD" }],
        mediaFormats: [{ id: 1, name: "Ultra HD Blu-ray" }],
        allDigital: false,
        cpu: "AMD Zen 2, 8-core, 3.5GHz",
        gpu: "AMD RDNA 2, 10.3 TFLOPS",
        ram: "16GB GDDR6",
        resolution: "4K UHD, 120Hz",
        audio: "Tempest 3D AudioTech",
        connectivity: "Wi-Fi 6, Bluetooth 5.1, USB-C",
        retroCompatible: true,
        retroCompatibilityNotes: "Compatible with PS4 games",
        notes: [
          { id: 1, text: "First PlayStation console to support 8K output" },
          { id: 2, text: "Features haptic feedback in the DualSense controller" },
        ],
        imageUrl: "https://via.placeholder.com/400x300",
        consoleDescription: "Next-generation gaming console",
        isFavorite: false,
        skins: [
          {
            id: 1,
            slug: "ps5-standard-black",
            name: "Standard Black",
            editionName: "Standard",
            limitedEdition: false,
            material: "Plastic",
            finish: "Matte",
            imageUrl: "https://via.placeholder.com/300x200",
          },
          {
            id: 2,
            slug: "ps5-white",
            name: "White Edition",
            editionName: "Launch Edition",
            limitedEdition: true,
            material: "Plastic",
            finish: "Glossy",
            imageUrl: "https://via.placeholder.com/300x200",
          },
        ],
      }),
    });
  });
};

export const mockAccessoriesAPI = async (page: Page) => {
  await page.route("**/api/accessories*", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          accessoryId: 1,
          slug: "dualsense-controller",
          name: "DualSense Wireless Controller",
          description: "Next-generation gaming controller",
          editionName: "Standard",
          imageUrl: "https://via.placeholder.com/300x200",
        },
        {
          id: 2,
          accessoryId: 2,
          slug: "pulse-3d-headset",
          name: "PULSE 3D Wireless Headset",
          description: "3D audio supported headset",
          editionName: null,
          imageUrl: "https://via.placeholder.com/300x200",
        },
      ]),
    });
  });
};

export const mockBrandsAPI = async (page: Page) => {
  await page.route("**/api/brands**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ slug: "sony", name: "Sony" }]),
    });
  });
};
