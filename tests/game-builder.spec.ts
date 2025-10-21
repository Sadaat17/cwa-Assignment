import { test, expect } from '@playwright/test';

test.describe('Game Builder Flow', () => {
    test('should create a game with 5 challenges and build successfully', async ({ page }) => {
        // Navigate to the game page
        await page.goto('/escape-room');

        // Wait for builder to load
        await expect(page.getByText('Game Builder')).toBeVisible();

        // Set timer
        await page.fill('input[type="number"]', '120');

        // Fill in 5 challenges
        const challenges = [
            {
                buggy: 'print("Hello"',
                correct: 'print("Hello")',
            },
            {
                buggy: 'def test():\nreturn 5',
                correct: 'def test():\n    return 5',
            },
            {
                buggy: 'x = [1,2,3]\nprint(x[3])',
                correct: 'x = [1,2,3]\nprint(x[2])',
            },
            {
                buggy: 'my-var = 10',
                correct: 'my_var = 10',
            },
            {
                buggy: 'age = 25\nprint("Age: " + age)',
                correct: 'age = 25\nprint("Age: " + str(age))',
            },
        ];

        // Use CSS selector to find challenge sections
        const challengeSections = page.locator('.bg-gray-50.p-6.rounded-xl');

        for (let i = 0; i < challenges.length; i++) {
            const challengeSection = challengeSections.nth(i);

            // Fill buggy code
            const buggyTextarea = challengeSection.locator('textarea').first();
            await buggyTextarea.fill(challenges[i].buggy);

            // Fill correct answer
            const correctTextarea = challengeSection.locator('textarea').nth(1);
            await correctTextarea.fill(challenges[i].correct);
        }

        // Click Build Game button
        await page.getByRole('button', { name: /Build Game/i }).click();

        // Wait for transition to game mode
        await page.waitForTimeout(2000);


        // Verify game mode is loaded
        await expect(page.getByText('Start Game')).toBeVisible();
        await expect(page.getByText('120s')).toBeVisible();
    });

    test('should show alert if challenges are incomplete', async ({ page }) => {
        await page.goto('/escape-room');

        // Don't fill all challenges
        const firstChallenge = page.locator('div:has-text("Challenge 1")').first();
        await firstChallenge.locator('textarea').first().fill('print("test"');

        // Try to build
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('Please fill in all 5 challenges');
            dialog.accept();
        });

        await page.getByRole('button', { name: /Build Game/i }).click();
    });
});