const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const baseUrl = process.argv[2] || "http://127.0.0.1:8082";
const outputDir = path.resolve(
  process.argv[3] || ".gstack/design-reports/responsive-audit-20260904",
);
const allRoutes = [
  ["intro", "/"],
  ["onboarding", "/onboarding"],
  ["home", "/?skipSplash=1"],
  ["temples", "/temples"],
  ["packages", "/packages"],
  ["puja", "/puja"],
  ["more", "/more"],
  ["accommodation", "/services/accommodation"],
  ["jyotirlingas", "/services/jyotirlingas"],
  ["coming-soon", "/coming-soon"],
  ["package-list", "/packages/list"],
  ["package-form", "/packages/form"],
];
const allViewports = [
  ["short", 320, 568],
  ["compact", 375, 667],
  ["phone", 390, 844],
  ["tablet", 768, 1024],
  ["desktop", 1024, 768],
];
const selectedRoutes = new Set(
  (process.env.AUDIT_ROUTES || "").split(",").filter(Boolean),
);
const selectedViewports = new Set(
  (process.env.AUDIT_VIEWPORTS || "").split(",").filter(Boolean),
);
const waitMs = Number(process.env.AUDIT_WAIT_MS || 4_000);
const routes = selectedRoutes.size
  ? allRoutes.filter(([name]) => selectedRoutes.has(name))
  : allRoutes;
const viewports = selectedViewports.size
  ? allViewports.filter(([name]) => selectedViewports.has(name))
  : allViewports;

