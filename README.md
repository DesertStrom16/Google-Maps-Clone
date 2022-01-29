# TruckMap Mobile Engineering Challenge

This project is intended to touch a few key technologies that TruckMap uses regularly to help us understand how you think about trade-offs between time, usefulness, and simplicity in a realistic setting.

We are respectful of your time. If we’ve requested you do this challenge, we’ll pay **$200 for any submission** in good faith effort, regardless of whether you’re ultimately hired.

## Requirements

Build a React Native app that allows users to search through a list of people, puts a selected person result randomly on a map, and displays a simple profile card about them.

### Product

1. Allow the user to search through a random list of people. These people also have a random association of interests and hobbies. The data files are in `./src/data`.
2. Render a fullscreen map as the main screen. Think Google Maps UI but instead of searching addresses it’s searching people.
3. Allow the user to "typeahead search" the people and show the autocompleted results as they type. The info indexed for the search is up to you, but there are potential ways to be creative here.
4. When the user selects a person in the results, put that person on the map at a random location (location boundaries are up to you).
5. Show a profile card for the person on the map. The info shown and UI of the card are up to you.
6. Geocode where the user was randomly placed and include some of that info in the profile.
7. Make sure to handle the “No results” edge case (like if they were placed in water). Take a look [here](https://services.gisgraphy.com/reversegeocoding/search?format=json&lat=41.88832&lng=-87.623177) for a free geocoding endpoint.

### Technical

1. Stub the API such that accessing the people and interests is asynchronous, as if it were making requests to a remote server.
2. Use React hooks or Redux (whichever you prefer) to store the application’s state and process any network responses.
3. Do the search logic in the API. We pay particular attention to how this is implemented, so try to create an elegant solution that handles a few edge cases.
4. Separate business logic from the app's UI components.
5. New components and modules should be created using TypeScript. React components should be functional and make use of hooks.
6. Consider the aesthetics and usability of the app. We will have design resources available, but there will be times when you'll need to fill in the gaps without outside help.
7. Feel free to use any additional third-party styling or component libraries.

## Submitting

1. Add to this readme file with any instructions, assumptions you made, and a few ideas for features you might add if the app was taken any further. Please also include a few screenshots or a GIF or video showing the app in use.
2. Zip and email your repository to us. You can remove `node_modules` to reduce size.
3. We will provide constructive and timely feedback on your submission with a clear direction around next steps. Thank you for your time.

## Project Setup

1. Install dependencies:

```
npm i
cd ios
bundle install
bundle exec pod install
```

2. Create a Mapbox [access token](https://docs.mapbox.com/help/glossary/access-token/), and add it to `./index.js`.

3. For iOS, open `./ios/Challenge.xcworkspace` and build and run. For Android, open an emulator or connect a device and run `npx react-native run-android`. See [here](https://reactnative.dev/docs/running-on-device) for help.

## Submission Notes

[Add your notes here.]
