import { test, expect } from '@playwright/test';

test.describe('Game Play Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/escape-room');

        // Build a game first
        await page.fill('input[type="number"]', '180');

        const challenges = [
            { buggy: 'print("Hi"', correct: 'print("Hi")' },
            { buggy: 'def f():\nreturn 1', correct: 'def f():\n    return 1' },
            { buggy: 'a=[1]\nprint(a[1])', correct: 'a=[1]\nprint(a[0])' },
            { buggy: 'x-y = 5', correct: 'x_y = 5' },
            { buggy: 'n=5\nprint("n:"+n)', correct: 'n=5\nprint("n:"+str(n))' },
        ];

        // Use CSS selector to find challenge sections
        const challengeSections = page.locator('.bg-gray-50.p-6.rounded-xl');

        for (let i = 0; i < challenges.length; i++) {
            const section = challengeSections.nth(i);
            await section.locator('textarea').first().fill(challenges[i].buggy);
            await section.locator('textarea').nth(1).fill(challenges[i].correct);
        }

        await page.getByRole('button', { name: /Build Game/i }).click();

        // Wait for game to be built
        await page.waitForTimeout(1000);
    });

    test('should start game and show first challenge', async ({ page }) => {
        // Start the game
        await page.getByRole('button', { name: /Start Game/i }).click();

        // Verify game started
        await expect(page.getByText('Pause Timer')).toBeVisible();
        await expect(page.getByText(/Python Challenge 1/)).toBeVisible();
    });

    test('should show error on wrong answer and success on correct answer', async ({ page }) => {
        await page.getByRole('button', { name: /Start Game/i }).click();

        // Submit wrong answer
        const answerArea = page.locator('textarea').last();
        await answerArea.fill('wrong answer');
        await page.getByRole('button', { name: /Submit Code/i }).click();

        // Check for error
        await expect(page.getByText(/Incorrect/i)).toBeVisible();

        // Submit correct answer
        await answerArea.fill('print("Hi")');
        await page.getByRole('button', { name: /Submit Code/i }).click();

        // Should move to next challenge
        await expect(page.getByText(/Python Challenge 2/)).toBeVisible();
    });

    test('should show notification after 15 seconds', async ({ page }) => {
        await page.getByRole('button', { name: /Start Game/i }).click();

        // Wait for 15 seconds + buffer
        await page.waitForTimeout(16000);

        // Check if notification appears
        const notification = page.locator('.fixed.bottom-10.right-10');
        await expect(notification).toBeVisible();
    });

});