fs.mkdirSync(path.join(outputDir, "screenshots"), { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const [viewportName, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    if (process.env.MOCK_ONBOARDING === "1") {
      await page.route("**/wp-json/custom/v1/onboarding", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              title: "Plan your Ujjain pilgrimage",
              description: "Find temples, stays, and travel packages in one place.",
              image: "",
            },
            {
              id: 2,
              title: "Keep sacred places close",
              description: "Explore trusted details before you begin your journey.",
              image: "",
            },
          ]),
        }),
      );
    }
    if (process.env.MOCK_APP_DATA === "1") {
      const image =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23c9684f'/%3E%3C/svg%3E";
      await page.route("**/wp-json/custom/v1/packages*", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              name: "Mahakal Darshan Journey",
              image,
              price: "4999",
              duration: "2 days",
              description: "A peaceful guided visit across Ujjain.",
              package_details: {
                package_description: "<p>A calm and complete pilgrimage.</p>",
                price: "4999",
                duration: "2 days",
                pickup_location: "Ujjain station",
                drop_location: "Ujjain station",
                transport: "Private car",
                stay_type: "Comfort hotel",
                meals: "Breakfast",
                short_description: "A complete Ujjain pilgrimage.",
              },
              additional_info: {
                things_to_carry: "<li>Photo ID</li><li>Water bottle</li>",
                cancellation_policy: "Free cancellation up to 48 hours.",
                terms_conditions: "Subject to temple timings.",
                notes: "Wear comfortable footwear.",
              },
            },
          ]),
        }),
      );
      await page.route("**/wp-json/custom/v1/service/accommodation", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            type: "accommodation",
            title: "Accommodation",
            hero: {
              title: "Stay close to the sacred city",
              subtitle: "Comfortable options for every pilgrimage.",
              image,
              cta: "Explore stays",
            },
            highlights: [{ icon: "", label: "Near Mahakal" }],
            hotels: [
              {
                id: "hotel-1",
                name: "Shipra Residency",
                location: "Mahakal Road",
                rating: 9,
                thumbnail: image,
                gallery: [image, image],
                price: 2400,
                category: "comfort",
                amenities: [{ name: "Breakfast", description: "", featured: true }],
              },
            ],
            linked_packages: [],
          }),
        }),
      );
      await page.route("**/wp-json/custom/v1/services*", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              title: "Accommodation",
              content: "",
              featured_image: "",
              acf: {
                service_name: "Accommodation",
                service_short_dis: "Comfortable stays",
                service_icon: image,
                service_list_image: image,
                service_detail_img: image,
              },
            },
            {
              id: 2,
              title: "Jyotirlinga Tour",
              content: "",
              featured_image: "",
              acf: {
                service_name: "Jyotirlinga Tour",
                service_short_dis: "Sacred journeys",
                service_icon: image,
                service_list_image: image,
                service_detail_img: image,
              },
            },
          ]),
        }),
      );
    }
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const [name, route] of routes) {
      consoleErrors.length = 0;
      let navigationError = null;
      try {
        await page.goto(`${baseUrl}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 45_000,
        });
        await page.waitForTimeout(name === "intro" ? 1_500 : waitMs);
        if (process.env.AUDIT_MODAL_FLOW === "1" && name === "packages") {
          await page.getByText("Latest Packages", { exact: true }).click();
          await page.getByText("View Details", { exact: true }).first().click();
          await page.waitForTimeout(waitMs);
        }
        if (process.env.AUDIT_MODAL_FLOW === "1" && name === "accommodation") {
          await page.getByText("Shipra Residency", { exact: true }).first().click();
          await page.waitForTimeout(waitMs);
        }
      } catch (error) {
        navigationError = error.message;
      }

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const interactive = [
          ...document.querySelectorAll(
            'a,button,input,[role="button"],[role="tab"],[tabindex="0"]',
          ),
        ];
        const undersized = interactive
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName,
              role: element.getAttribute("role"),
              text: (element.textContent || element.getAttribute("aria-label") || "")
                .trim()
                .slice(0, 40),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          })
          .filter(
            ({ width, height }) => width > 0 && height > 0 && (width < 44 || height < 44),
          )
          .slice(0, 30);

        const clipped = [...document.querySelectorAll("body *")]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName,
              text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter(({ left, right, width }) => width > 0 && (left < -1 || right > innerWidth + 1))
          .slice(0, 30);

        return {
          title: document.title,
          url: location.href,
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
          scrollWidth: Math.max(root.scrollWidth, body?.scrollWidth || 0),
          scrollHeight: Math.max(root.scrollHeight, body?.scrollHeight || 0),
          bodyText: (body?.innerText || "").trim().replace(/\s+/g, " ").slice(0, 500),
          interactiveCount: interactive.length,
          undersized,
          clipped,
        };
      });

      const screenshotPath = path.join(
        outputDir,
        "screenshots",
        `${name}-${viewportName}.png`,
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      let onboardingFlow = null;
      if (name === "onboarding" && process.env.AUDIT_ONBOARDING_FLOW === "1") {
        await page.getByText("Skip", { exact: true }).first().click();
        await page.waitForTimeout(500);
        const afterSkip = page.url();
        await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(4_000);
        const homeMetrics = await page.evaluate(() => {
          const interactive = [
            ...document.querySelectorAll(
              'a,button,input,[role="button"],[role="tab"],[tabindex="0"]',
            ),
          ];
          return {
            scrollWidth: Math.max(
              document.documentElement.scrollWidth,
              document.body?.scrollWidth || 0,
            ),
            viewportWidth: innerWidth,
            undersized: interactive
              .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  text: (element.textContent || element.getAttribute("aria-label") || "")
                    .trim()
                    .slice(0, 40),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                };
              })
              .filter(
                ({ width, height }) =>
                  width > 0 && height > 0 && (width < 44 || height < 44),
              ),
          };
        });
        await page.screenshot({
          path: path.join(
            outputDir,
            "screenshots",
            `home-success-${viewportName}.png`,
          ),
          fullPage: true,
        });
        if (process.env.AUDIT_HOME_BOTTOM === "1") {
          await page.mouse.wheel(0, 10_000);
          await page.waitForTimeout(500);
          await page.screenshot({
            path: path.join(
              outputDir,
              "screenshots",
              `home-bottom-${viewportName}.png`,
            ),
            fullPage: true,
          });
        }
        let homeCtaFlow = null;
        if (process.env.AUDIT_HOME_CTA === "1") {
          await page.getByText("Explore Now", { exact: true }).click();
          await page.waitForTimeout(500);
          homeCtaFlow = {
            url: page.url(),
            text: (await page.locator("body").innerText())
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 200),
          };
        }
        onboardingFlow = {
          afterSkip,
          afterReload: page.url(),
          afterReloadText: (await page.locator("body").innerText())
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 200),
          homeMetrics,
          homeCtaFlow,
        };
      }
      results.push({
        route: name,
        viewport: viewportName,
        width,
        height,
        navigationError,
        consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
        ...metrics,
        onboardingFlow,
        screenshotPath,
      });
    }

    await context.close();
  }

  await browser.close();
  fs.writeFileSync(
    path.join(outputDir, "baseline.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
