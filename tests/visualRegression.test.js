const FRONTEND_BASE_URL = `http://localhost:3000/login`;
import { Selector } from 'testcafe';
import { Eyes, Target } from '@applitools/eyes-testcafe';

fixture`Visual Regression Test`.page`${FRONTEND_BASE_URL}`;

const eyes = new Eyes();
eyes.setApiKey('your-applitools-api-key');

test('Check homepage UI', async t => {
    await eyes.open(t, 'React App', 'Homepage');

    // Navigate to homepage or any specific page/component to test
    await t
        .navigateTo('/')
        .wait(1000); // Add a wait if necessary for any animations or async content loading

    // Take a screenshot of the entire page
    await eyes.check('Homepage', Target.window().fully());

    await eyes.close();
});
