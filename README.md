# Watchlist - a TV Series Tracker - now with Firebase auth and Firestore

This started out as a book-library project to solidify and exercise usage of Javascript prototypes. However - as someone who watches more TV than reads books - I soon pivoted to a TV series watchlist which proved more motivating. The project then ballooned in sincerity and took much longer than expected as things were added and the frontend was endlessly tweaked, including using an API to retrieve TV show details.

As it stands, the process involves searching a large TV database for any given show, and noting whether the series is "Complete" or not (e.g filming has finished or not). This must be ascertained manually, by user research, due to the nature of it. Hence, when 'Query'ing the show, you are given a link to the show on the TV database to investigate this (in case you don't already know). 

Cards are populated on the page and can be toggled from Complete to Ongoing & vice versa, which is saved to the library array for you (per-device, due to localStorage). These cards can be removed and the link is again included.

A color-scheme-change button is included for those who like to be fancy (this setting is also saved).

The page should be fully responsive on mobile. I appreciate the learning outcomes I achieved in the course of investigating this.

I learned a great deal in the process and became more familiar with the usage of root vars, responsive sizing without the use of media queries, various complex CSS selectors, API usage, complex Javascript and related functions, and prototypes.

This is a 'final' version with support for Firebase for permanent saving and authorization capabilities. Additionally, it has a demo mode, where the user's library is saved to localStorage and can be seamlessly integrated into Firebase upon logging in.



