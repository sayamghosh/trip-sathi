import { chromium } from 'playwright'
import path from 'path'

async function run() {
  console.log('Launching headless Chromium via Playwright...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  })
  const page = await context.newPage()

  const screenshotDir = 'C:\\Users\\mriga\\.gemini\\antigravity-ide\\brain\\5317cf5f-b6d1-4262-86bd-906ad6cda1f9'

  console.log('Navigating to Sign-In page...')
  await page.goto('http://localhost:5173/sign-in')
  await page.waitForTimeout(3000)

  console.log('Taking login page screenshot...')
  await page.screenshot({ path: path.join(screenshotDir, '01_login_page.png') })

  console.log('Filling super admin credentials...')
  await page.fill('input[placeholder="name@example.com"]', 'admin')
  await page.fill('input[placeholder="********"]', 'admin@ts.com')
  
  console.log('Clicking Sign in button...')
  await page.click('button:has-text("Sign in")')
  await page.waitForTimeout(6000) // wait for auth API and dashboard redirection

  console.log('Taking dashboard screenshot...')
  await page.screenshot({ path: path.join(screenshotDir, '02_dashboard.png') })

  console.log('Navigating directly to Agents page...')
  await page.goto('http://localhost:5173/agents')
  await page.waitForTimeout(4000)

  console.log('Taking agents list screenshot...')
  await page.screenshot({ path: path.join(screenshotDir, '03_agents_list.png') })

  console.log('Checking for active agents in listing...')
  const viewProfileLink = page.locator('a:has-text("View Profile")').first()
  if (await viewProfileLink.count() > 0) {
    console.log('Clicking the first View Profile button...')
    await viewProfileLink.click()
    await page.waitForTimeout(4000)
    
    console.log('Taking agent profile detail screenshot...')
    await page.screenshot({ path: path.join(screenshotDir, '04_agent_detail.png') })
  } else {
    console.log('No agents found in listing table (database might be empty of guides).')
  }

  await browser.close()
  console.log('E2E Browser test completed successfully!')
}

run().catch(err => {
  console.error('Playwright E2E test crashed:', err)
  process.exit(1)
})
